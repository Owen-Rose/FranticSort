import React, { useState } from "react";

interface UnrecognizedCardsListProps {
  unrecognizedCards: string[];
  onEdit: (index: number, newName: string) => void;
}

const UnrecognizedCardsList: React.FC<UnrecognizedCardsListProps> = ({
  unrecognizedCards,
  onEdit,
}) => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState(""); // Corrected variable name here

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(unrecognizedCards[index]);
  };

  const handleSave = () => {
    if (editIndex !== null) {
      onEdit(editIndex, editValue);
      setEditIndex(null);
      setEditValue("");
    }
  };

  return (
    <div>
      <h3>Unrecognized Cards:</h3>
      <ul>
        {unrecognizedCards.map((card, index) => (
          <li key={index}>
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button onClick={handleSave}>Save</button>
              </>
            ) : (
              <>
                {card}
                <button onClick={() => handleEdit(index)}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnrecognizedCardsList;
