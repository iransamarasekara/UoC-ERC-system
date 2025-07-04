import { useState } from "react";

const ChooseCategory = ({ onSubmit }) => {
  const [category, setCategory] = useState("");

  const handleChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    onSubmit(selectedCategory);
  };

  return (
    <div className="flex flex-col items-center p-8">
      {/* Category Selection */}
      <div className="mt-6 text-center">
        <p className="text-gray-700">
          Select the appropriate category for your research (e.g., clinical,
          biomedical, social sciences) to ensure it is reviewed by the correct
          panel.
        </p>

        {/* Dropdown Selection */}
        <div className="mt-4">
          <select
            className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-700 cursor-pointer"
            value={category}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choose...
            </option>
            <option value="Clinical">Clinical</option>
            <option value="Biomedical">Biomedical</option>
            <option value="Social Sciences">Social Sciences</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ChooseCategory;
