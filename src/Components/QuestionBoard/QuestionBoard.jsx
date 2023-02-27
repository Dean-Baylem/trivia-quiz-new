import React from "react";
import "./QuestionBoard.css"

function QuestionBoard(props) {
    return (
      <div className="question-board">
        <h5>{props.question}</h5>
      </div>
    );
}

export default QuestionBoard;