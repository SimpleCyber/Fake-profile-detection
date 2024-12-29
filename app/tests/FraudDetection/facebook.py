import requests
import json
import os
import requests
from flask import Flask, render_template, request ,jsonify
from app import app

@app.route('/detect_fraud_profile', methods=['POST'])
def detect_fb():
    data = request.get_json()
    username = data.get('username') # Extract 'username' from the JSON payload
    if not username:
        return jsonify({'error': 'Username is required.'}), 400
    
    base_url = "https://www.facebook.com/"
    url = base_url + username

    base_dir = os.path.join(os.getcwd(), username)
    os.makedirs(base_dir, exist_ok=True)

    profile_dir = os.path.join(base_dir, f"{username}_profile")
    os.makedirs(profile_dir, exist_ok=True)

    profile_info = user_profile_information(url,username)  
    post_info = fetch_user_posts(url,username)  
    data = {
    "profile_info": profile_info,
    "post_info": post_info
    }
    data_path = os.path.join(profile_dir, "data.json")
    # Save the data to data.json
    with open(data_path, "w") as data_file:
        json.dump(data, data_file, indent=4)
    return jsonify({'result': f"Data for '{url}' has been successfully processed."})



def user_profile_information(url,username):
    """
    Fetches the profile information from the given Facebook page URL
    and saves the selected details into a JSON file.
    """

    base_dir = os.path.join(os.getcwd(), username)
    os.makedirs(base_dir, exist_ok=True)

    profile_dir = os.path.join(base_dir, f"{username}_profile")
    os.makedirs(profile_dir, exist_ok=True)


    # API endpoint and headers
    api_url = "https://facebook-pages-scraper2.p.rapidapi.com/get_facebook_pages_details"
    querystring = {"link": url}
    headers = {
	"x-rapidapi-key": "15c4fd52c7msh07c0a2768c2bdd3p1f6b5djsn0f9257862e61",
	"x-rapidapi-host": "facebook-pages-scraper2.p.rapidapi.com"
    }

    # Make the API request
    response = requests.get(api_url, headers=headers, params=querystring)
    if response.status_code == 200:
        data = response.json()[0]  # Extract the first item if the response is a list
        
        # Extract required fields
        profile_info = {
            "SocialMediaPlatform" : "Facebook",
            "Bio": ((data.get("bio") or "")+ (data.get("about_me_text_content") or "") +( data.get("description")or "")),
            "Followers": data.get("followers_count"),
            "AccountPrivacy": data.get("status"),
            "creation_date": data.get("creation_date"),
            "user_id": data.get("user_id"),
            "Name": data.get("about_me_text"),
            "Username":username,
            "Socialmediasite": "Facebook",
        }


        image_url = data.get("image")
        save_profile_image(image_url,username,profile_dir)

        # Save profile_data.json in the profile directory
        caption_path = os.path.join(profile_dir, "profile_data.json")
        with open(caption_path, "w") as captions_info_file:
            json.dump(profile_info, captions_info_file, indent=4)

    else:
        print(f"Failed to fetch profile information. Status code: {response.status_code}, Error: {response.text}")

    return profile_info


def save_profile_image(image_url,username, profile_dir):
    """
    Saves the profile image from the given image URL to a file named 'profile_pic.jpg'.
    """


    response = requests.get(image_url, stream=True)
    if response.status_code == 200:
        image_path = os.path.join(profile_dir, "profile_pic.jpg")
        with open(image_path, "wb") as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)
        print("Profile image saved as profile_pic.jpg")
    else:
        print(f"Failed to fetch profile image. Status code: {response.status_code}, Error: {response.text}")



def fetch_user_posts(page_url,username):

    base_dir = os.path.join(os.getcwd(), username)
    os.makedirs(base_dir, exist_ok=True)

    post_dir = os.path.join(base_dir, f"{username}_posts")
    os.makedirs(post_dir, exist_ok=True)

    caption_dir = os.path.join(base_dir, f"{username}_captions")
    os.makedirs(caption_dir, exist_ok=True)



    """
    Fetch the latest posts from a Facebook page, extract text, image URI, and user name,
    and save the data into captions.json. Download images to the post_pics folder.
    """
    api_url = "https://facebook-pages-scraper2.p.rapidapi.com/get_facebook_posts_details"
    querystring = {"link": page_url, "timezone": "UTC"}

    headers = {
	"x-rapidapi-key": "15c4fd52c7msh07c0a2768c2bdd3p1f6b5djsn0f9257862e61",
	"x-rapidapi-host": "facebook-pages-scraper2.p.rapidapi.com"
    }

    try:
        response = requests.get(api_url, headers=headers, params=querystring)
        if response.status_code == 200:
            data = response.json().get("data", {}).get("posts", [])


            post_details = []

            for post in data[:3]:  # Limit to 3 posts
                # Extract post text
                text = post.get("values", {}).get("text", "No caption available")

                # Extract image URI
                photo_image = post.get("values", {}).get("photo_image", None)
                photo_image_url = None

                if isinstance(photo_image, str):  # If photo_image is a string, parse it
                    try:
                        photo_image_data = json.loads(photo_image)
                        photo_image_url = photo_image_data.get("uri", None)
                    except json.JSONDecodeError:
                        print("Failed to parse photo_image JSON string.")
                elif isinstance(photo_image, dict):  # If it's already a dict
                    photo_image_url = photo_image.get("uri", None)

                # Extract user name
                user_name = post.get("details", {}).get("name", "Unknown User")

                # Store post details
                post_details.append({
                    "user_name": user_name,
                    "Caption": text,
                })

                # Download image if available
                i = 0
                if photo_image_url:
                    i += 1
                    try:
                        image_response = requests.get(photo_image_url, stream=True)
                        if image_response.status_code == 200:
                            # image_path = base_dir/f"{username}posts/{post.get('details', {}).get(f'{username}_post{i}')}.jpg"
                            image_path = os.path.join(post_dir, f'{username}_post_{i}.jpg')
                            with open(image_path, "wb") as file:
                                for chunk in image_response.iter_content(1024):
                                    file.write(chunk)
                    except Exception as e:
                        print(f"Failed to download image: {e}")

            
            caption_path = os.path.join(caption_dir, "captions.json")
            with open(caption_path, "w") as captions_info_file:
                json.dump(post_details, captions_info_file, indent=4)
            print("Posts and captions saved successfully.")

            

        else:
            print(f"Failed to fetch posts. Status code: {response.status_code}, Error: {response.text}")

    except Exception as e:
        print(f"An error occurred: {e}")

    return post_details

if __name__ == "__main__":
    app.run(debug=True)
