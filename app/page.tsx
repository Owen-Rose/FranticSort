"use client";
import React, { useState } from "react";
import InputForm from "./components/InputForm";
import GroupedCardList from "./components/GroupedCardList";
import { getSetsFromCard } from "./services/scryfallServices";

const App: React.FC = () => {
  const [view, setView] = useState<"input" | "results">("input");
  const [groupedCards, setGroupedCards] = useState<Record<string, string[]>>(
    {}
  );
  const [printOption, setPrintOption] = useState("Original");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (inputText: string) => {
    setIsLoading(true);
    const cardList = inputText.split("\n").map((cardName) => cardName.trim());
    const uniqueCardList = [...new Set(cardList)];

    const cardSetInfo = await Promise.all(
      uniqueCardList.map((cardName) => getSetsFromCard(cardName, printOption))
    );

    const groupedCardsData: Record<string, string[]> = {};
    cardSetInfo.forEach(({ cardName, set }) => {
      if (!groupedCardsData[set]) {
        groupedCardsData[set] = [];
      }
      groupedCardsData[set].push(cardName);
    });

    setGroupedCards(groupedCardsData);
    setIsLoading(false);
    setView("results"); // Switch to results view after processing
  };

  const handleBackToInput = () => {
    setView("input"); // Switch back to input view
    setGroupedCards({}); // Clear the grouped cards
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="text-center py-5 bg-blue-500 text-white">
        <h1 className="text-3xl font-bold">Welcome!</h1>
      </header>
      <main className="container mx-auto px-4">
        {view === "input" ? (
          <InputForm onSubmit={handleFormSubmit} />
        ) : (
          <>
            <button
              onClick={handleBackToInput}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Back to Input
            </button>
            <GroupedCardList groupedCards={groupedCards} />
          </>
        )}
        {isLoading && <p className="mt-4">Loading...</p>}
      </main>
    </div>
  );
};

export default App;
