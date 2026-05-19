import AddMovementPage from "./pages/addmovement";
import MovementsPage from "./pages/movements";
import { BrowserRouter, Routes, Route } from "react-router";
import VaultsPage from "./pages/vaults";
import StoresPage from "./pages/stores";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/movimientos/:vaultId" element={<MovementsPage />} />
        <Route
          path="/añadir-movimiento/:vaultId"
          element={<AddMovementPage />}
        ></Route>
        <Route path="/cajillas/:storeId" element={<VaultsPage />}></Route>
        <Route path="/tiendas" element={<StoresPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
