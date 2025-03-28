import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

const GoalPage = () => {
    const navigate = useNavigate();

    const goals = [
        "Lose Weight",
        "Maintain Current Weight",
        "Gain Weight",
        "Build Muscle",
        "Something Else",
    ];

    const handleGoalSelection = (goal: string) => {
        console.log(`Selected Goal: ${goal}`);
        // Navigate to the next step or handle the selection
        navigate("/step1"); // Replace with the actual route
    };

    // Animation Variants
    const pageVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50 },
    };

    return (
        <AnimatePresence>
            <motion.div
                className="h-screen w-screen bg-gray-50 flex flex-col"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {/* Header */}
                <div className="flex items-center px-4 py-4 bg-gradient-to-r from-green-400 to-green-600 text-white">
                    <button
                        onClick={() => navigate('/')}
                        className="text-white hover:text-gray-200"
                    >
                        <AiOutlineArrowLeft size={24} />
                    </button>
                    <h1 className="text-center flex-1 font-bold text-lg">
                        Goal & Focus
                    </h1>
                </div>

                {/* Title */}
                <div className="text-center mt-6 px-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        What goal do you plan to achieve?
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                        Select one of the options below to help us personalize your experience.
                    </p>
                </div>

                {/* Goal Options */}
                <div className="flex flex-col gap-4 mt-8 px-6 flex-grow">
                    {goals.map((goal, index) => (
                        <motion.button
                            key={index}
                            onClick={() => handleGoalSelection(goal)}
                            className="w-full bg-white text-gray-800 font-medium py-4 rounded-lg shadow-md hover:bg-green-100 hover:shadow-lg transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {goal}
                        </motion.button>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center py-4 text-sm text-gray-500">
                    <p>Take the first step toward your goal today! 🌟</p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GoalPage;