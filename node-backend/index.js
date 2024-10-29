const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));

const upload = multer({ dest: 'uploads/' });
console.log('node deployed');
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const imagePath = req.file.path;

        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));
        console.log(formData.getHeaders())

        const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
            headers: formData.getHeaders()
        });

        // Clean up uploaded file
        fs.unlinkSync(imagePath);

        return res.json(response.data);
    } catch (error) {
        console.error('Error uploading image:', error.response?.data || error.message || error);
        return res.status(500).json({ error: error.message || 'An error occurred.' });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
