import { useState } from "react";

interface MultiSelectDropdownProps {
  options: string[];
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selected = [],
  onSelectedChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onSelectedChange(selected.filter((item) => item !== option));
    } else {
      onSelectedChange([...selected, option]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white p-2 rounded shadow"
      >
        {selected.length ? selected.join(", ") : "Select options"}
      </button>
      {isOpen && (
        <ul className="absolute left-0 mt-2 w-48 bg-white rounded shadow-md overflow-y-auto max-h-48 z-50">
          {options.map((option, idx) => (
            <li
              key={idx}
              className="flex items-center px-4 py-2 hover:bg-blue-500 hover:text-white"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={(e) => {
                  console.log("MultiSelectDropDown")
                  e.preventDefault();
                  e.stopPropagation();
                  toggleOption(option);
                }}
                className="mr-3"
              />
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
