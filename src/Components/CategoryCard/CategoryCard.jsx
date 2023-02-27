import React, {useState, useEffect} from "react";
import "./categoryCard.css";

function CategoryCard(props) {

    const [chosen, setChosen] = useState(false);
    
    function handleClick() {
        setChosen(true);
        props.chooseCategory(props.endpointtext, props.text);
    }

    useEffect(() => {
      if (props.restart === true) {
        setChosen(false);
      }
    })

    return (
      <div
        className={
          props.used === true
            ? "removed-card"
            : chosen === false
            ? props.remove === true
              ? "removed-card"
              : "cat-card btn"
            : props.difficultySelected === true
            ? "chosen-card-post-difficulty btn no-hover"
            : "chosen-card btn no-hover"
        }
        onClick={handleClick}
      >
        <p>{props.text}</p>
      </div>
    );
}

export default CategoryCard;