'use client';

import { useEffect, useState } from 'react';
import Feed from './components/Feed/Feed';

const images = [
  '/images/slide1.jpg',
  '/images/slide2.jpg',
  '/images/slide3.jpg',
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      {/* Slideshow */}
      <div className="relative w-full max-w-3xl h-80 overflow-hidden rounded-2xl shadow-lg mb-8">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Naslov */}
      <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Connexta</h1>
      <p className="text-lg text-gray-700 mb-8">
        Connect with friends and the world around you
      </p>

      {/* Feed */}
      <div className="w-full max-w-3xl">
        <Feed />
      </div>
    </div>
  );
}

