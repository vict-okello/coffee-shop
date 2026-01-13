import React from 'react'
import ReserveImg from "../assets/ReserveImg.png"


function Reserve() {
  return (
    <section className=' 
    bg-[#7D5647]
    flex flex-col py-16 px-4 items-center'>

        <h1
        className='mb-12 text-5xl font-bold 
        text-white leading-8 font-serif'

        >Reserve a Table</h1>
       
        {/* wrapper */}
        <div
        className="
        max-w-6xl w-full
        flex flex-col md:flex-row
        items-center justify-between
        gap-10 px-6
        "
        >
            {/* image */}

            <div
            className="
            flex justify-center
            md:justify-start
            w-full md:w-1/2
            "
            
            >
                <img 
                className="
                object-contain
                w-[300px] sm:w-[330px]
                md:w-[400px]
                "
                src={ReserveImg}
                 alt="/ReserveImg" />
                
            </div>

            {/* form */}
            <form
          className="
            bg-transparent
            flex flex-col gap-4
            w-full md:w-1/2
          "
        >
          {/* Date */}
          <input
            type="date"
            className="w-full p-3 rounded-md bg-[#fff] text-black placeholder:text-gray-400 outline-none"
            placeholder="Date"
          />

          {/* Time + Guest */}
          <div className="flex gap-4 w-full">
            <input
              type="time"
              className="w-1/2 p-3 rounded-md bg-white text-black outline-none"
              placeholder="Time"
            />
            <select
              className="w-1/2 p-3 rounded-md bg-white text-black outline-none"
            >
              <option>Guest</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5+</option>
            </select>
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="your name"
            className="w-full p-3 rounded-md bg-white text-black outline-none"
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="your phone"
            className="w-full p-3 rounded-md bg-white text-black outline-none"
          />

          {/* Email + Button */}
          <div className="flex gap-4 w-full">
            <input
              type="email"
              placeholder="your email"
              className="w-3/4 p-3 rounded-md bg-white text-black outline-none"
            />
            <button
              className="w-1/4 bg-transparent border border-[#D6C1A7] text-[#D6C1A7] rounded-full hover:bg-[#D6C1A7] hover:text-[#4b2f23] transition font-medium"
            >
              Reserve
            </button>
          </div>
        </form>

        </div>

    </section>
  )
}

export default Reserve
