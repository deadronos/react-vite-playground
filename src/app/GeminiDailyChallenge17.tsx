/*

🚀 Day 17: The Key-Value Vocabulary Flashcard App (Two-Sided UI Flipping)
Let's shift gears to an interactive layout used across all educational software, e-learning dashboards, and memory tools: The Two-Sided Interactive Flashcard Deck.

This challenge focuses on managing data array indexes, handling custom CSS transform classes (or conditional element flips), and controlling linear layout progression.

The Goal:
Create a compact vocabulary learning app where clicking a card flips it over to show the answer, with progression buttons to slide through the deck list.

Let's use this mock list of study terms:

TypeScript
const studyDeck = [
  { id: 1, word: "State", definition: "A built-in React object used to store data that changes over time and triggers component re-renders." },
  { id: 2, word: "Props", definition: "Read-only configurations passed down from a parent component to a child component." },
  { id: 3, word: "Hook", definition: "Special isolated functions that let you attach into React state and lifecycle assets from functional components." },
];
Requirements:

The Card Container: Display the word text centered inside a card layout box.

The Flipping Mechanic: Clicking anywhere on the active card body toggles its view state between showing the front side (word) or the back side (definition).

Deck Navigation: Add "Previous Card" and "Next Card" navigation actions. When sliding to a new item, ensure the card automatically resets back to showing the front side first.

Smart Bounds: Ensure the buttons lock/disable correctly when you hit the first or last index entries of your dataset array.

💡 Hints to get you started:
Two Dimensions of State: You'll need an integer to track the current card index entry (currentIndex), and a simple boolean flag to track whether it's flipped open (isFlipped).

Resetting on Change: When changing indices via your navigation actions, update both state channels together:

TypeScript
setCurrentIndex(nextIndex);
setIsFlipped(false); // Resets view status smoothly!
Set up your collection variables, wire up your toggles, and let's see how your training deck turns out in your Vite sandbox! Paste your update whenever you are ready.

*/

import React, { useState } from 'react';
import { Card } from '@radix-ui/themes';

function GeminiDailyChallenge17() {

  const studyDeck = [
    { id: 1, word: "State", definition: "A built-in React object used to store data that changes over time and triggers component re-renders." },
    { id: 2, word: "Props", definition: "Read-only configurations passed down from a parent component to a child component." },
    { id: 3, word: "Hook", definition: "Special isolated functions that let you attach into React state and lifecycle assets from functional components." },
  ];

  return (
    <div>
      <h1>Gemini Daily Challenge 17: The Key-Value Vocabulary Flashcard App</h1>
      <p>Click on the card to flip it and see the definition. Use the buttons to navigate through the deck.</p>
      {/* Your implementation goes here */}
      <DeckContainer studyDeck={studyDeck} />
    </div>
  );
}

export default GeminiDailyChallenge17;

interface CardContainerProps {
  studyDeck: { id: number; word: string; definition: string }[];
}

function CardContainer({ studyDeck }: CardContainerProps) {

  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(studyDeck.length>0? 0 : -1);

  function goToNextCard() {
    if (currentIndex < studyDeck.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false); // Reset flip state when moving to the next card
    }
  }

  function goToPreviousCard() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false); // Reset flip state when moving to the previous card
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
    <div style={{ position: 'relative', top: '10px', left: '10px' }}>
        <button onClick={goToPreviousCard} disabled={currentIndex <= 0}>Previous Card</button>
      </div>
    <Card style={{ width: '300px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'gray'}}>
      {/* Card content will go here */}

      {currentIndex >= 0 && (
        !isFlipped ? (
          <div onClick={() => setIsFlipped(true)}>
            <h2>{studyDeck[currentIndex].word}</h2>
          </div>
        ) : (
          <div onClick={() => setIsFlipped(false)}>
            <p>{studyDeck[currentIndex].definition}</p>
          </div>
        )

      )}

    </Card>
    <div style={{ position: 'relative', top: '10px', right: '10px' }}>
        <button onClick={goToNextCard} disabled={currentIndex >= studyDeck.length - 1}>Next Card</button>
      </div>
    </div>
  )
}

interface DeckContainerProps {
  studyDeck: { id: number; word: string; definition: string }[];
}

function DeckContainer({ studyDeck }: DeckContainerProps) {

  return (
    <div>
      {/* Deck content will go here */}
      <CardContainer studyDeck={studyDeck} />
    </div>
  );
}
