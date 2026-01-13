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

        {/* Privacy */}
        <div>
          <h3 className="uppercase tracking-wide font-semibold mb-3 text-sm">Privacy</h3>
          <ul className="space-y-1 text-sm">
            <li>Terms of use</li>
            <li>Privacy policy</li>
            <li>Cookies</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="uppercase tracking-wide font-semibold mb-3 text-sm">Services</h3>
          <ul className="space-y-1 text-sm">
            <li>Shop</li>
            <li>Order ahead</li>
            <li>Menu</li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="uppercase tracking-wide font-semibold mb-3 text-sm">About us</h3>
          <ul className="space-y-1 text-sm">
            <li>Find a location</li>
            <li>About us</li>
            <li>Our story</li>
          </ul>
        </div>

        {/* social media */}
        <div>
            <h3 className="uppercase tracking-wide font-semibold mb-3 text-sm">Social Media</h3>
            <div className="flex items-center gap-4 text-lg">
              <FaXTwitter className="cursor-pointer" />
              <FaInstagram className="cursor-pointer" />
              <FaFacebookF className="cursor-pointer" />
              <FaLinkedinIn className="cursor-pointer" />
            </div>
          </div>
      </div>
      <div className="border-t border-[#3a2f24] mt-6 pt-4 text-center text-xs text-[#BFA88C]">
  © {new Date().getFullYear()} Elza Coffee. All rights reserved.
      </div>

    </footer>
  );
}
