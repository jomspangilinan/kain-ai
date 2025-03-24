import { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaShareAlt } from 'react-icons/fa';

const mockImages = [
  'https://www.tastingtable.com/img/gallery/14-popular-filipino-foods-you-have-to-try-at-least-once/pinakbet-1725652895.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEakWFxHDJNxVGYbWaUVNng_m6gssYaK_jMQ&s',
  'https://images.yummy.ph/yummy/uploads/2014/09/yummy_buqo_flashbox-1-1.jpg',
  'https://filipinoeggrolls.com/wp-content/uploads/2023/03/freshly-cooked-filipino-food-called-crispy-pata.jpg',
];

export default function ShareJourney() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Simulate video playback
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % mockImages.length);
      }, 1000); // Change frame every 1 second
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleShare = () => {
    alert('AI-generated video shared!');
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h2 className="text-4xl font-bold text-blue-600 text-center mb-6">🎥 Share Journey</h2>
      <p className="text-gray-700 text-center mb-6">
        Share your progress with an AI-generated video reel of your meals and achievements.
      </p>

      {/* Video Preview Section */}
      <div className="mb-6 relative">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
          {/* Display Current Frame */}
          <img
            src={mockImages[currentFrame]}
            alt={`Frame ${currentFrame + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Play/Pause Button */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <FaPause className="text-white text-6xl transition-transform duration-300 hover:scale-125" />
            ) : (
              <FaPlay className="text-white text-6xl transition-transform duration-300 hover:scale-125" />
            )}
          </div>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {mockImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Meal ${index + 1}`}
            className={`rounded-lg shadow-md transition-transform duration-200 ${
              index === currentFrame ? 'scale-105 border-4 border-blue-500' : 'hover:scale-105'
            }`}
          />
        ))}
      </div>

      {/* Share Button */}
      <div className="text-center">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
          onClick={handleShare}
        >
          <FaShareAlt className="text-lg" />
          Share Video
        </button>
      </div>
    </div>
  );
}