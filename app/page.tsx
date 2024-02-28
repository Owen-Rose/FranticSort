"use client";
import React, { useState } from "react";
import InputForm from "./components/InputForm";
import GroupedCardList from "./components/GroupedCardList";
import { getSetsFromCard } from "./services/scryfallServices";

const App: React.FC = () => {
  const [view, setView] = useState<"input" | "results">("input");
  const [groupedCards, setGroupedCards] = useState<
    Record<string, { cards: string[]; quantity: number; releasedAt: string }>
  >({});
  const [cardQuantities, setCardQuantities] = useState<Record<string, number>>(
    {}
  );
  const [totalCards, setTotalCards] = useState(0);
  const [gatheredCards, setGatheredCards] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (inputText: string) => {
    setIsLoading(true);
    const cardList = inputText
      .split("\n")
      .map((line) => {
        const match = line.match(/(?:(\d+)x?\s*)?(.+)/);
        return match
          ? { name: match[2].trim(), quantity: parseInt(match[1]) || 1 }
          : null;
      })
      .filter((card) => card !== null);

    const totalCardsQuantity = cardList.reduce(
      (sum, { quantity }) => sum + quantity,
      0
    );
    setTotalCards(totalCardsQuantity);

    const cardQuantitiesData: Record<string, number> = {};
    cardList.forEach(({ name, quantity }) => {
      cardQuantitiesData[name] = (cardQuantitiesData[name] || 0) + quantity;
    });
    setCardQuantities(cardQuantitiesData);

    const cardSetInfo = await Promise.all(
      cardList.map(({ name }) => getSetsFromCard(name))
    );

    const groupedCardsData: Record<
      string,
      { cards: string[]; quantity: number; releasedAt: string }
    > = {};
    cardSetInfo.forEach(({ cardName, sets }) => {
      sets.forEach(({ set, released_at }) => {
        if (!groupedCardsData[set]) {
          groupedCardsData[set] = {
            cards: [],
            quantity: 0,
            releasedAt: released_at,
          };
        }
        if (!groupedCardsData[set].cards.includes(cardName)) {
          groupedCardsData[set].cards.push(cardName);
        }
      });
    });

    setGroupedCards(groupedCardsData);
    setIsLoading(false);
    setView("results");
  };
  const handleBackToInput = () => {
    setView("input");
    setGroupedCards({});
    setCardQuantities({});
    setTotalCards(0);
    setGatheredCards(0);
  };

  const updateGatheredCards = (count: number) => {
    setGatheredCards(count);
  };

  const progressPercentage =
    totalCards > 0 ? Math.min((gatheredCards / totalCards) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="text-center py-5 bg-blue-500 text-white relative">
        <h1 className="text-3xl font-bold">Welcome!</h1>
        {view === "results" && (
          <button
            onClick={handleBackToInput}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded"
          >
            Back to Input
          </button>
        )}
      </header>
      {view === "results" && (
        <div className="container mx-auto px-4 my-4">
          <div className=" bg-gray-200 h-4 rounded-full">
            <div
              className={`h-4 rounded-full ${
                progressPercentage === 100 ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">
            Gathered {gatheredCards} out of {totalCards} cards
          </p>
        </div>
      )}
      <main className="container mx-auto px-4">
        {view === "input" ? (
          <InputForm onSubmit={handleFormSubmit} />
        ) : (
          <GroupedCardList
            groupedCards={groupedCards}
            cardQuantities={cardQuantities}
            updateGatheredCards={updateGatheredCards}
          />
        )}
        {isLoading && <p className="mt-4">Loading...</p>}
      </main>
    </div>
  );
};

export default App;
