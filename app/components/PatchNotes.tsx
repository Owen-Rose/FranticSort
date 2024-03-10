import React, { useState } from "react";

const PatchNotes: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="bg-white p-4 rounded shadow-md cursor-pointer">
      <h2 className="text-xl font-bold mb-2" onClick={() => setIsOpen(!isOpen)}>
        Patch Notes - March 10 2024 {isOpen ? "▲" : "▼"}
      </h2>
      {isOpen && (
        <ul className="list-disc pl-5">
          <li>Added Images when you hover over card names in the list.</li>
          {/* Add more patch notes as needed */}
        </ul>
      )}
    </div>
  );
};

export default PatchNotes;
