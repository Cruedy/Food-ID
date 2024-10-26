from flask import Flask

app = Flask(__name__)

@app.route('backend/route')
def findFood(image):
    return 'food'

