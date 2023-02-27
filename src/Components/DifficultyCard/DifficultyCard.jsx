import React, {useState} from "react";
import "./DifficultyCard.css";

function DifficultyCard(props) {

    const [selected, setSelected] = useState(false);

    function handleClick() {
        setSelected(true);
        props.chooseDifficulty(props.apitext);
    }
    return (
      <div
        onClick={handleClick}
        className={
          selected === true
            ? "difficulty-card-after diff-btn no-hover"
            : props.removeDiffCards === true
            ? "removed-card"
            : "difficulty-card diff-btn"
        }
      >
        <p>{props.text}</p>
      </div>
    );
}

export default DifficultyCard;