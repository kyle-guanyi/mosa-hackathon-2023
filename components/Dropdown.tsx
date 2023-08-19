import {useState} from "react";

interface DropdownProps {
    options: string[];
    selected: string;
    onSelectedChange: (selected: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selected, onSelectedChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-500 text-white p-2 rounded shadow">
                {selected || "Select an option"}
            </button>
            {isOpen && (
                <ul className="absolute left-0 mt-2 w-480 bg-white rounded shadow-md">
                    {options.map((option, idx) => (
                        <li key={idx}>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSelectedChange(option);
                                    setIsOpen(false);
                                }}
                                className="block px-4 py-2 hover:bg-blue-500 hover:text-white"
                            >
                                {option}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
