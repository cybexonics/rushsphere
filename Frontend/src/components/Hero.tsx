import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    src: '/1.jpeg',
    alt: 'Shop the latest gadgets',
  },
  {
    id: 2,
    src: '/2.jpeg',
    alt: 'Discover fashion deals',
  },
  {
    id: 3,
    src: '/3.jpeg',
    alt: 'Home essentials at your door',
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const length = banners.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + length) % length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[450px] overflow-hidden bg-black">
      {/* Slide Images */}
      {banners.map((banner, index) => (
        <img
          key={banner.id}
          src={banner.src}
          alt={banner.alt}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start px-6 sm:px-16 z-20">
       
      </div>

      {/* Prev / Next Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full z-30"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full z-30"
      >
        <ChevronRight size={24} />
      </button>

      {/* Tracker Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {banners.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              idx === current ? 'bg-yellow-400' : 'bg-white/50'
            }`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;

