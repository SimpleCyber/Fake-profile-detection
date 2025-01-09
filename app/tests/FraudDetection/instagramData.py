from flask import Flask, render_template, request ,jsonify
from app import app
import requests
import os
import json
from app import app
from io import BytesIO


@app.route('/detect_fraud_profile', methods=['POST'])
def detect_fraud_profile():
    # Parse JSON from request

    data = request.get_json()
    username = data.get('username') # Extract 'username' from the JSON payload
    print(f"Instagram Data {username} started 🌿🌿🌿")
    if not username:
        return jsonify({'error': 'Username is required.'}), 400

    # Call your function with the username
    user_information_final(username)

    return jsonify({'result': f"Data for '{username}' has been successfully processed."})


# fetch the user information
def get_user_data(username):
    url = "https://instagram-scraper-api2.p.rapidapi.com/v1/info"
    querystring = {"username_or_id_or_url": username}
    headers = {
    'x-rapidapi-key': "acdfe0df04msh7a4e8b244eca339p1a58c6jsn344dbffe049a",
    'x-rapidapi-host': "instagram-scraper-api2.p.rapidapi.com"
    }
    # fetching the data from the api
    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=10)
        response.raise_for_status()
        data = response.json()
        if 'data' in data:
            return data
        else:
            return {"error": "Invalid response structure from API."}
    except requests.exceptions.RequestException as e:
        print(f"Error fetching user data: {e}")
        return None


# save the image to the device
def save_profile_picture(url, username):
    img_data = requests.get(url).content

    base_dir = os.path.join(os.getcwd(), username)
    os.makedirs(base_dir, exist_ok=True)

    profile_dir = os.path.join(base_dir, f"{username}_profile")
    os.makedirs(profile_dir, exist_ok=True)

    img_filename = 'profile_pic.jpg'

    img_path = os.path.join(base_dir,profile_dir, img_filename) 
    os.makedirs(os.path.dirname(img_path), exist_ok=True)




    with open(img_path,'wb') as file:
        file.write(img_data)
     

    return img_path


# Function to download the image and save it locally
def save_post_picture(img_url, username, post_index):
    # Get the image content


    base_dir = os.path.join(os.getcwd(), username)
    os.makedirs(base_dir, exist_ok=True)
    post_dir = os.path.join(base_dir, f"{username}_posts")
    os.makedirs(post_dir, exist_ok=True)

    img_data = requests.get(img_url).content
    img_filename = f'{username}_post_{post_index + 1}.jpg'
    img_path = os.path.join(base_dir,post_dir , img_filename)
    os.makedirs(os.path.dirname(img_path), exist_ok=True)  
    with open(img_path, 'wb') as file:
        file.write(img_data)
        
    # Return the relative path for use in the template
    return img_path

