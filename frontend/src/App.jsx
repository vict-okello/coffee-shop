import { BrowserRouter, Routes, Route } from "react-router-dom";
import Banner from "./Banner";
import Product from "./Product";
import Menu from "./pages/Menu";
import Offer from "./pages/Offer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Banner />} />
        <Route path="/products" element={<Product />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/offer" element={<Offer/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
