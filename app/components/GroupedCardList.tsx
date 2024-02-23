import React, { useState, useRef } from "react";

interface GroupedCardListProps {
  groupedCards: Record<string, string[]>;
}

const GroupedCardList: React.FC<GroupedCardListProps> = ({ groupedCards }) => {
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [checkedCards, setCheckedCards] = useState<Record<string, boolean>>({});
  const listRef = useRef<HTMLDivElement>(null);

  // Sorting logic for set buttons
  const sortedSets = Object.entries(groupedCards)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([set, cards]) => ({ set, cardCount: cards.length }));

  const handleSetClick = (set: string) => {
    setSelectedSet((prevSet) => (prevSet === set ? null : set));

    // Smooth scroll to the top of the list when a set is clicked
    if (listRef.current) {
      listRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleCheck = (card: string) => {
    setCheckedCards({ ...checkedCards, [card]: !checkedCards[card] });
  };

  const handleCheckAll = () => {
    const newCheckedCards: Record<string, boolean> = {};
    (groupedCards[selectedSet] || []).forEach(
      (card) => (newCheckedCards[card] = true)
    );
    setCheckedCards(newCheckedCards);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-1 p-4 sticky top-0" ref={listRef}>
        {/* Sorting set buttons in descending order based on card count */}
        {sortedSets.map(({ set, cardCount }) => (
          <button
            key={set}
            onClick={() => handleSetClick(set)}
            className={`block w-full text-left p-2 hover:bg-gray-200 border border-transparent hover:border-gray-300 rounded ${
              selectedSet === set ? "bg-gray-200" : ""
            }`}
          >
            {set} ({cardCount} cards)
          </button>
        ))}
      </div>
      <div className="col-span-1 p-4">
        {selectedSet && (
          <div>
            <h2 className="text-lg font-bold mb-2">{selectedSet}</h2>
            <ul>
              {/* Sorting cards alphabetically within the selected set */}
              {groupedCards[selectedSet]
                .sort((a, b) => a.localeCompare(b))
                .map((card) => (
                  <li key={card} className="p-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checkedCards[card]}
                        onChange={() => handleCheck(card)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <p
                        className={`${
                          checkedCards[card]
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {card}
                      </p>
                    </label>
                  </li>
                ))}
            </ul>
            <button
              onClick={handleCheckAll}
              className="mt-2 bg-blue-500 text-white rounded px-2 py-1 cursor-pointer"
            >
              Check All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupedCardList;
