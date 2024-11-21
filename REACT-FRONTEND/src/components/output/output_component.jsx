import { useState } from 'react'; // Import useState hook for managing state in functional components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon for displaying icons
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'; // Import a specific icon for the button
import './output.css'; // Import CSS for styling the output section
 
// OutputComponent receives props from InputComponent
function OutputComponent({ code, language, total, positive, negative, isValidInput }) {
    const [result, setResult] = useState(''); // State to hold the result from the backend (AI-generated response)
 
    // Handle the click event for generating test cases
    const handleClick = async () => {
        // Check if input is valid before proceeding
        if (!isValidInput) {
            setResult("Invalid input. Please correct the errors."); // Display error if input is invalid
            return;
        }
 
        setResult("LOADING ..."); // Show loading message while awaiting response from the server
 
        // Prepare the prompt for the first API call (to check if the code is valid)
        const confirmPrompt = `if the provided is a code of any programming language then just give "true" otherwise give "false". provided is "${code}", give only single word answer either true or false`;
 
        try {
            // Send request to backend to confirm if the provided code is valid
            const confirmDataFromServer = await fetch("http://127.0.0.1:5000/data", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: confirmPrompt }) // Send the prompt as a JSON body
            });
 
            // If the server response is not OK, throw an error
            if (!confirmDataFromServer.ok) {
                throw new Error("UNABLE TO LOAD SERVER");
            }
 
            // Parse the server response as JSON
            const responseJSON = await confirmDataFromServer.json();
            const confirmValue = responseJSON.data_from_model; // Get the response from the model (either "true" or "false")
 
            // If the code is irrelevant (false), display an error message
            if (confirmValue === "falseNone") {
                setResult("IRRELEVANT CODE, CANNOT GENERATE TEST CASES");
                return;
            }
 
            // If the code is valid, prepare the prompt for generating test cases
            const prompt = `generate ${total} unit test cases automation code of ${positive} positive and ${negative} negative test cases in ${language} for the code ${code}`;
 
            // Send request to backend to generate test cases
            const codeDataFromServer = await fetch("http://127.0.0.1:5000/data", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt }) // Send the prompt as a JSON body
            });
 
            // Parse the response from the second request
            const responseData = await codeDataFromServer.json();
            setResult(responseData.data_from_model); // Set the AI-generated test cases as the result
        } catch (error) {
            setResult("UNABLE TO LOAD SERVER"); // Display error message if there is any issue
        }
    }
 
    const [copy, setCopy] = useState("copy"); // State for the copy button text ("copy" or "copied")
 
    // Handle the copy functionality for the result
    const handleCopy = () => {
        navigator.clipboard.writeText(result).then(() => { // Copy result to clipboard
            setCopy("copied"); // Update button text to "copied"
            setTimeout(() => {
                setCopy("copy"); // Reset button text back to "copy" after 2 seconds
            }, 2000);
        });
    }
 
    return (
        <>
            {/* Button to trigger test case generation */}
            <button className="output-button" onClick={handleClick}>
                <FontAwesomeIcon icon={faArrowCircleRight} size="2x" style={{ color: "green" }} /> {/* FontAwesome icon for the button */}
            </button>
 
            <div className="output-section">
                {/* Button to copy the result to clipboard */}
                <button className="copy-button" onClick={handleCopy}>{copy}</button>
                {/* Textarea to display the AI-generated result (test cases or error message) */}
                <textarea className="output-textarea" value={result} readOnly></textarea>
            </div>
        </>
    );
}
 
export default OutputComponent;