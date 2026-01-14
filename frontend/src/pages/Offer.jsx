import React from 'react'
import offerbag from '../assets/offerbag.png'
import { useNavigate } from "react-router-dom";

function Offer() {

  const navigate = useNavigate();

  return ( 

<section className="bg-[#1D1212] flex flex-col px-4 py-16 items-center">
      {/* Card */}
      <div
        className="
        bg-[#4f3728]
        max-w-6xl w-full
        flex flex-col md:flex-row
        items-center justify-between
        px-6 md:px-10 py-8
        rounded-[12px]
        relative overflow-hidden
      "
      >
        {/* Text */}
        <div className="md:w-2/3 space-y-4">
          <h1 className="text-[44px] font-bold text-[#f8d8b8] leading-[52px]">
            Offer
          </h1>

          <p className="text-[28px] text-[#D6C1A7] font-medium">
            Up To 50% Off
          </p>

          <p className="text-[#D6C1A7]">
            At our cafe, we take pride in providing our customers with the best coffee around.
            Our carefully-selected coffees come from some of the most renowned coffee
            growing regions in the world, ensuring that…
          </p>

          <button
            onClick={()=> navigate("/product")}
            className="px-6 py-3 rounded-full border-2 border-[#D6C1A7]
            text-[#D6C1A7] hover:bg-[#D6C1A7] hover:text-[#4A2F23] transition font-medium"
          >
            Shop Now
          </button>
        </div>

        {/* Image */}
        <div className="md:w-1/3 flex justify-center md:justify-end">
          <img
            src={offerbag}
            alt="coffee bags"
            className="w-[160px] sm:w-[200px] md:w-[230px] lg:w-[250px] object-contain"
          />
        </div>
      </div>
    </section>
  )
}

export default Offer
