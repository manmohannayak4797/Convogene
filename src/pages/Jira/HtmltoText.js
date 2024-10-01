import React from "react";

const HtmlToText = ({ html }) => {
  // Function to convert HTML to plain text
  const convertHtmlToText = (htmlString) => {
    // Create a temporary DOM element
    const tempElement = document.createElement("div");
    // Set the innerHTML to the provided HTML string
    tempElement.innerHTML = htmlString;
    // Extract the text content
    return tempElement.innerText || tempElement.textContent;
  };

  // Convert the provided HTML to text
  const textContent = convertHtmlToText(html);

  return (
    <div>
      <h2>Converted Text:</h2>
      <p>{textContent}</p>
    </div>
  );
};

export default HtmlToText;
