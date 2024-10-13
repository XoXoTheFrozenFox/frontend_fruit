import React, { useEffect, useState } from 'react';
import './FallingFruit.css'; // Import the CSS file for styles

const fruits = ['🍌', '🍎', '🍇', '🍉', '🍑', '🍍', '🍓', '🍊']; // List of fruit emojis

const FallingFruit = () => {
  const [fruitList, setFruitList] = useState([]);

  // Function to spawn a single fruit
  const spawnFruit = () => {
    const fruit = {
      emoji: fruits[Math.floor(Math.random() * fruits.length)],
      left: Math.random() * 100, // Random position across the screen width
      animationDuration: 5, // Set a constant falling duration (5s)
    };
    setFruitList((prev) => [...prev, fruit]);

    // Remove fruit after animation ends
    setTimeout(() => {
      setFruitList((prev) => prev.filter((f) => f !== fruit));
    }, (fruit.animationDuration + 10) * 100000); // Keep for the duration of the animation + 1 second
  };

  // Spawn a new fruit every second
  useEffect(() => {
    const interval = setInterval(spawnFruit, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="falling-fruit-container">
      {fruitList.map((fruit, index) => (
        <div
          key={index}
          className="falling-fruit"
          style={{
            left: `${fruit.left}vw`,
            animationDuration: `${fruit.animationDuration}s`,
          }}
        >
          {fruit.emoji}
        </div>
      ))}
    </div>
  );
};

export default FallingFruit;
