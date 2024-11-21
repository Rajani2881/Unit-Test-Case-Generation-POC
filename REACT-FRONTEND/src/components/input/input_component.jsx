import { useState } from 'react'; // Import the useState hook for managing state in functional components
import OutputComponent from '../output/output_component'; // Import OutputComponent to show results
import './input.css'; // Import the CSS file for styling
 
function InputComponent() {
    // Define state variables to hold form input values and error messages
    const [code, setCode] = useState(""); // State for the code snippet input
    const [language, setLanguage] = useState(""); // State for selected language
    const [total, setTotal] = useState(""); // State for the total number of test cases
    const [positive, setPositive] = useState(""); // State for the number of positive test cases
    const [negative, setNegative] = useState(""); // State for the number of negative test cases
    const [errorMessage, setErrorMessage] = useState({
        totalError: "",
        positiveError: "",
        negativeError: "",
        codeError: ""  // Error message for code validation
    });
    const [isValidInput, setIsValidInput] = useState(true); // Flag to track if input is valid
 
    // Function to validate the input values
    const validateTestCases = (totalVal, positiveVal, negativeVal, codeVal) => {
        let errors = {
            totalError: "",
            positiveError: "",
            negativeError: "",
            codeError: ""  // Add this for code validation
        };
 
        // Convert values to integers (empty strings will be treated as zero)
        const positiveInt = parseInt(positiveVal) || 0;
        const negativeInt = parseInt(negativeVal) || 0;
        const totalInt = parseInt(totalVal) || 0;
 
        // Validate if any of the values are negative
        if (positiveInt < 0) {
            errors.positiveError = "Positive test cases cannot be negative.";
        } else {
            errors.positiveError = ""; // Clear error if valid
        }
 
        if (negativeInt < 0) {
            errors.negativeError = "Negative test cases cannot be negative.";
        } else {
            errors.negativeError = ""; // Clear error if valid
        }
 
        if (totalInt < 0) {
            errors.totalError = "Total test cases cannot be negative.";
        } else {
            errors.totalError = ""; // Clear error if valid
        }
 
        // Check if the sum of positive and negative test cases equals the total
        if (positiveInt + negativeInt !== totalInt) {
            errors.totalError = "Sum of positive and negative test cases must be equal total test cases.";
        } else {
            errors.totalError = ""; // Clear error if valid
        }
 
        // Ensure that negative test cases do not exceed the total
        if (negativeInt > totalInt) {
            errors.negativeError = "Negative test cases cannot exceed total test cases.";
        } else {
            errors.negativeError = ""; // Clear error if valid
        }
 
        // Validate if code is empty
        if (codeVal.trim() === "") {
            errors.codeError = "Code snippet cannot be empty.";  // Error if code is empty
        } else {
            errors.codeError = ""; // Clear error if valid
        }
 
        // Set error messages and validation state
        setErrorMessage(errors);
 
        // Check if there are any errors; isValidInput is true if there are no errors
        const isValid = !errors.totalError && !errors.positiveError && !errors.negativeError && !errors.codeError;
        setIsValidInput(isValid);
 
        return errors.totalError || errors.positiveError || errors.negativeError || errors.codeError;
    };
 
    // Handle changes to the code input field
    const handleCode = (event) => {
        const value = event.target.value; // Get value from textarea
        setCode(value); // Update state with new value
        validateTestCases(total, positive, negative, value);  // Re-validate when code changes
    };
 
    // Handle changes to the language selection
    const handleLanguage = (event) => {
        setLanguage(event.target.value); // Update selected language
        validateTestCases(total, positive, negative, code);  // Re-validate when language changes
    };
 
    // Handle changes to the total test cases input field
    const handleTotal = (event) => {
        const value = event.target.value; // Get value from input
        setTotal(value); // Update total test cases state
        validateTestCases(value, positive, negative, code); // Re-validate when total changes
    };
 
    // Handle changes to the positive test cases input field
    const handlePositive = (event) => {
        const value = event.target.value; // Get value from input
        setPositive(value); // Update positive test cases state
        validateTestCases(total, value, negative, code); // Re-validate when positive changes
    };
 
    // Handle changes to the negative test cases input field
    const handleNegative = (event) => {
        const value = event.target.value; // Get value from input
        setNegative(value); // Update negative test cases state
        validateTestCases(total, positive, value, code); // Re-validate when negative changes
    };
 
    return (
        <>
          <div className="input-section">
            <div className="textarea-container">
            {/* Textarea for code input */}
           <textarea
             className="code-textarea"
             onChange={handleCode} // Handle code input changes
             placeholder="TYPE YOUR CODE HERE"
             spellCheck="false" // Disable spell checking for code
           ></textarea>

           {/* Error message for code input */}
           {errorMessage.codeError && (
              <div className="error-message">{errorMessage.codeError}</div>
            )}

         <div className="form-container">
         <div className="input-group">
         <h2>Select Language</h2>

        {/* Radio buttons for language selection */}
        <label>
          <input
            type="radio"
            value="C#"
            onChange={handleLanguage}
            checked={language === "C#"}
          />
          C#
        </label>
        <label>
          <input
            type="radio"
            value="Java"
            onChange={handleLanguage}
            checked={language === "Java"}
          />
          Java
        </label>
        <label>
          <input
            type="radio"
            value="Python"
            onChange={handleLanguage}
            checked={language === "Python"}
          />
          Python
        </label>
        <label>
          <input
            type="radio"
            value="JavaScript"
            onChange={handleLanguage}
            checked={language === "JavaScript"}
          />
          JavaScript
        </label>
        <label>
          <input
            type="radio"
            value="Ruby"
            onChange={handleLanguage}
            checked={language === "Ruby"}
          />
          Ruby
        </label>
      </div>

      <div className="input-group">
        {/* Input fields for test cases */}
        <label>Total Test Cases</label>
        <input
          onChange={handleTotal} // Handle total test cases input
          type="number"
          className="small-input"
        />
        {errorMessage.totalError && (
          <div className="error-message">{errorMessage.totalError}</div>
        )}

        <label>Negative Test Cases</label>
        <input
          onChange={handleNegative} // Handle negative test cases input
          type="number"
          className="small-input"
        />
        {errorMessage.negativeError && (
          <div className="error-message">{errorMessage.negativeError}</div>
        )}

        <label>Positive Test Cases</label>
        <input
          onChange={handlePositive} // Handle positive test cases input
          type="number"
          className="small-input"
        />
        {errorMessage.positiveError && (
          <div className="error-message">{errorMessage.positiveError}</div>
        )}
         </div>
      </div>
     </div>
    </div>

      <OutputComponent
        code={code}
        language={language}
        total={total}
        positive={positive}
        negative={negative}
        isValidInput={isValidInput} // Pass validation status to OutputComponent
        />
        </>
    );
}
 
export default InputComponent;