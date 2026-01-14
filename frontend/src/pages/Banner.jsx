import React from 'react'
import elzacoffee from '../assets/elzacoffee.png'
import Cup1 from '../assets/cup1.png'
import coffeebanner from '../assets/coffeebanner.png'
import beans from '../assets/beans.png'
import { useNavigate } from "react-router-dom";

function Banner() {

  const navigate = useNavigate();

  return (
    <div>
      <section className="w-full min-h-screen bg-[#1D1212] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12">
      
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-6 md:gap-8 max-w-lg text-left">
        <img src={elzacoffee} alt="Logo" className="w-60 sm:w-72 md:w-96" />

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#7C573C] leading-tight">
          Today's good mood is sponsored by coffee
        </h2>

        <p className="text-base sm:text-lg text-[#D6C1A7]">
          Search for your favourite coffee
        </p>

        {/* BUTTONS */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => navigate("/product")}
            className="px-6 py-3 rounded-full border-2 border-[#D6C1A7]
            text-[#D6C1A7] hover:bg-[#D6C1A7] hover:text-[#4A2F23] transition">
            Shop Now
          </button>

          <button
            onClick={() => navigate("/menu")}
            className="px-6 py-3 rounded-full border-2 border-[#D6C1A7]
            text-[#D6C1A7] hover:bg-[#D6C1A7] hover:text-[#4A2F23] transition">
            Catalog
          </button>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
        <img
          src={coffeebanner}
          alt="Coffee Banner"
          className="w-full max-w-md md:max-w-full object-cover"
        />
      </div>

    </section>
    </div>
  )
}

export default Banner
