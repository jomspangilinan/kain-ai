import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Picker from "react-mobile-picker";

const WeightPage = () => {
    const navigate = useNavigate();

    // Options for the picker
    const selections = {
        integer: Array.from({ length: 200 }, (_, i) => i.toString()), // 0 to 199
        decimal: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], // 0 to 9
    };

    // State for weight selection
    const [pickerValue, setPickerValue] = useState({
        integer: "75", // Default integer value
        decimal: "0",  // Default decimal value
    });

    // Handle "Next" button click
    const handleNext = () => {
        const selectedWeight = `${pickerValue.integer}.${pickerValue.decimal}`;
        console.log(`Selected Weight: ${selectedWeight} kg`);
        navigate("/next-step"); // Replace with the actual next step route
    };

    return (
        <div className="h-screen w-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center px-4 py-4 bg-gradient-to-r from-orange-400 to-orange-600 text-white">
                <button
                    onClick={() => navigate(-1)}
                    className="text-white hover:text-gray-200"
                >
                    <AiOutlineArrowLeft size={24} />
                </button>
                <h1 className="text-center flex-1 font-bold text-lg">
                    Body Data
                </h1>
            </div>

            {/* Title */}
            <div className="text-center mt-6 px-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    What's your weight?
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                    Specify your weight as closely as possible
                </p>
            </div>

            {/* Weight Picker */}
            <div className="flex-grow flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <Picker value={pickerValue} onChange={setPickerValue}>
                        {Object.keys(selections).map((name) => (
                            <Picker.Column key={name} name={name as keyof typeof selections}>
                                {selections[name as keyof typeof selections].map((option) => (
                                    <Picker.Item key={option} value={option}>
                                        {option}
                                    </Picker.Item>
                                ))}
                            </Picker.Column>
                        ))}
                    </Picker>
                    <span className="text-lg font-semibold text-gray-800">kg</span>
                </div>
            </div>

            {/* Next Button */}
            <div className="px-6 pb-6">
                <button
                    onClick={handleNext}
                    className="w-full bg-black text-white font-medium py-4 rounded-lg hover:bg-gray-800 transition-all duration-200"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default WeightPage;