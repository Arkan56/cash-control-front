import AddMovementPage from "./pages/addmovement";
import MovementsPage from "./pages/movements";
import { BrowserRouter, Routes, Route } from "react-router";
import VaultsPage from "./pages/vaults";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MovementsPage />} />
        <Route path="/añadir-movimiento" element={<AddMovementPage />}></Route>
        <Route path="/cajillas" element={<VaultsPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
