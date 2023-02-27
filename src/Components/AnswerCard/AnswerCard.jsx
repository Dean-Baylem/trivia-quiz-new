import React, { useState } from "react";
import "./AnswerCard.css";

function AnswerCard(props) {
  const [answerStyle, setAnswerStyle] = useState("answer-btn");

  // Function to provide a delay if required.
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function handleClick() {
    if (props.correctAnswer === props.text) {
      setAnswerStyle("correct-answer-btn");
    } else {
      setAnswerStyle("incorrect-answer-btn");
    }
    sleep(1000).then(() => {
    props.checkAnswer(props.text);
    setAnswerStyle("answer-btn");
    })
    
  }

  return (
    <div>
      <button className={answerStyle} onClick={handleClick}>
        {props.text}
      </button>
    </div>
  );
}

export default AnswerCard;