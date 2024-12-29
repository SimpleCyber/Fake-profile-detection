
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from app import routes
from app.tests.FraudDetection import instagramData
from app.tests.FraudDetection import fraudPredict
from app.model import openai
from app.tests.FraudDetection import twitter
from app.tests.FraudDetection import facebook
from app.tests.FraudDetection import wholeinsta
from app.tests.FraudDetection import linkedin