def get_recent_posts(username):
    url = "https://instagram-scraper-api2.p.rapidapi.com/v1.2/posts"
    querystring = {"username_or_id_or_url": username}
    headers = {
        'x-rapidapi-key': "acdfe0df04msh7a4e8b244eca339p1a58c6jsn344dbffe049a",
        'x-rapidapi-host': "instagram-scraper-api2.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=10)
        response.raise_for_status()
        data = response.json()

        if 'data' in data and 'items' in data['data']:
            posts = data['data']['items'][:10]
            for post_index, post in enumerate(posts):
                # Process posts
                post['caption_text'] = post.get('caption', {}).get('text', 'No caption text available')
                post['created_at'] = post.get('created_at', 'Unknown time')
                image_versions = post.get('image_versions', {}).get('items', [])
                post['image_url'] = image_versions[0]['url'] if image_versions else None
                if post['image_url']:
                    post['image_path'] = save_post_picture(post['image_url'], username, post_index)
            return posts
        else:
             # Process posts
            post['caption_text'] = "No captions available [PRIVATE ACCOUNT]"
            post['created_at'] = "00:00:00"
            image_versions = "None"
            post['image_url'] = "https://imgs.search.brave.com/H_IRfXZLA3FRxAVtAKPqIS5DfURLF3rO6lChAP9LPs8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLmd1/aW0uY28udWsvaW1n/L21lZGlhLzIyZTMy/YzFiMWRlNDBlZDcx/MDNlMmUyZTg5OTVi/NzQyYWM2MDBiZDYv/NzBfMF83MTdfNDMw/L21hc3Rlci83MTcu/anBnP3dpZHRoPTQ0/NSZkcHI9MSZzPW5v/bmUmY3JvcD1ub25l"
            if post['image_url']:
                post['image_path'] = save_post_picture(post['image_url'], username, post_index)
            return []
    except requests.exceptions.RequestException as e:
        print(f"Error fetching recent posts: {e}")
        return []


def profile_pic(username):
    user_data = get_user_data(username)
    profile_pic_url = user_data['data']['profile_pic_url']
    username = user_data['data']['username']
    profile_pic_path = save_profile_picture(profile_pic_url, username)
    return profile_pic_path



def user_information_final(username):
    user_data = get_user_data(username)
    if not user_data or 'error' in user_data:
        print(f"Error fetching user data for {username}")
        return {"error": f"Unable to fetch data for username: {username}"}

    base_dir = os.path.join(os.getcwd(), username)
    os.makedirs(base_dir, exist_ok=True)
    # caption
    caption_dir = os.path.join(base_dir, f"{username}_captions")
    os.makedirs(caption_dir, exist_ok=True)
    # profile
    profile_dir = os.path.join(base_dir, f"{username}_profile")
    os.makedirs(profile_dir, exist_ok=True)

    data = user_data.get('data', {})
    user_info = {
        "Username": data.get("username", "N/A"),
        "Name": data.get("full_name", "N/A"),
        "Bio": data.get("biography", "N/A"),
        "Followers": data.get("follower_count", 0),
        "Following": data.get("following_count", 0),
        "NumberOfPosts": data.get("media_count", 0),
        "Verified": "Yes" if data.get("is_verified") else "No",
        "AccountPrivacy": "Private" if data.get("is_private") else "Public",
        "Profile Picture Path": profile_pic(username),
        "Socialmediasite": "Instagram",
        "Posts": []
    }

        
    posts = get_recent_posts(username)
    try:
        posts = get_recent_posts(username)
    except Exception as e:
        print(f"Error processing posts for {username}: {e}")
        user_info["Posts"] = [{
            "PostNumber": 0,
            "Caption": "No captions available [PRIVATE ACCOUNT]",
            "Upload Time": "00:00:00",
            "Image Path": "https://imgs.search.brave.com/H_IRfXZLA3FRxAVtAKPqIS5DfURLF3rO6lChAP9LPs8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLmd1/aW0uY28udWsvaW1n/L21lZGlhLzIyZTMy/YzFiMWRlNDBlZDcx/MDNlMmUyZTg5OTVi/NzQyYWM2MDBiZDYv/NzBfMF83MTdfNDMw/L21hc3Rlci83MTcu/anBnP3dpZHRoPTQ0/NSZkcHI9MSZzPW5v/bmUmY3JvcD1ub25l"  # Placeholder image URL
    }]

    try:
        captions = [
            {"PostNumber": i + 1, "Caption": post.get("caption_text", "No caption available"), "Upload Time": post.get("created_at", "Unknown time")}
            for i, post in enumerate(posts)
        ]
    except Exception as e:
        print(f"Error processing captions for {username}: {e}")
        captions = [
            {"PostNumber": 0, "Caption": "No captions available [PRIVATE ACCOUNT]", "Upload Time": "00:00:00"}
        ]


    profile_info_path = os.path.join(profile_dir, "profile_data.json")
    with open(profile_info_path, "w") as profile_info_file:
        json.dump(user_info, profile_info_file, indent=4)

    captions_path = os.path.join(caption_dir, "captions.json")
    with open(captions_path, "w") as captions_file:
        json.dump(captions, captions_file, indent=4)

    limited_captions = captions[:4]


    data = {
    "ProfileInfo": user_info,
    "Captions": limited_captions,
    }

    data_path= os.path.join(profile_dir,"data.json")
    with open(data_path,"w") as data_file:
        json.dump(data,data_file,indent=4)

    

    return user_info
      
if __name__ == "__main__":
    app.run(debug=True)