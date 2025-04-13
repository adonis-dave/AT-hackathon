from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import subprocess
import os
import tempfile
import json
from dotenv import load_dotenv  # Import dotenv to load environment variables

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configuration (loaded from .env file)
AFRICASTALKING_USERNAME = os.getenv("AFRICASTALKING_USERNAME", "sandbox")  # Default to "sandbox"
AFRICASTALKING_API_KEY = os.getenv("AFRICASTALKING_API_KEY")  # No default, must be set in .env
AFRICASTALKING_SMS_URL = "https://api.africastalking.com/version1/messaging"
DOCKER_IMAGE_NAME = "security_analyzer_sandbox"  # Name for your Docker image

@app.route('/analyze', methods=['POST'])
def analyze_endpoint():
    """
    Endpoint to receive a URL and cookies from the extension, analyze it, and send an SMS report.
    """
    data = request.get_json()
    if not data or 'url' not in data or 'phoneNumber' not in data or 'cookies' not in data:
        return jsonify({'error': 'Invalid request. Missing URL, phone number, or cookies.'}), 400

    url = data['url']
    phone_number = data['phoneNumber']
    cookies = data['cookies']  # Get cookies from the request

    # Analyze the website and cookies for security risks
    risks = analyze_website_in_sandbox(url)
    if risks is None:  # Checks if the analyze_website_in_sandbox function returns None
        return jsonify({'error': f'Failed to analyze website {url}'}), 500

    # Here you can add logic to analyze cookies for security risks
    cookie_risks = analyze_cookies(cookies)  # New function to analyze cookies
    risks.extend(cookie_risks)  # Combine risks from website and cookies

    sms_message = format_sms_message(risks)
    sms_response = send_sms(phone_number, sms_message)

    if sms_response:
        return jsonify({'success': True, 'message': 'Analysis complete. SMS report sent.', 'sms_response': sms_response}), 200
    else:
        return jsonify({'success': False, 'message': 'Analysis complete, but failed to send SMS.'}), 200  # still 200 because analysis was successful.

def analyze_cookies(cookies):
    """Analyzes cookies for security risks.

    Args:
        cookies (list): A list of cookies to analyze.

    Returns:
        list: A list of dictionaries representing the security risks found in cookies.
    """
    risks = []
    for cookie in cookies:
        if not cookie.get('secure'):
            risks.append({
                'category': 'Insecure Cookie',
                'description': f"Cookie '{cookie['name']}' is not secure.",
                'severity': 'High'
            })
        if cookie.get('httpOnly'):
            risks.append({
                'category': 'HttpOnly Cookie',
                'description': f"Cookie '{cookie['name']}' is HttpOnly.",
                'severity': 'Medium'
            })
        if not cookie.get('sameSite'):
            risks.append({
                'category': 'Missing SameSite Attribute',
                'description': f"Cookie '{cookie['name']}' is missing the SameSite attribute.",
                'severity': 'Medium'
            })
    return risks

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')  # Make the server accessible externally
