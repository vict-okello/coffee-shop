import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { BsCart3 } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useCart } from "../Context/CartContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const {
    cart,
    cartCount,
    increaseQty,
    decreaseQty,
    removeFromCart,
    showCart,
    setShowCart,
  } = useCart();

  const links = [
    { name: "Home", to: "/" },
    { name: "Menu", to: "/menu" },
    { name: "Product", to: "/product" },
    { name: "Review", to: "/review" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md w-full bg-[#7C573C]">
      <nav className="max-w-12xl mx-auto flex justify-between items-center px-6 py-4 relative">
        {/* Logo */}
        <NavLink to="/">
          <img
            src="/elizalogo.png"
            alt="logo"
            className="w-12 h-12 rounded-full"
          />
        </NavLink>

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
          <NavLink to="/auth" className="inline-flex">
            <CiUser
              size={28}
              className="text-black hover:text-white cursor-pointer transition-colors"
            />
          </NavLink>

          {/* Cart */}
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

            {/* Mini-cart dropdown */}
            {showCart && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg p-4 z-50 rounded-lg">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center">
                    Your cart is empty 🛒
                  </p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center border-b py-2"
                      >
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            ${item.price} each
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

                    <div className="mt-2 font-bold text-right">
                      Total: $
                      {cart.reduce(
                        (sum, item) => sum + item.price * item.qty,
                        0
                      )}
                    </div>

                    {/* Checkout button */}
                    <div className="mt-4 text-center">
                      <NavLink
                        to="/payment"
                        className="bg-[#C18A55] text-white px-4 py-2 rounded hover:opacity-90 block"
                        onClick={() => setShowCart(false)}
                      >
                        Checkout
                      </NavLink>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <IoClose /> : <GiHamburgerMenu />}
        </button>
      </nav>

      {/*  Mobile dropdown links + auth link */}
      {open && (
        <div className="md:hidden bg-[#7C573C] px-6 pb-4">
          <div className="flex flex-col gap-4 mt-2">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setOpen(false)}
                className="text-white text-lg"
              >
                {link.name}
              </NavLink>
            ))}

            {/*  mobile auth link */}
            <NavLink
              to="/auth"
              onClick={() => setOpen(false)}
              className="text-white text-lg flex items-center gap-2"
            >
              <CiUser size={22} />
              Login / Sign up
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
