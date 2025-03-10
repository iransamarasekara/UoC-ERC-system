import { useState } from "react";

const ChooseResearchType = ({ onSubmit }) => {
  const [researchType, setResearchType] = useState("");

  const handleChange = (e) => {
    const selectedResearchType = e.target.value;
    setResearchType(selectedResearchType);
    onSubmit(selectedResearchType);
  };

  return (
    <div className="flex flex-col items-center p-8">
      {/* Research Type Selection */}
      <div className="mt-6 text-center">
        <p className="text-gray-700">
          Specify the type of research you are conducting (e.g., human, animal,
          observational) to guide the ethics review process.
        </p>

        {/* Dropdown Selection */}
        <div className="mt-4">
          <select
            className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-700 cursor-pointer"
            value={researchType}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choose...
            </option>
            <option value="Human">Human Research</option>
            <option value="Animal">Animal Research</option>
            <option value="Observational">Observational Research</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ChooseResearchType;
