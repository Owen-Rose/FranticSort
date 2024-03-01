import React, { useState } from "react";

const PatchNotes: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="bg-white p-4 rounded shadow-md cursor-pointer">
      <h2 className="text-xl font-bold mb-2" onClick={() => setIsOpen(!isOpen)}>
        Patch Notes {isOpen ? "▲" : "▼"}
      </h2>
      {isOpen && (
        <ul className="list-disc pl-5">
          <li>Added search functionality to filter cards and sets.</li>
          <li>
            Removed promotional, digital, and outlier sets like The List and
            Secret Lair.
          </li>
          <li>
            Fixed bugs related to parsing user input. Below are the examples of
            different formats you can input a card and a quantity.
            <ul>
              <li>lightning bolt</li>
              <li>4 lightning bolt</li>
              <li>4x lightning bolt</li>
              <li>x4 lightning bolt</li>
              <li>lightning bolt x4</li>
              <li>lightning bolt 4x</li>
              <li>lightning bolt 4</li>
            </ul>
          </li>
          {/* Add more patch notes as needed */}
        </ul>
      )}
    </div>
  );
};

export default PatchNotes;
