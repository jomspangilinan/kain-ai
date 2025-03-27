import { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FaVideo, FaSpinner } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const SharePage = () => {
    const [videoDetails, setVideoDetails] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handleGenerateVideo = async () => {
        if (!videoDetails.trim()) return;

        setIsGenerating(true);
        setVideoUrl(null);

        // Simulate AI video generation
        setTimeout(() => {
            setVideoUrl('https://example.com/generated-video.mp4'); // Replace with actual video URL
            setIsGenerating(false);
        }, 3000);
    };

    return (
        <div className="max-w-md mx-auto py-6 px-4">
            {/* Close Button */}
            <NavLink to="/">
                <div className="absolute top-8 right-6 text-white hover:text-green-700">
                    <AiFillCloseCircle size={24} />
                </div>
            </NavLink>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-6 shadow-md text-center">
                <FaVideo className="text-4xl mx-auto mb-2" />
                <h2 className="text-2xl font-bold">Generate a Shareable Video</h2>
                <p className="text-sm mt-2">Create a video summary of your progress and share it with friends!</p>
            </div>

            {/* Input Section */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                <textarea
                    value={videoDetails}
                    onChange={(e) => setVideoDetails(e.target.value)}
                    placeholder="Describe your progress or achievements..."
                    className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none mb-4"
                    rows={4}
                />
                <button
                    onClick={handleGenerateVideo}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <div className="flex items-center justify-center gap-2">
                            <FaSpinner className="animate-spin" />
                            Generating...
                        </div>
                    ) : (
                        'Generate Video'
                    )}
                </button>
            </div>

            {/* Video Preview */}
            {videoUrl && (
                <div className="mt-6 bg-gray-100 rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Your Video</h3>
                    <video controls className="w-full rounded-lg">
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </div>
    );
};

export default SharePage;