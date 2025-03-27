import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaUser,
    FaSmileBeam,
    FaRulerVertical,
    FaCalendarAlt,
    FaRunning,
    FaArrowLeft,
} from "react-icons/fa";
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

import Picker from 'react-mobile-picker'

type LifestyleOption = "sedentary" | "lightlyActive" | "active" | "veryActive";

const PersonalInfoPage: React.FC = () => {
    const [step, setStep] = useState(0);
    const { width, height } = useWindowSize()
    const [formData, setFormData] = useState({
        name: "",
        weight: 70.0,    // allow decimal
        height: 170,
        birthday: "",
        lifestyle: "sedentary" as LifestyleOption,
    });

    // Generic change handler
    const handleChange = (field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Step navigation
    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => (prev > 0 ? prev - 1 : 0));

    //const [weight, setWeight] = useState(70.0); // Default weight

    // Generate weight options (30.0 to 200.0 with 0.1 steps)
    //const weightOptions = Array.from({ length: 1701 }, (_, i) => (30 + i * 0.1).toFixed(1));
    const selections = {
        title: ['1.', '2.', '3.', '4.'],
        firstName: ['1', '2', '3'],
        lastName: ['1', '2', '3', '4', '5']
    }

    const [pickerValue, setPickerValue] = useState({
        title: '1.',
        firstName: '2',
        lastName: '3'
    })

    // Framer Motion step transitions
    const stepVariants = {
        hidden: { opacity: 0, x: 50, scale: 0.8 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
        exit: { opacity: 0, x: -50, scale: 0.8 },
    };

    // Icon bounce
    const iconVariants = {
        hidden: { y: -50, scale: 0 },
        visible: {
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 12,
            },
        },
    };

    // Bouncy button effect
    const buttonMotion = {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
    };

    // Render each step
    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <motion.div
                        key="step0"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center"
                    >
                        <motion.div variants={iconVariants} initial="hidden" animate="visible" className="mb-4">
                            <FaUser className="text-4xl text-gray-400" />
                        </motion.div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-700">
                            What do you want me to call you?
                        </h2>
                        <input
                            type="text"
                            placeholder="Enter your name or nickname"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded w-full max-w-xs text-center
                         focus:outline-none"
                        />
                        <motion.button
                            {...buttonMotion}
                            onClick={handleNext}
                            disabled={!formData.name.trim()}
                            className="mt-6 px-4 py-2 bg-green-500 text-white font-semibold rounded disabled:opacity-50"
                        >
                            Next
                        </motion.button>
                    </motion.div>
                );

            case 1:
                return (
                    <motion.div
                        key="step1"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center text-center"
                    >
                        <motion.div variants={iconVariants} initial="hidden" animate="visible" className="mb-4">
                            <FaSmileBeam className="text-4xl text-white" />
                        </motion.div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-700">Hello, {formData.name}!</h2>
                        <p className="mb-4 text-gray-600">What’s your weight?</p>
                        <div className="flex flex-col items-center">
                            <input
                                type="range"
                                min={30}
                                max={200}
                                step={0.1}
                                value={formData.weight}
                                onChange={(e) => handleChange("weight", parseFloat(e.target.value))}
                                className="w-64"
                            />
                            <div className="mt-2 font-semibold text-gray-700">
                                {formData.weight.toFixed(1)} kg
                            </div>
                        </div>
                        <Picker value={pickerValue} onChange={setPickerValue}>
                            {Object.keys(selections).map((name) => (
                                <Picker.Column key={name} name={name}>
                                    {selections[name as keyof typeof selections].map((option) => (
                                        <Picker.Item key={option} value={option}>
                                            {option}
                                        </Picker.Item>
                                    ))}
                                </Picker.Column>
                            ))}
                        </Picker>

                        <motion.button
                            {...buttonMotion}
                            onClick={handleNext}
                            className="mt-6 px-4 py-2 bg-green-500 text-white font-semibold rounded disabled:opacity-50"
                        >
                            Next
                        </motion.button>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        key="step2"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center text-center"
                    >
                        <motion.div variants={iconVariants} initial="hidden" animate="visible" className="mb-4">
                            <FaRulerVertical className="text-4xl text-white" />
                        </motion.div>
                        <h2 className="text-xl font-semibold mb-2 text-white">What’s your height?</h2>
                        <p className="mb-2 text-white">Slide to select your height in cm:</p>
                        <div className="flex flex-col items-center">
                            <input
                                type="range"
                                min={100}
                                max={220}
                                step={1}
                                value={formData.height}
                                onChange={(e) => handleChange("height", parseFloat(e.target.value))}
                                className="w-64"
                            />
                            <div className="mt-2 font-semibold text-white">{formData.height} cm</div>
                        </div>
                        <motion.button
                            {...buttonMotion}
                            onClick={handleNext}
                            className="mt-6 px-4 py-2 bg-white text-green-600 font-semibold rounded"
                        >
                            Next
                        </motion.button>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        key="step3"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center text-center"
                    >
                        <motion.div variants={iconVariants} initial="hidden" animate="visible" className="mb-4">
                            <FaCalendarAlt className="text-4xl text-white" />
                        </motion.div>
                        <h2 className="text-xl font-semibold mb-2 text-white">When’s your birthday?</h2>
                        <input
                            type="date"
                            value={formData.birthday}
                            onChange={(e) => handleChange("birthday", e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded mt-2 focus:outline-none"
                        />
                        <motion.button
                            {...buttonMotion}
                            onClick={handleNext}
                            disabled={!formData.birthday}
                            className="mt-6 px-4 py-2 bg-white text-green-600 font-semibold rounded disabled:opacity-50"
                        >
                            Next
                        </motion.button>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        key="step4"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center text-center"
                    >
                        <motion.div variants={iconVariants} initial="hidden" animate="visible" className="mb-4">
                            <FaRunning className="text-4xl text-white" />
                        </motion.div>
                        <h2 className="text-xl font-semibold mb-2 text-white">Lifestyle</h2>
                        <p className="mb-4 text-white">How active are you?</p>
                        <div className="flex flex-col gap-2 mb-4">
                            {(["sedentary", "lightlyActive", "active", "veryActive"] as LifestyleOption[]).map(
                                (lvl) => (
                                    <label key={lvl} className="flex items-center gap-2 text-white">
                                        <input
                                            type="radio"
                                            value={lvl}
                                            checked={formData.lifestyle === lvl}
                                            onChange={(e) => handleChange("lifestyle", e.target.value)}
                                        />
                                        {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                                    </label>
                                )
                            )}
                        </div>
                        <motion.button
                            {...buttonMotion}
                            onClick={handleNext}
                            className="px-4 py-2 bg-white text-green-600 font-semibold rounded"
                        >
                            Next
                        </motion.button>
                    </motion.div>
                );

            case 5:
                return (
                    <motion.div
                        key="step5"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center text-center"
                    >
                        <motion.h2
                            className="text-2xl font-bold mb-4 text-white"
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 150, damping: 8 }}
                        >
                            Congratulations! Profile set up!
                        </motion.h2>
                        <p className="mb-4 text-white">Here’s your info:</p>
                        <div className="bg-white/90 border border-gray-200 rounded shadow p-4 w-full max-w-sm text-left text-gray-800">
                            <p>
                                <strong>Name: </strong>
                                {formData.name}
                            </p>
                            <p>
                                <strong>Weight: </strong>
                                {formData.weight.toFixed(1)} kg
                            </p>
                            <p>
                                <strong>Height: </strong>
                                {formData.height} cm
                            </p>
                            <p>
                                <strong>Birthday: </strong>
                                {formData.birthday || "N/A"}
                            </p>
                            <p>
                                <strong>Lifestyle: </strong>
                                {formData.lifestyle}
                            </p>
                        </div>
                        <motion.button
                            {...buttonMotion}
                            onClick={() => alert("Done!")}
                            className="mt-6 px-4 py-2 bg-white text-green-600 font-semibold rounded"
                        >
                            Continue
                        </motion.button>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (

        <div
            className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gray-100 p-4 z-48"
        >
            <Confetti
                width={width}
                height={height}
            />
            {/* Back button on steps 1..4 */}
            {step > 0 && step < 5 && (
                <motion.button
                    {...buttonMotion}
                    onClick={handleBack}
                    className="absolute top-4 left-4 flex items-center gap-1 px-3 py-2 rounded text-green-500 hover:bg-green-100 transition-colors">
                    <FaArrowLeft className="text-green-500" />
                    <span className="font-medium">Back</span>
                </motion.button>
            )}

            <div className="w-full max-w-md">
                <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
            </div>
        </div>
    );
};

export default PersonalInfoPage;
