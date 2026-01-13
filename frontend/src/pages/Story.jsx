import React, { useState } from 'react';
import ourstory from '../assets/ourstory.png';

function Story() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = [ourstory, ourstory, ourstory];

  return (
    <section className="bg-[#1D1212] flex flex-col items-center py-16 px-4">
      {/* Card */}
      <div
        className="
          bg-[#4f3728]
          max-w-5xl w-full
          h-auto md:h-[220px]
          flex flex-col md:flex-row
          items-center gap-6 md:gap-8
          px-6
          rounded-[12px]
          relative
        "
      >
        {/* Image */}
        <img
          src={slides[activeIndex]}
          alt="story"
          className="
            relative
            -mt-24 sm:-mt-28 md:mt-20
            w-[160px] sm:w-[180px] md:w-[200px]
            h-[300px] sm:h-[360px] md:h-[450px]
            object-cover
          "
        />

        {/* Text */}
        <div className="text-white max-w-xl text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#f8d8b8] mb-4">
            Our Story
          </h2>

          <p className="leading-relaxed text-sm sm:text-base">
            Eliza Is An Online Coffee Store That Offers The Widest Selection Of
            Specialty Coffees And Teas From Around The World...
          </p>

          <a href="#" className="text-[#f8d8b8] underline mt-4 inline-block">
            More
          </a>
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-3 mt-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              activeIndex === index
                ? 'bg-[#f8d8b8] scale-125'
                : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Story;
