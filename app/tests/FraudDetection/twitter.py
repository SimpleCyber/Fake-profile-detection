import http.client
import json
import os
import requests
from flask import Flask, render_template, request ,jsonify
from app import app



@app.route('/detect_x', methods=['POST'])
def detect_x():
    # Parse JSON from request
    data = request.get_json()
    print(data)
    username = data.get('username') # Extract 'username' from the JSON payload
    print(username)
 
    if not username:
        return jsonify({'error': 'Username is required.'}), 400

    # Call your function with the username
    main(username)

    return jsonify({'result': f"Data for '{username}' has been successfully processed."})



# API Connection Setup
conn_user = http.client.HTTPSConnection("twitter-api47.p.rapidapi.com")
headers = {
    'x-rapidapi-key': "5d54c973b7msh2418c169d4909b0p1e5362jsn1123fc1cd8ae",
    'x-rapidapi-host': "twitter-api47.p.rapidapi.com"
}
conn_tweet = http.client.HTTPSConnection("twitter-api47.p.rapidapi.com")


def create_directory(path):
    os.makedirs(path, exist_ok=True)
    return path


def download_profile_image(profile_image_url, username):
    try:
        if profile_image_url:
            profile_images_dir = create_directory(os.path.join(os.getcwd(), username, f"{username}_profile"))
            response = requests.get(profile_image_url)
            if response.status_code == 200:
                filepath = os.path.join(profile_images_dir, "profile_pic.jpg")
                with open(filepath, 'wb') as file:
                    file.write(response.content)
                print(f"Profile image downloaded to {filepath}")
            else:
                print(f"Failed to download profile image. HTTP Status: {response.status_code}")
        else:
            print("No profile image URL provided.")
    except Exception as e:
        print(f"Error downloading profile image: {e}")


def download_post_images(tweets, username):
    try:
        tweets_images_dir = create_directory(os.path.join(os.getcwd(), username, f"{username}_posts"))

        for index, tweet in enumerate(tweets):
            media_urls = tweet.get("media", [])
            for media_index, img_url in enumerate(media_urls):
                try:
                    response = requests.get(img_url)
                    if response.status_code == 200:
                        filename = f"{username}_post_{index}.jpg"
                        filepath = os.path.join(tweets_images_dir, filename)
                        with open(filepath, 'wb') as file:
                            file.write(response.content)
                        print(f"Downloaded image to {filepath}")
                except Exception as e:
                    print(f"Error downloading tweet image {img_url}: {e}")
    except Exception as e:
        print(f"Error downloading post images: {e}")


def save_post_captions_to_json(tweets, username):
    try:
        # Create the nested directory for captions
        captions_dir = create_directory(os.path.join(os.getcwd(), username, f'{username}_captions'))

# Define the filepath for the JSON file
        captions_filepath = os.path.join(captions_dir, "captions.json")

        captions = [{"Caption": tweet.get("text", "No caption available")} for tweet in tweets]
        
        with open(captions_filepath, "w", encoding="utf-8") as json_file:
            json.dump(captions, json_file, indent=4, ensure_ascii=False)
        
        print(f"Post captions saved to {captions_filepath}")
    except Exception as e:
        print(f"Error saving post captions to JSON: {e}")
        


def fetch_user_details(username):
    try:
        conn_user.request("GET", f"/v2/user/by-username?username={username}", headers=headers)
        res = conn_user.getresponse()
        

        if res.status != 200:
            print(f"Error: Received status code {res.status}")
            return None, None

        data = json.loads(res.read().decode("utf-8"))
        selected_fields = {
            'Username': data['legacy'].get('name'),
            'Name': data['legacy'].get('screen_name'),
            'Bio':data['legacy'].get('description'),
            'Followers': data['legacy'].get('normal_followers_count'),
            'Following': data['legacy'].get('friends_count'),
            'Verified': data.get('is_blue_verified'),
            'AccountPrivacy': data['verification_info'].get('is_identity_verified'),

            'default_profile_image': data['legacy'].get('profile_banner_url'),
            'NumberOfPosts': data['legacy'].get('media_count'),
            'profile_image_url_https': data['legacy'].get('profile_banner_url'),
            "Socialmediasite": "Twitter",
        }
        profile_dir = create_directory(os.path.join(os.getcwd(), username, f"{username}_profile"))
        profile_filepath = os.path.join(profile_dir, "profile_data.json")

        with open(profile_filepath, "w", encoding="utf-8") as json_file:
            json.dump(selected_fields, json_file, indent=4)


        return data, selected_fields
    except Exception as e:
        print(f"Error fetching user details: {e}")
        return None, None


def fetch_user_tweets(username, user_id, count=10):
    try:
        conn_tweet.request("GET", f"/v2/user/tweets?userId={user_id}&count={count}", headers=headers)
        res = conn_tweet.getresponse()

        if res.status != 200:
            print(f"Error: Received status code {res.status} when fetching tweets")
            return None

        return json.loads(res.read().decode("utf-8"))
    except Exception as e:
        print(f"Error fetching tweets: {e}")
        return None


def process_tweets(tweets_raw_data):
    try:
        extracted_tweets = []

        for tweet_entry in tweets_raw_data.get("tweets", []):
            tweet_content = tweet_entry.get("content", {}).get("itemContent", {}).get("tweet_results", {}).get("result", {})
            legacy = tweet_content.get("legacy", {})

            tweet_text = (
                legacy.get("full_text") or
                legacy.get("text") or
                legacy.get("extended_tweet", {}).get("full_text") or
                "No text available"
            )

            media = legacy.get("extended_entities", {}).get("media", [])
            media_urls = [item.get("media_url_https") for item in media if item.get("type") == "photo"]

            extracted_tweets.append({
                "text": tweet_text,
                "created_at": legacy.get("created_at"),
                "media": media_urls,
            })

        return extracted_tweets
    except Exception as e:
        print(f"Error processing tweets: {e}")
        return []


def main(username):
    try:
        username = username.strip()

        raw_user_details, processed_user_details = fetch_user_details(username)

        if raw_user_details and processed_user_details:
            final_report = {"ProfileInfo": processed_user_details}

            user_id = raw_user_details.get("rest_id", None)

            if user_id:
                tweets_raw = fetch_user_tweets(username, user_id, count=10)

                if tweets_raw:
                    processed_tweets = process_tweets(tweets_raw)
                    final_report["tweets"] = processed_tweets

                    # Download profile image
                    download_profile_image(processed_user_details.get("profile_image_url_https"), username)

                    # Download post images
                    download_post_images(processed_tweets, username)

                    # Save post captions
                    save_post_captions_to_json(processed_tweets, username)

            # Save user details JSON
            user_dir = create_directory(os.path.join(os.getcwd(), username, f"{username}_profile"))
            json_filepath = os.path.join(user_dir, "data.json")
            with open(json_filepath, "w", encoding="utf-8") as json_file:
                json.dump(final_report, json_file, indent=4, ensure_ascii=False)
            print(f"User details saved to {json_filepath}")
        else:
            print("Failed to fetch user details.")

    except Exception as e:
        print(f"Unexpected error in main process: {e}")


if __name__ == "__main__":
    app.run(debug=True)