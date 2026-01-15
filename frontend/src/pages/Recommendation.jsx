import { ShoppingCart, ChevronLeft, ChevronRight, Info } from "lucide-react";
import coffeeblue from "../assets/coffeeblue.png";
import coffeegreen from "../assets/coffeegreen.png";
import coffeebrown from "../assets/coffeebrown.png";
import { useCart } from "../Context/CartContext";

const products = [
  {
    id: 1,
    name: "Arabica",
    roast: "Dark Roast",
    image: coffeeblue,
  },
  {
    id: 2,
    name: "House Blend",
    roast: "Dark Roast",
    image: coffeebrown,
  },
  {
    id: 3,
    name: "Robusta",
    roast: "Dark Roast",
    image: coffeegreen,
  },
];

export default function Recommended() {
  const { addToCart } = useCart();

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1b0f0f] to-[#120a0a]">
      <div className="max-w-6xl w-full px-6">
        
        {/* Title */}
        <h2 className="text-center text-4xl font-semibold text-[#f5e6d3] mb-12 font-[cursive]">
          Recommended
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative bg-[#5a3a2a] rounded-3xl p-6 flex flex-col items-center shadow-lg"
            >
              {/* Info icon */}
              <Info className="absolute top-4 left-4 text-[#e6d3bd] w-5 h-5 opacity-70" />

              {/* Product image */}
              <img
                src={product.image}
                alt={product.name}
                className="h-52 object-contain mb-6"
              />

              {/* Cart icon (FUNCTIONAL) */}
              <button
                onClick={() => addToCart(product)}
                className="absolute bottom-6 right-6 text-[#e6d3bd] hover:scale-110 transition"
              >
                <ShoppingCart className="w-6 h-6" />
              </button>

              {/* Text */}
              <div className="mt-auto text-center text-[#f5e6d3]">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm opacity-80">| {product.roast}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <button className="w-10 h-10 rounded-full border border-[#e6d3bd] flex items-center justify-center text-[#e6d3bd] hover:bg-[#e6d3bd] hover:text-[#1b0f0f] transition">
            <ChevronLeft />
          </button>
          <button className="w-10 h-10 rounded-full border border-[#e6d3bd] flex items-center justify-center text-[#e6d3bd] hover:bg-[#e6d3bd] hover:text-[#1b0f0f] transition">
            <ChevronRight />
          </button>
        </div>

      </div>
    </section>
  );
}
