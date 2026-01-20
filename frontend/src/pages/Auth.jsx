import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import authphoto from "../assets/authphoto.png";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const BRAND = "#7C573C";

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const isLogin = mode === "login";

  const [showPw, setShowPw] = useState(false);

  const [fullName, setFullName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const Eye = ({ open }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-70">
      {open ? (
        <>
          <path
            d="M2 12C3.6 7.8 7.4 5 12 5C16.6 5 20.4 7.8 22 12C20.4 16.2 16.6 19 12 19C7.4 19 3.6 16.2 2 12Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 15C10.343 15 9 13.657 9 12C9 10.343 10.343 9 12 9C13.657 9 15 10.343 15 12C15 13.657 13.657 15 12 15Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M2 12C3.6 7.8 7.4 5 12 5C14.1 5 16 5.6 17.6 6.6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M22 12C20.4 16.2 16.6 19 12 19C9.9 19 8 18.4 6.4 17.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10.5 10.5C10.1 10.9 9.9 11.4 9.9 12C9.9 13.2 10.8 14.1 12 14.1C12.6 14.1 13.1 13.9 13.5 13.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // (connect backend later)
    console.log(isLogin ? "LOGIN" : "SIGNUP", {
      fullName,
      emailOrPhone,
      password,
    });
  };

  const panel = {
    hidden: { opacity: 0, x: 35 },
    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  const img = {
    hidden: { opacity: 0, x: -35, scale: 1.02 },
    show: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.65, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3]">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5">
        {/* LEFT IMAGE */}
        <motion.div
          variants={img}
          initial="hidden"
          animate="show"
          className="hidden lg:block lg:col-span-3 relative overflow-hidden"
        >
          <img src={authphoto} alt="Auth background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute bottom-10 left-10 text-white max-w-md">
            <p className="text-white/80 text-sm tracking-wide">Elzacoffee</p>
            <h2 className="text-4xl font-semibold mt-2 leading-tight">
              Brewed for your best moments.
            </h2>
            <p className="text-white/80 mt-3">
              Sign in to save favourites, manage orders, and checkout faster.
            </p>
          </div>
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          variants={panel}
          initial="hidden"
          animate="show"
          className="col-span-1 lg:col-span-2 flex items-center justify-center px-6 py-12"
        >
          <div className="w-full max-w-md">
            {/* brand row */}
            <div className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-2xl grid place-items-center text-white font-bold shadow-sm"
                style={{ backgroundColor: BRAND }}
              >
                EC
              </div>
              <div>
                <div className="font-semibold text-gray-900">Elzacoffee</div>
                <div className="text-xs text-gray-500">Welcome back</div>
              </div>
              <div className="ml-auto">
                <NavLink to="/" className="text-sm text-gray-600 hover:underline">
                  Home
                </NavLink>
              </div>
            </div>

            {/* card */}
            <div className="mt-8 bg-white/80 backdrop-blur border border-gray-200 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-7">
              {/* top tabs */}
              <div className="grid grid-cols-2 bg-black/5 rounded-2xl p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="py-2 rounded-xl text-sm font-semibold transition"
                  style={{
                    backgroundColor: isLogin ? BRAND : "transparent",
                    color: isLogin ? "white" : "#374151",
                  }}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className="py-2 rounded-xl text-sm font-semibold transition"
                  style={{
                    backgroundColor: !isLogin ? BRAND : "transparent",
                    color: !isLogin ? "white" : "#374151",
                  }}
                >
                  Sign Up
                </button>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mt-6">
                {isLogin ? "Sign in" : "Create account"}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                {isLogin
                  ? "Welcome back — let’s get you in."
                  : "Create an account to save favourites and checkout faster."}
              </p>

              {error && (
                <div className="mt-4 text-sm rounded-xl px-4 py-3 bg-red-50 text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <AnimatePresence mode="wait" initial={false}>
                  {!isLogin && (
                    <motion.div
                      key="fullname"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <label className="text-xs text-gray-500">Full name</label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="mt-2 w-full rounded-xl bg-gray-100 px-4 py-3 outline-none border border-transparent focus:bg-white"
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="text-xs text-gray-500">Email or phone</label>
                  <input
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Email or phone"
                    className="mt-2 w-full rounded-xl bg-gray-100 px-4 py-3 outline-none border border-transparent focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">Password</label>
                  <div className="mt-2 flex items-center rounded-xl bg-gray-100 px-4 py-3 border border-transparent focus-within:bg-white">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPw ? "text" : "password"}
                      placeholder="Enter password"
                      className="flex-1 bg-transparent outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="text-gray-600 hover:text-gray-900"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      <Eye open={showPw} />
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  {!isLogin && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <label className="text-xs text-gray-500">Confirm password</label>
                      <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type={showPw ? "text" : "password"}
                        placeholder="Confirm password"
                        className="mt-2 w-full rounded-xl bg-gray-100 px-4 py-3 outline-none border border-transparent focus:bg-white"
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Forgot link (only on login) */}
                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm font-semibold hover:opacity-80"
                      style={{ color: BRAND }}
                      onClick={() => setError("Forgot password flow coming soon.")}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full py-3 rounded-xl text-white font-semibold transition hover:opacity-90"
                  style={{ backgroundColor: BRAND }}
                >
                  {isLogin ? "Login" : "Create account"}
                </motion.button>

                <p className="text-sm text-gray-600 text-center mt-3">
                  {isLogin ? "New here?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    className="font-semibold hover:opacity-80"
                    style={{ color: BRAND }}
                    onClick={() => {
                      setMode(isLogin ? "signup" : "login");
                      setError("");
                      setPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    {isLogin ? "Create one" : "Login"}
                  </button>
                </p>
              </form>
            </div>

            {/* small footer */}
            <div className="text-center text-xs text-gray-500 mt-6">
              © {new Date().getFullYear()} Elzacoffee — brewed with love.
            </div>
          </div>
        </motion.div>
      </div>

      {/* Brand focus ring */}
      <style>{`
        input:focus {
          border-color: ${BRAND} !important;
          box-shadow: 0 0 0 3px rgba(124, 87, 60, 0.18) !important;
        }
        .focus-within\\:bg-white:focus-within {
          border-color: ${BRAND} !important;
          box-shadow: 0 0 0 3px rgba(124, 87, 60, 0.18) !important;
        }
      `}</style>
    </div>
  );
}
