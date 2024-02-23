// InputForm.tsx
import React, { useState } from "react";

interface InputFormProps {
  onSubmit: (inputText: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputText);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">
        Enter your list of Magic the Gathering cards:
      </h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={5}
          className="text-black block w-full p-2 border border-gray-300"
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default InputForm;
