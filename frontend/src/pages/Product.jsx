import React from "react";
import product1 from "../assets/product1.png";
import product2 from "../assets/product2.png";
import { useCart } from "../Context/CardContext";
import { ShoppingCart, ChevronLeft, ChevronRight, Info } from "lucide-react";


export default function App() {

  const {addToCart} = {useCart}


  return (
    <div className="bg-[#1D1212] text-gray-200 font-[cursive] min-h-screen">

      {/* Top Product */}
      <section className="flex flex-col md:flex-row items-center justify-center p-10 gap-10">
        <div className="text-center">
          <p className="text-sm mb-3">Rs 850 (500 gm)</p>
          <div className="bg-white rounded-xl p-5 mx-auto w-60">
            <img src={product1} alt="Coffee Bag" className="w-full" />
          </div>
        </div>

        <div className="max-w-md">
          <p className="mb-4 leading-relaxed">
            The coffee beans inside the package is half roasted and flavour
            are compact within the beans. It’s a 500 gm package full of happiness.
          </p>
          <button 
          onClick={addToCart}
          className="bg-[#C18A55] px-5 py-2 rounded-md text-black hover:opacity-90">
            Add To Cart
          </button>
        </div>
      </section>

      {/* About Section */}
      <div className="max-w-3xl mx-auto text-center px-5 pb-10 leading-relaxed">
        <p>
          We are a brand that needs recognition among the people and we are in a
          race to compete as future is much nearer than we think.
        </p>
        <p className="mt-4">
          So this is our home product — the name goes with Kaphi G Roasted Bean.
          It is a Nepal-based company that was established in 2016.
        </p>
      </div>

      {/* Bottom Product */}
      <section className="flex flex-col md:flex-row items-center justify-center p-10 gap-10">
        <div className="text-center">
          <p className="text-sm mb-3">Rs 1500 (1 kg)</p>
          <div className="bg-white rounded-xl p-5 mx-auto w-60">
            <img src={product2} alt="Coffee Bags" className="w-full" />
          </div>
        </div>

        <div className="max-w-md">
          <p className="mb-4 leading-relaxed">
            The coffee beans inside the package are fully roasted and the flavour
            is compact within the beans. It’s a 1 kg package full of happiness.
          </p>
          <button className="bg-[#C18A55] px-5 py-2 rounded-md text-black hover:opacity-90">
            Add To Cart
          </button>
        </div>
      </section>
    </div>
  );
}

