import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface GroupedCardListProps {
  groupedCards: Record<
    string,
    {
      cards: { name: string; imageUrl: string }[];
      quantity: number;
      releasedAt: string;
    }
  >;
  cardQuantities: Record<string, number>;
  updateGatheredCards: (count: number) => void;
  searchTerm: string;
}

const GroupedCardList: React.FC<GroupedCardListProps> = ({
  groupedCards,
  cardQuantities,
  updateGatheredCards,
  searchTerm,
}) => {
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [collectedCards, setCollectedCards] = useState<Record<string, number>>(
    {}
  );
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialCollectedCards: Record<string, number> = {};
    Object.values(groupedCards).forEach(({ cards }) => {
      cards.forEach(({ name }) => {
        initialCollectedCards[name] = 0;
      });
    });
    setCollectedCards(initialCollectedCards);
  }, [groupedCards]);

  useEffect(() => {
    const totalCollected = Object.entries(collectedCards).reduce(
      (sum, [card, count]) => {
        return sum + Math.min(count, cardQuantities[card]);
      },
      0
    );
    updateGatheredCards(totalCollected);
  }, [collectedCards, cardQuantities, updateGatheredCards]);

  const sortedSets = Object.entries(groupedCards)
    .filter(
      ([set, { cards }]) =>
        searchTerm === "" ||
        set.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cards.some(({ name }) =>
          name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => {
      const cardCountDiff = b[1].cards.length - a[1].cards.length;
      if (cardCountDiff !== 0) {
        return cardCountDiff;
      }

      const dateA = new Date(a[1].releasedAt);
      const dateB = new Date(b[1].releasedAt);
      return dateB.getTime() - dateA.getTime();
    })
    .map(([set, { cards, releasedAt }]) => ({
      set,
      releasedAt,
      remainingCards: cards.filter(
        ({ name }) => collectedCards[name] < cardQuantities[name]
      ).length,
      allCollected: cards.every(
        ({ name }) => collectedCards[name] >= cardQuantities[name]
      ),
    }));

  const handleSetClick = (set: string) => {
    setSelectedSet((prevSet) => (prevSet === set ? null : set));

    if (listRef.current) {
      const listPosition =
        listRef.current.getBoundingClientRect().top + window.pageYOffset;
      const offset = 80; // Adjust this value as needed to ensure the progress bar is visible
      window.scrollTo({
        top: listPosition - offset,
        behavior: "smooth",
      });
    }
  };

  const incrementCardCount = (card: string) => {
    if (collectedCards[card] < cardQuantities[card]) {
      setCollectedCards((prev) => ({
        ...prev,
        [card]: (prev[card] || 0) + 1,
      }));
    }
  };

  const decrementCardCount = (card: string) => {
    setCollectedCards((prev) => ({
      ...prev,
      [card]: Math.max(0, (prev[card] || 0) - 1),
    }));
  };

  const checkAllCards = (set: string) => {
    const updatedCollectedCards = { ...collectedCards };
    groupedCards[set].cards.forEach(({ name }) => {
      updatedCollectedCards[name] = cardQuantities[name];
    });
    setCollectedCards(updatedCollectedCards);
  };

  const uncheckAllCards = (set: string) => {
    const updatedCollectedCards = { ...collectedCards };
    groupedCards[set].cards.forEach(({ name }) => {
      updatedCollectedCards[name] = 0;
    });
    setCollectedCards(updatedCollectedCards);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-1 p-4 sticky top-0" ref={listRef}>
        {sortedSets.map(({ set, remainingCards, allCollected }) => (
          <button
            key={set}
            onClick={() => handleSetClick(set)}
            className={`block w-full text-left p-2 hover:bg-gray-200 border border-transparent hover:border-gray-300 rounded ${
              selectedSet === set
                ? "bg-gray-200"
                : allCollected
                ? "bg-green-200"
                : ""
            }`}
          >
            {set} ({remainingCards} cards) {allCollected ? "✓" : ""}
          </button>
        ))}
      </div>
      <div className="col-span-1 p-4">
        {selectedSet && (
          <div>
            <h2 className="text-lg font-bold mb-2">{selectedSet}</h2>
            <button
              onClick={() => checkAllCards(selectedSet)}
              className="bg-blue-500 text-white rounded px-2 py-1 mr-2"
            >
              Check All
            </button>
            <button
              onClick={() => uncheckAllCards(selectedSet)}
              className="bg-red-500 text-white rounded px-2 py-1"
            >
              Uncheck All
            </button>
            <ul className="mt-2">
              {groupedCards[selectedSet]?.cards
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(({ name, imageUrl }) => (
                  <li
                    key={name}
                    className="p-1 flex justify-between items-center group"
                  >
                    <div className="relative">
                      <p
                        className={`${
                          collectedCards[name] >= cardQuantities[name]
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {name} (x{cardQuantities[name]})
                      </p>
                      <div className="absolute hidden group-hover:block p-1">
                        <div className="relative w-32 h-44 lg:w-64 lg:h-88 z-10">
                          <Image
                            src={imageUrl}
                            alt={name}
                            width={252}
                            height={352}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => decrementCardCount(name)}
                        className="bg-red-500 text-white rounded px-2 py-1 mr-2"
                        style={{ width: "2.5rem" }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: "1.5rem", textAlign: "center" }}>
                        {" "}
                        {/* Minimum width for number display */}
                        {collectedCards[name] || 0}
                      </span>
                      <button
                        onClick={() => incrementCardCount(name)}
                        className="bg-green-500 text-white rounded px-2 py-1 ml-2"
                        style={{ width: "2.5rem" }}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupedCardList;
