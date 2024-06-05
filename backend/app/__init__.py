from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
print('here1')
app = Flask(__name__)
app.config.from_object('app.configuration.Config')
print('here2')
CORS(app, support_credentials=True)

db = SQLAlchemy(app) #flask-sqlalchemy
print("SQLAlchemy database object created successfully.")
from app import models
