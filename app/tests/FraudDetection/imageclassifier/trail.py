import requests

# URL of your deployed API on Vercel
api_url = "http://localhost:5500/classify"

# Path to the image you want to classify
image_path = "image.png"

# Send the image to the API
with open(image_path, "rb") as image_file:
    files = {"file": image_file}
    response = requests.post(api_url, files=files)

# Handle the response
if response.status_code == 200:
    data = response.json()
    if data["success"]:
        print("Predictions:")
        for category, percentage in data["predictions"].items():
            print(f"{category}: {percentage * 100:.2f}%")
    else:
        print(f"Error: {data['error']}")
else:
    print(f"Failed to connect to API. Status code: {response.status_code}")
