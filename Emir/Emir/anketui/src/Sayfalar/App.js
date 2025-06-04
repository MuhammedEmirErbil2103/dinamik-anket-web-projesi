import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login.js";
import Hocalar from "./Hocalar.js";

import Anket from "./Anket.js";
import HocaGrafik from "./HocaGrafik.js";

function App() {
  return (
    <Router>
      <Routes>
        {/* Başlangıç rotası */}
        <Route path="/" element={<Login />} />

        {/* Bilgisayar Mühendisliği Rotası */}
        <Route path="/Hocalar" element={<Hocalar />} />



        {/* Anket Rotası */}
        <Route path="Anket" element={<Anket />} />

        {/* Grafik Rotası (Dinamik Parametre) */}
        <Route path="Grafik/:id" element={<HocaGrafik />} />
      </Routes>
    </Router>
  );
}

export default App;
