import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import footer from "../assets/footer.png";

export default function Footer() {
  return (
    <footer className="bg-[#7C573C] text-[#EDE3D5] py-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">

        {/* Logo / Brand */}
        <div>
          <img
            className="relative h-[200px] -top-10 ml-8"
            src={footer}
            alt="footer art"
          />
        </div>

        {/* Services */}
        <div>
          <h3 className="uppercase tracking-wide font-semibold mb-3 text-sm">Services</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/product" className="hover:underline">Shop</Link>
            </li>
            <li>
              <Link to="/menu" className="hover:underline">Menu</Link>
            </li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="uppercase tracking-wide font-semibold mb-3 text-sm">About us</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/locations" className="hover:underline">Find a location</Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">About us</Link>
            </li>
            <li>
              <Link to="/story" className="hover:underline">Our story</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="uppercase tracking-wide font-semibold mb-3 text-sm">Social Media</h3>
          <div className="flex items-center gap-4 text-lg">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="cursor-pointer hover:text-white" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="cursor-pointer hover:text-white" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="cursor-pointer hover:text-white" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="cursor-pointer hover:text-white" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#3a2f24] mt-6 pt-4 text-center text-xs text-[#BFA88C]">
        © {new Date().getFullYear()} Elza Coffee. All rights reserved.
      </div>
    </footer>
  );
}
