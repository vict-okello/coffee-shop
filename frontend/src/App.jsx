
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

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Banner />} />
          <Route path="/products" element={<Product />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Payment />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
