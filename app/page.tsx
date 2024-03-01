"use client";
import React, { useState } from "react";
import InputForm from "./components/InputForm";
import GroupedCardList from "./components/GroupedCardList";
import { getSetsFromCard } from "./services/scryfallServices";
import Footer from "./components/Footer";
import PatchNotes from "./components/PatchNotes";

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
  const [searchTerm, setSearchTerm] = useState("");

  const handleFormSubmit = async (inputText: string) => {
    setIsLoading(true);
    const cardList = inputText
      .split("\n")
      .map((line) => {
        // Updated regex to match the different input formats
        const match = line.match(
          /(?:x?(\d+)x?\s*|\sx?(\d+)\s*)?(.+?)(?:\s*x?(\d+)x?|\sx?(\d+))?$/
        );
        if (match) {
          const quantity =
            parseInt(match[1] || match[2] || match[4] || match[5]) || 1;
          const name = match[3].trim();
          return { name, quantity };
        }
        return null;
      })
      .filter(
        (card): card is { name: string; quantity: number } => card !== null
      ); // Type assertion

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
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <header className="text-center py-5 bg-blue-500 text-white relative">
        {view === "input" ? (
          <h1 className="text-3xl font-bold">Welcome!</h1>
        ) : (
          <div className="w-full px-4 md:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto text-black">
            <input
              type="text"
              placeholder="Search for cards or sets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300"
            />
          </div>
        )}
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
          <div className="bg-gray-200 h-4 rounded-full">
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
      <main className="container mx-auto px-4 flex-grow">
        {view === "input" ? (
          <>
            <InputForm onSubmit={handleFormSubmit} />
            <PatchNotes />
          </>
        ) : (
          <GroupedCardList
            groupedCards={groupedCards}
            cardQuantities={cardQuantities}
            updateGatheredCards={updateGatheredCards}
            searchTerm={searchTerm}
          />
        )}
        {isLoading && <p className="mt-4">Loading...</p>}
      </main>
      <footer className="bg-gray-200 py-4 text-center">
        <Footer />
      </footer>
    </div>
  );
};
export default App;
