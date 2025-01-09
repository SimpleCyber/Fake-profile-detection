# app.py
from flask import Flask, render_template, request
import requests
import traceback
import os
import certifi



app = Flask(__name__)

base_dir = os.path.join(os.getcwd(), "wholedata")
os.makedirs(base_dir, exist_ok=True)

PROFILE_PIC_DIR = base_dir
os.makedirs(PROFILE_PIC_DIR, exist_ok=True)

def download_image(url, filename):
    """Download the image from the given URL and save it locally."""
    try:
        response = requests.get(url, stream=True, verify=certifi.where())
        if response.status_code == 200:
            filepath = os.path.join(PROFILE_PIC_DIR, filename)
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return filepath
    except requests.exceptions.SSLError as ssl_error:
        print(f"SSL error while downloading {url}: {ssl_error}")
    except Exception as e:
        print(f"Error downloading image: {e}")
    return '/static/default_placeholder.jpg'






@app.route('/wholeinstaFetch', methods=['POST'])
def wholeinstaFetch():
    try:
        data = request.get_json()
        username = data.get('username')
        results, error_message = index(username)
        
        if error_message:
            return {"error": error_message}, 400
        
        return {"results": results}, 200
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}, 500



def index(name):
    results = []

    if request.method == 'POST':
        name = request.form.get('name')

        print("Name :", name , "🌿🌿🌋🌋🌋🌋🌋🌿🌿🌿🌿")
        
        # API request headers
        headers = {
            "x-rapidapi-key": "acdfe0df04msh7a4e8b244eca339p1a58c6jsn344dbffe049a",
            "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com"
        }

        # Query parameters
        querystring = {"search_query": name}

        try:
            # Make the API request
            response = requests.get(
                "https://instagram-scraper-api2.p.rapidapi.com/v1/search_users", 
                headers=headers, 
                params=querystring
            )
            

            # Check if the response is successful
            response.raise_for_status()

            # Extract the JSON response
            data = response.json()
            print("Parsed JSON Data:", data)

            # Check if the 'data' key exists and contains results
            if isinstance(data, dict) and "data" in data and "items" in data['data'] and isinstance(data['data']['items'], list):
                for index, user_info in enumerate(data['data']['items'], start=1):
                    # Ensure user_info is a dictionary
                    if not isinstance(user_info, dict):
                        print(f"Skipping non-dictionary user info: {user_info}")
                        continue

                    profile_pic_url = user_info.get('profile_pic_url')
                    local_pic_path = download_image(profile_pic_url, f"{index}.jpg") if profile_pic_url else '/static/default_placeholder.jpg'

                    results.append({
                        'index': index,
                        'full_name': user_info.get('full_name', 'N/A'),
                        'id': user_info.get('pk', user_info.get('id', 'N/A')),
                        'username': user_info.get('username', 'N/A'),
                        'is_private': user_info.get('is_private', False),
                        'is_verified': user_info.get('is_verified', False),
                        'profile_pic_url': local_pic_path
                    })

                    print("hii 😌😌😌😌😌 ",results)



                if not results:
                    error_message = "No valid user data found."
            else:
                error_message = "Unexpected API response structure."
                print("Unexpected data structure:", data)


        except requests.RequestException as e:
            error_message = f"API Request Error: {str(e)}"
            # Print full traceback for detailed debugging
            traceback.print_exc()
        except Exception as e:
            error_message = f"An unexpected error occurred: {str(e)}"
            # Print full traceback for detailed debugging
            traceback.print_exc()

    return results

if __name__ == '__main__':
    app.run(debug=True)