import React, {useState, useEffect} from "react";
import Messageboard from "./MessageBoard/Messageboard";
import CategoryCard from "./CategoryCard/CategoryCard";
import DifficultyCard from "./DifficultyCard/DifficultyCard";
import AnswerCard from "./AnswerCard/AnswerCard";
import GameOverModal from "./GameOverModal/GameOverModal";
import QuestionBoard from "./QuestionBoard/QuestionBoard";

function App() {
  
  // States for use in Messageboard Component
  const [title, setTitle] = useState("Welcome to the Trivia Quiz");
  const [message, setMessage] = useState("");
  const [instructions, setInstructions] = useState("");
  
  // States for Quiz Start Procedure
  const [removeCatCards, setRemoveCatCards] = useState(false);
  const [removeDiffCards, setRemoveDiffCards] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [previousCategories, setPreviousCategories] = useState([]);
  const [quizStart, setQuizStart] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState("");
  
  // API building State
  const [APICategory, setAPICategory] = useState("");

  // States for use During Quiz
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [makeQuestion, setMakeQuestion] = useState(false);
  
  // States for maintaining Score and End of Game
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [restart, setRestart] = useState(false);
  
  // The array stores the value to be shown on buttons and the value to be used
  // when calling the Quiz API for question generation.
  const categories = [
    ["Arts & Literature", "arts_and_literature"],
    ["Film & TV", "film_and_tv"],
    ["Food & Drink", "food_and_drink"],
    ["General Knowledge", "general_knowledge"],
    ["Geography", "geography"],
    ["History", "history"],
    ["Music", "music"],
    ["Science", "science"],
    ["Society & Culture", "society_and_culture"],
    ["Sport & Leisure", "sport_and_leisure"],
  ];

  // Function to provide a delay if required.
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Function to shuffle the order of an array.
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Start GameOver useState Hook
  useEffect(() => {
    if (previousCategories.length === 10) {
      console.log("Game over")
      setGameOver(true);
    } else if (previousCategories.length === 0) {
      setGameOver(false);
    }
  })

  // Title Update useEffect Hook
  useEffect(() => {
    if (quizStart === false) {
      setMessage("Total Score: " + totalScore);
    } else {
      setMessage("Current Round Score: " + score + " / 10")
    }
  });

  useEffect(() => {
    if (removeCatCards === true) {
      setInstructions("Easy: 1 point / Medium: 2 points / Hard: 3 points")
    } else {
      setInstructions("Select one of the categories below, then select a difficulty from; easy, medium or hard. After this you will be shown 10 questions to answer. Good luck!")
    }
  });


  // Create Question Hook
  useEffect (() => {
    if (makeQuestion === true) {
      setCurrentQuestion(questions[questionIndex]["question"]);
      setCorrectAnswer(questions[questionIndex]["correctAnswer"]);
      let allAnswers = [];
      for (let i=0; i<questions[questionIndex]["incorrectAnswers"].length + 1; i++) {
        if (i < questions[questionIndex]["incorrectAnswers"].length) {
          allAnswers.push(questions[questionIndex]["incorrectAnswers"][i]);
        } else {
          allAnswers.push(questions[questionIndex]["correctAnswer"]);
        }
      }
      shuffle(allAnswers);
      setAnswers(allAnswers);
      setTitle("Trivia Quiz - Current Round Score: " + score);
      setMakeQuestion(false);
    }
  })
  

  function getQuestions(APIDifficulty) {
    let url = "https://the-trivia-api.com/api/questions?" + APICategory + "&limit=1&" + APIDifficulty;
    console.log(url);
    fetch(url).then((response) => response.json()).then((data) => setQuestions(data));
  }

  // Function to build the category section of the API endpoint
  function endpointCategory(text) {
    setAPICategory("categories=" + text);
  }

  // Function passed to the children to manage the category selection
  function chooseCategory(apiText, category) {
    setRemoveCatCards(true);
    endpointCategory(apiText);
    setCurrentCategory(category);
  }

  function endPointDiff(text) {
    console.log("difficulty=" + text);
    return ("difficulty=" + text);
  }

  function chooseDifficulty(text) { 
    setRemoveDiffCards(true);
    let diff = endPointDiff(text);
    getQuestions(diff);
    setCurrentDifficulty(text);
    sleep(1000).then(() => {
      setQuizStart(true)
      setMakeQuestion(true);
      setMessage("");
    });
  }


  // Function Checks the Answer - Changes the score and Question Index and 
  // then changes the MakeQuestion boolean to true to trigger the useState() 
  // function to change the current question

  function checkAnswer(value) {
    if (value === correctAnswer) {
      console.log("Ding! Ding! Ding!");
      setScore((prevValue) =>{
        return (prevValue + 1);
      })
      setTotalScore((prevValue) => {
        if (currentDifficulty === "easy") {
          return prevValue + 1;
        } else if (currentDifficulty === "medium") {
          return prevValue + 2;
        } else if (currentDifficulty === "hard") {
          return prevValue + 3;
        } 
      });
      if (questionIndex === 0) {
        sleep(1000).then(() => {
          returnToTitle();
        });
      } else {
        setQuestionIndex((prevValue) => {
          return prevValue + 1;
        });
        sleep(1000).then(() => {
          setMakeQuestion(true);
        });
      }
    } else {
      console.log("Oh no! :(");
      if (questionIndex === 0) {
        sleep(1000).then(() => {
          returnToTitle();
        });
      } else {
      setQuestionIndex((prevValue) => {
        return prevValue + 1;
      });
      sleep(1000).then(() => {
        setMakeQuestion(true);
      });
    }
    }
  }

  // This function returns user to the category choice screen and resets the states
  // That control the flow of the game in preparation of the next round.
  function returnToTitle() {
    sleep(1000).then(() => {
      setQuizStart(false);
      setPreviousCategories((prevValue) => {
        return [...prevValue, currentCategory];
      });
      setMessage("Please Choose the next category");
      setAPICategory("");
      setRemoveCatCards(false);
      setRemoveDiffCards(false);
      setQuestionIndex(0);
      setQuestions([]);
      setAnswers([]);
      setScore(0);
    });
  }

  // Function to be used for various tests as required.
  function testClick() {
    sleep(1000).then(() => {
      setGameOver(true);
    })
  }

  function restartGame() {
    setPreviousCategories([]);
    setRestart(true);
    sleep(2000).then(() => {
    setTitle("Welcome to the Trivia Quiz");
    setRemoveCatCards(false);
    setRemoveDiffCards(false);
    setCurrentCategory("");
    setQuizStart(false);
    setCurrentDifficulty("");
    setQuestions([]);
    setMakeQuestion(false);
    setTotalScore(0);
    setRestart(false);
    })
  }

  // SPA Return Statement
  return (
    <div className="App">
      <Messageboard title={title} message={message} started={quizStart} instructions={instructions}/>
      {gameOver && <GameOverModal total={totalScore} restartGame={restartGame}/>}
      <div
        className={
          removeDiffCards === true ? "double-card-container" : (removeCatCards === false ? "card-container" : "single-card-container")
        }
      >
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            id={index}
            restart={restart}
            text={category[0]} // Displays what is on the card
            endpointtext={category[1]} // Text for use on the API endpoint for the category
            chooseCategory={chooseCategory} // Function to handle category selection
            remove={removeCatCards} // State to show if the cards have been removed from the screen.
            difficultySelected={removeDiffCards}
            used={previousCategories.includes(category[0]) ? true : false}
          />
        ))}
        {removeCatCards === true ? (
          <DifficultyCard
            text="Easy"
            apitext="easy"
            removeDiffCards={removeDiffCards}
            chooseDifficulty={chooseDifficulty}
          />
        ) : null}
        {removeCatCards === true ? (
          <DifficultyCard
            text="Medium"
            apitext="medium"
            removeDiffCards={removeDiffCards}
            chooseDifficulty={chooseDifficulty}
          />
        ) : null}
        {removeCatCards === true ? (
          <DifficultyCard
            text="Hard"
            apitext="hard"
            removeDiffCards={removeDiffCards}
            chooseDifficulty={chooseDifficulty}
          />
        ) : null}
      </div>
      <div>
        {quizStart === true && <QuestionBoard question={currentQuestion}/>}
        {answers.map((answer, index) => (
          <AnswerCard 
          key={index} 
          id={index} 
          text={answer} 
          checkAnswer={checkAnswer}
          correctAnswer={correctAnswer}  
          />
        ))}
      </div>
    </div>
  );
}

export default App;


{/* <button onClick={testClick}>Click me to test!</button>; */}