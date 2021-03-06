import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [numRolls, setNumRolls] = React.useState(0);
  const [highscore, setHighscore] = React.useState(
    JSON.parse(localStorage.getItem("highscore") || 40)
  );

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const value = dice[0].value;
    const allValue = dice.every((die) => die.value === value);
    if (allHeld && allValue) {
      setTenzies(true);
      if (numRolls <= highscore) {
        setHighscore(numRolls);
        localStorage.setItem("highscore", JSON.stringify(numRolls));
      }
    }
  }, [dice, numRolls, highscore]);

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push({
        value: Math.floor(Math.random() * 7) + 1,
        isHeld: false,
        id: nanoid(),
      });
    }
    return newDice;
  }

  function rollDice() {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.isHeld
          ? die
          : { ...die, value: Math.floor(Math.random() * 7) + 1, id: nanoid() };
      })
    );

    setNumRolls((oldNum) => (oldNum = oldNum + 1));
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  function newGame() {
    setTenzies(false);
    setDice(allNewDice());
    setNumRolls(0);
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1>Tenzies - React</h1>
      <p>
        Roll until all dice are the same. <br />
        Click each die to freeze it at its current value betweel rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <p>Number of Rolls: {numRolls}</p>
      <p>Lowest Number of Rolls: {highscore}</p>
      <button onClick={tenzies ? newGame : rollDice} className="roll-dice">
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
