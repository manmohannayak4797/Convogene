import React from "react";

const ParseContent = ({ text }) => {
  // Splitting content into paragraphs and list items
  const paragraphs = text.split("\n\n").map((para, index) => {
    const listItems = para.split("\n").map((line, lineIndex) => {
      if (
        line.startsWith("1. ") ||
        line.startsWith("2. ") ||
        line.startsWith("3. ") ||
        line.startsWith("4. ")
      ) {
        return <li key={lineIndex}>{line.replace(/^\d+\.\s/, "")}</li>;
      } else if (line.startsWith("- ")) {
        return <li key={lineIndex}>{line.replace(/^- /, "")}</li>;
      } else if (line.startsWith("**")) {
        return <strong key={lineIndex}>{line.replace(/\*\*/g, "")}</strong>;
      } else {
        return <span key={lineIndex}>{line}</span>;
      }
    });

    return (
      <div key={index} style={{ marginBottom: "1rem" }}>
        {listItems}
      </div>
    );
  });

  return <>{paragraphs}</>;
};

export default ParseContent;
