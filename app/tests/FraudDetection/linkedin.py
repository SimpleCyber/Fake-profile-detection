import requests
import os
import json
from flask import Flask, render_template, request ,jsonify
from app import app


@app.route('/detect_linkdin', methods=['POST'])
def detect_linkdin():
    # Parse JSON from request
    data = request.get_json()
    print(data)
    username = data.get('username') # Extract 'username' from the JSON payload
    print(username)
 
    if not username:
        return jsonify({'error': 'Username is required.'}), 400

    # Call your function with the username
    fetch_linkedin_data(username)

    return jsonify({'result': f"Data for '{username}' has been successfully processed."})


def fetch_linkedin_data(user_input):
    url = "https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url"

    # Check if input starts with "http"
    if user_input.startswith("http"):
        querystring = {"url": user_input}  # Use URL if it starts with "http"
    else:
        querystring = {"url": f"https://www.linkedin.com/in/{user_input}"}  # Construct URL if it's a username

    headers = {
        "x-rapidapi-key": "d65eb81e02mshd8f1eca29ba52b7p17caeajsn661881ae5f2c",
        "x-rapidapi-host": "linkedin-data-api.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    if response.status_code == 200:
        data = response.json()
        result = {
            "Username": data.get("username"),
            "Name": data.get("firstName"),
            "lastName": data.get("lastName"),
            "isCreator": data.get("isCreator"),
            "isOpenToWork": data.get("isOpenToWork"),
            "isHiring": data.get("isHiring"),
            "profilePicture": data.get("profilePicture"),
            "Bio": data.get("summary"),
            "headline": data.get("headline"),
            "Verified": data.get("geo", {}).get("full"),
            "education": [edu.get("fieldOfStudy") for edu in data.get("education", []) if "fieldOfStudy" in edu]
        }

        # Save profile picture and data
        username = data.get("username")
        save_profile_data(username, result)
        save_profile_picture(username, data.get("profilePicture"))

        # Fetch post details using the username
        posts_data = fetch_linkedin_posts(username)
        save_post_data(username, posts_data)

        return result
    else:
        return {"error": f"Failed to fetch data. Status code: {response.status_code}"}

def fetch_linkedin_posts(username):
    url = "https://linkedin-data-api.p.rapidapi.com/get-profile-posts"

    querystring = {"username": username}

    headers = {
        "x-rapidapi-key": "d65eb81e02mshd8f1eca29ba52b7p17caeajsn661881ae5f2c",
        "x-rapidapi-host": "linkedin-data-api.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    if response.status_code == 200:
        posts = response.json().get("data", [])
        post_details = []

        for index, post in enumerate(posts):
            image_url = None
            # Handle image URL from the list
            if post.get("image") and isinstance(post["image"], list) and len(post["image"]) > 0:
                image_url = post["image"][0].get("url")

            post_info = {
                "Caption": post.get("text"),
                "totalReactionCount": post.get("totalReactionCount"),
                "likeCount": post.get("likeCount"),
                "commentsCount": post.get("commentsCount"),
                "repostsCount": post.get("repostsCount"),
                "postUrl": post.get("postUrl"),
                "postedDate": post.get("postedDate"),
                "imageUrl": image_url
            }
            post_details.append(post_info)

            # Save post image
            save_post_image(username, index, image_url)

        return post_details
    else:
        return ({"error": f"Failed to fetch posts. Status code: {response.status_code}"})

def save_profile_data(username, profile_data):
    base_dir = os.path.join(username)
    profile_dir = os.path.join(base_dir, f"{username}_profile")
    os.makedirs(profile_dir, exist_ok=True)
    with open(os.path.join(profile_dir, "profile_data.json"), "w") as file:
        json.dump(profile_data, file, indent=4)

    with open(os.path.join(profile_dir, "data.json"), "w") as file:
        json.dump(profile_data, file, indent=4)

def save_profile_picture(username, profile_picture_url):
    if profile_picture_url:
        base_dir = os.path.join(username)
        profile_dir = os.path.join(base_dir, f"{username}_profile")
        os.makedirs(profile_dir, exist_ok=True)
        response = requests.get(profile_picture_url)
        if response.status_code == 200:
            with open(os.path.join(profile_dir, "profile_pic.jpg"), "wb") as file:
                file.write(response.content)

def save_post_data(username, posts_data):
    base_dir = os.path.join(username)
    captions_dir = os.path.join(base_dir, f"{username}_captions")
    os.makedirs(captions_dir, exist_ok=True)
    with open(os.path.join(captions_dir, "captions.json"), "w") as file:
        json.dump(posts_data, file, indent=4)

def save_post_image(username, index, image_url):
    if image_url:
        base_dir = os.path.join(username)
        posts_dir = os.path.join(base_dir, f"{username}_posts")
        os.makedirs(posts_dir, exist_ok=True)
        response = requests.get(image_url)
        if response.status_code == 200:
            with open(os.path.join(posts_dir, f"{username}_post_{index + 1}.jpg"), "wb") as file:
                file.write(response.content)

if __name__ == "__main__":
    app.run(debug=True)