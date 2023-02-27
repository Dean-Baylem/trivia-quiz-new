import React, {useState} from "react";
import "./gameovermodal.css";

function GameOverModal(props) {

  const [saveScore, setSaveScore] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleRestart() {
    props.restartGame();
  }

  function handleSave() {
    setSaveScore(true);
  }

  function postSave() {
    setSaved(true);
    setSaveScore(false);
  }

    return (
      <div className="overlay">
        <div className="popup">
          {saveScore === true ? (
            <div>
              <div className="modal-title">
                <p>Please input your name!</p>
              </div>
              <form>
                <input
                  className="modal-input"
                  type="text"
                  id="playerName"
                  name="playerName"
                  placeholder="Input name here..."
                />
                <button className="modal-btn" onClick={postSave}>Save!</button>
              </form>
            </div>
          ) : (
            <div>
              <div className="modal-title">
                <p>Game Over!</p>
              </div>
              <div className="modal-content">
                { saved === true ? <p>Your score of {props.total} has been saved!</p> : <p>Your total score is {props.total}! Congratulations!</p>}
              </div>
              <div>
//                 {!saved && <button className="modal-btn" onClick={handleSave}>Save Score</button>}
                <button className="modal-btn" onClick={handleRestart}>Restart Game</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}

export default GameOverModal;

