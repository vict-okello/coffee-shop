import React from "react";
import { Link, NavLink } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { BsCart3 } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useCart } from "../Context/CardContext";

function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { cartCount } = useCart();

  const links = [
    { name: "Home", to: "/" },
    { name: "Menu", to: "/menu" },
    { name: "Product", to: "/product" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md w-full bg-[#7C573C]">
      <nav className="max-w-12xl mx-auto flex justify-between items-center px-6 py-4">
        
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

          {/* Cart Icon with Badge */}
          <div className="relative">
            <BsCart3
              size={28}
              className="text-black hover:text-white cursor-pointer transition-colors"
            />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
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

          {/* Mobile Icons */}
          <div className="flex items-center gap-6 mt-6">
            <CiUser
              size={28}
              className="text-[#FFF8E8] hover:text-white cursor-pointer transition-colors"
            />

            <div className="relative">
              <BsCart3
                size={28}
                className="text-[#FFF8E8] hover:text-white cursor-pointer transition-colors"
              />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
