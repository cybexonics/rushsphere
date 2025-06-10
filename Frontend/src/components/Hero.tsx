import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    src: '/1.jpeg',
    alt: 'Shop the latest gadgets',
    headline: 'Shop the Latest Gadgets',
    subtext: 'Explore cutting-edge tech at unbeatable prices.',
    link: '/gadgets',
  },
  {
    id: 2,
    src: '/2.jpeg',
    alt: 'Discover fashion deals',
    headline: 'Discover Fashion Deals',
    subtext: 'Stay trendy with the newest styles.',
    link: '/fashion',
  },
  {
    id: 3,
    src: '/3.jpeg',
    alt: 'Home essentials at your door',
    headline: 'Home Essentials Delivered',
    subtext: 'Comfort and convenience in one place.',
    link: '/home',
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const length = banners.length;
  const touchStartX = useRef(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + length) % length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX.current;

    if (Math.abs(diff) > 50) {
      diff > 0 ? prevSlide() : nextSlide();
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Aspect ratio wrapper to keep image fully visible */}
      <div className="w-full aspect-[31/9] relative">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={banner.src}
              alt={banner.alt}
              className="w-full h-full object-contain object-center"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full z-30"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full z-30"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {banners.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              idx === current ? 'bg-yellow-400 scale-125' : 'bg-white/50'
            }`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;

