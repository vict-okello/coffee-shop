import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Banner from "./Banner";
import Product from "./Product";
import Menu from "./pages/Menu";
import Offer from "./pages/Offer";
import Contact from "./pages/Contact";
import CartPage from "./pages/CartPage";
import Payment from "./pages/Payment";
import { CartProvider } from "./Context/CartContext";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import Review from "./pages/Review";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminProtected from "./components/AdminProtected"; 

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Banner />} />
          <Route path="/product" element={<Product />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/review" element={<Review />} />

          {/* Public */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected */}
          <Route
            path="/admin"
            element={
              <AdminProtected>
                <Admin />
              </AdminProtected>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
