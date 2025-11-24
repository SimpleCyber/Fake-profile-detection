from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import json
from app import app
import os
import requests
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API key
genai.configure(api_key=os.getenv("GEMINI_KEY"))

MODEL = "gemini-2.5-flash-lite"

system_prompt = """ 
        You are an AI model that detects the given  is profile fake or not based on the number of followers , following , bio , verified or not, username trying to impersonate some famous user names , from the post's caption events in real-time or in the past if the data , number of posts etc. in why it belongs to that category  tell add words due to which it lies in that category example "kill in hate" , "occupy kashmir in extremist" else put there "-" .You will be provided with the input of users social media profile information and posts and your goal is to respond with a structured solution in this format:
    <div class="final_output">
        <h3> Fake post detection:<h3>
        <table>
            <tr>
                <td>Fake or propaganda information</td>
                <td><span class="propaganda">(percentage out of 100)</span></td>
                <td><span class="propaganda">why it belongs to that category </span></td>
            </tr>
            <tr>
                <td>Extremist</td>
                <td><span class="Extremist">(percentage out of 100)</span></td>
                <td><span class="Extremist">why it belongs to that category </span></td>
            </tr>
            <tr>
                <td>Spam message</td>
                <td><span class="Spam">(percentage out of 100)</span></td>
                <td><span class="Spam">why it belongs to that category </span></td>
            </tr>
            <tr>
                <td>Violent or hate speech or toxic</td>
                <td><span class="hate">(percentage out of 100)</span></td>
                <td><span class="hate">why it belongs to that category </span></td>
            </tr>
           
            <tr>
                <td>Incomplete profile</td>
                <td><span class="Incomplete">(percentage out of 100)</span></td>
                <td><span class="Incomplete">why it belongs to that category </span></td>
            </tr>
            <tr>
                <td>Impersonating profile</td>
                <td><span class="Impersonate">(percentage out of 100)</span></td>
                <td><span class="Impersonate">why it belongs to that category </span></td>
            </tr>
        </table>
        <li>Percentage of risk :<span class="risk"> (percentage out of 100)</span></li>
        <li>Image Analysis :<span class="risk"> Tell image category(Extremist , Spam , Voilent, Hate ,Normal Pics ,etc based on text puat any 1 category dont leave empty)</span></li>
        <strong>Reason:</strong>
        
            If the profile belongs to any of these 6 categories then why just in 10-20 words.
        <strong>Conclusion: </strong>
            Just one precise summary point.
            
            </div>
"""

@app.route('/openai', methods=['POST'])
def get_post_response_json():
    print("Model testing started 🌿")
    try:
        query = request.get_json()
        user_info = query.get('userinformation', {})
        username = user_info["ProfileInfo"]["Username"]
        print("username from gemini:", username)

        # --- FIX: Combine system + user into one input ---
        final_prompt = system_prompt + "\n\nUser Profile Information:\n" + str(user_info)

        # Gemini API call (correct usage)
        model = genai.GenerativeModel(MODEL)
        response = model.generate_content(final_prompt)

        response_content = response.text
        print("Response:", response_content)

        # Saving data
        base_dir = os.path.join(os.getcwd(), username)
        os.makedirs(base_dir, exist_ok=True)

        profile_dir = os.path.join(base_dir, f"{username}_profile")
        os.makedirs(profile_dir, exist_ok=True)

        output_path = os.path.join(profile_dir, "output_data.json")
        with open(output_path, "w") as profile_info_file:
            json.dump(response_content, profile_info_file, indent=4)

        return jsonify({"result": response_content})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
