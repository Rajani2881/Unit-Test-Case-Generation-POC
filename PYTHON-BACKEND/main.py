import httpx  # For making HTTP requests
from groq import Groq  # Import Groq client for interacting with Groq's AI service
from flask import Flask, request, jsonify  # Flask for creating the web API
from flask_cors import CORS  # CORS to handle cross-origin requests

app = Flask(__name__)  # Initialize Flask app
CORS(app, origins=["*"])  # Enable cross-origin requests from any origin


# Function to process the data and generate a result from Groq's API
def process(data):
    client = Groq(
        api_key="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")  # Initialize Groq client with the API key
    client._client = httpx.Client(
        verify=False)  # Disable SSL verification for the client (not recommended for production)

    # Create a chat completion request to the Groq API
    completion = client.chat.completions.create(
        model="llama3-8b-8192",  # Use specific model
        messages=[{
            "role": "user",  # User message
            "content": data  # Content is the input prompt
        }],
        temperature=1,  # Control the randomness of the output
        max_tokens=1024,  # Max number of tokens (words) in the response
        top_p=1,  # Controls diversity via nucleus sampling
        stream=True,  # Enable streaming response
        stop=None,  # No stop sequence
    )

    result = ""  # Initialize result string
    for chunk in completion:  # Loop over streaming chunks
        result += (str(chunk.choices[0].delta.content))  # Append each chunk of content

    return result  # Return the generated result


@app.route('/data', methods=["POST"])  # Define the POST route for receiving data
def receive_data():
    data = request.json  # Get JSON data from the request
    prompt = data.get('prompt')  # Extract the 'prompt' from the data

    # If prompt is empty or missing, return an error response
    if not prompt or prompt.strip() == "":
        return jsonify(
            {'error': 'Code snippet cannot be empty.'}), 400  # Return a specific error message with 400 status code

    # Process the prompt using Groq API
    response = process(prompt)
    return jsonify({'data_from_model': response})  # Return the result as JSON

if __name__ == '__main__':
    app.run(debug=True)
