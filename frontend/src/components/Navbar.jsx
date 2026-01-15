import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { BsCart3 } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useCart } from "../Context/CartContext";

function Navbar() {
  const [open, setOpen] = useState(false); // mobile menu
  const [showCart, setShowCart] = useState(false); // mini-cart dropdown

  const { cart, cartCount, increaseQty, decreaseQty, removeFromCart } = useCart();

  const links = [
    { name: "Home", to: "/" },
    { name: "Menu", to: "/menu" },
    { name: "Product", to: "/product" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md w-full bg-[#7C573C]">
      <nav className="max-w-12xl mx-auto flex justify-between items-center px-6 py-4 relative">
        
        {/* Logo */}
        <Link to="/">
          <img
            src="/elizalogo.png"
            alt="logo"
            className="w-12 h-12 rounded-full"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "text-lg font-bold text-[#FFF8E8] relative after:block after:h-[2px] after:bg-white after:w-full after:absolute after:left-0 after:-bottom-1"
                  : "text-lg text-black hover:text-white transition-colors"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-4">
          <CiUser
            size={28}
            className="text-black hover:text-white cursor-pointer transition-colors"
          />

          {/* Cart with badge */}
          <div className="relative">
            <BsCart3
              size={28}
              className="text-black hover:text-white cursor-pointer transition-colors"
              onClick={() => setShowCart(!showCart)}
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}

            {/* Mini Cart Dropdown */}
            {showCart && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg p-4 z-50 rounded-lg">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center">Your cart is empty 🛒</p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b py-2">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Rs {item.price} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="px-2 py-1 border rounded"
                          >
                            -
                          </button>
                          <span>{item.qty}</span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="px-2 py-1 border rounded"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 px-2 py-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="mt-2 font-bold text-right">
                      Total: Rs {cart.reduce((sum, item) => sum + item.price * item.qty, 0)}
                    </div>

                    {/* Checkout Button */}
                    <div className="mt-4 text-center">
                      <Link
                        to="/cart"
                        className="bg-[#C18A55] text-white px-4 py-2 rounded hover:opacity-90"
                        onClick={() => setShowCart(false)}
                      >
                        Checkout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <IoClose /> : <GiHamburgerMenu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col items-center gap-8 bg-[#7C573C] px-6 py-6">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              onClick={() => setOpen(false)}
              className="text-lg text-[#FFF8E8]"
            >
              {link.name}
            </NavLink>
          ))}

          <div className="flex items-center gap-6 mt-6">
            <CiUser size={28} className="text-[#FFF8E8]" />

            {/* Mobile Cart */}
            <div className="relative">
              <BsCart3
                size={28}
                className="text-[#FFF8E8]"
                onClick={() => setShowCart(!showCart)}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}

              {showCart && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg p-4 z-50 rounded-lg">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center">Your cart is empty 🛒</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border-b py-2">
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600">Rs {item.price} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              className="px-2 py-1 border rounded"
                            >
                              -
                            </button>
                            <span>{item.qty}</span>
                            <button
                              onClick={() => increaseQty(item.id)}
                              className="px-2 py-1 border rounded"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 px-2 py-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="mt-2 font-bold text-right">
                        Total: Rs {cart.reduce((sum, item) => sum + item.price * item.qty, 0)}
                      </div>

                      <div className="mt-4 text-center">
                        <Link
                          to="/checkout"
                          className="bg-[#C18A55] text-white px-4 py-2 rounded hover:opacity-90"
                          onClick={() => setShowCart(false)}
                        >
                          Checkout
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
