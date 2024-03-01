import React from "react";

const PatchNotes = () => {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">Patch Notes</h2>
      <ul className="list-disc pl-5">
        <li>Added search functionality to filter cards and sets.</li>
        <li>
          Removed promotional, digital and outlier sets like The List and Secret
          lair.
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
    </div>
  );
};

export default PatchNotes;
