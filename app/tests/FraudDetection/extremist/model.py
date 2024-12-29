import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score

# Load the dataset from the CSV file
data = pd.read_csv('extremist_profile_dataset.csv')

# Check if the dataset contains the expected columns
if 'Statement' not in data.columns or 'Label' not in data.columns:
    print("Dataset must contain 'Statement' and 'Label' columns")
else:
    # Preprocess data
    X = data["Statement"]
    y = data["Label"]

    # Split data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Create a pipeline for text vectorization and classification
    model = make_pipeline(CountVectorizer(), MultinomialNB())

    # Train the model
    model.fit(X_train, y_train)

    # Evaluate the model
    predictions = model.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, predictions))

    # Function to predict probabilities for user input
    def predict_extremism(statement):
        probabilities = model.predict_proba([statement])[0]  # Get probabilities
        labels = model.classes_  # Get class labels
        result = {str(labels[i]): round(float(probabilities[i]) * 100, 2) for i in range(len(labels))}
        return result

    # Take user input
    while True:
        user_input = input("Enter a statement (or type 'exit' to quit): ")
        if user_input.lower() == 'exit':
            break
        result = predict_extremism(user_input)
        print("Prediction (0-100%):", result)
