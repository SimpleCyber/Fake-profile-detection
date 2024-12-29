import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from app import app
import requests
from flask import Flask, render_template, request ,jsonify


@app.route('/classify', methods=['POST'])
def classify():
    # Load the model
     # Retrieve JSON data from the request
    query = request.get_json()
    image_path = query.get('userinformation', {})
    # username = user_info["ProfileInfo"]["Username"]
    print("username from open api:",image_path)
    model = tf.keras.models.load_model("keras_model.h5")

    # Load the labels
    labels = []
    with open("labels.txt", "r") as file:
        labels = [line.strip() for line in file.readlines()]

    # Load and preprocess the image
    # image_path = "image.png"
    image = load_img(image_path, target_size=(224, 224))  # Adjust size if your model uses a different input shape
    image_array = img_to_array(image)
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    image_array = image_array / 255.0  # Normalize the image

    # Predict
    predictions = model.predict(image_array)

    # Print category percentages
    for i, label in enumerate(labels):
        print(f"{label}: {predictions[0][i] * 100:.2f}%")

