import AddMovementPage from "./pages/addmovement";
import MovementsPage from "./pages/movements";
import { BrowserRouter, Routes, Route } from "react-router";
import VaultsPage from "./pages/vaults";
import StoresPage from "./pages/stores";
import AdminDashboardPage from "./pages/admin/dashboard";
import CreateStorePage from "./pages/admin/createStore";
import CreateVaultPage from "./pages/admin/createVault";

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
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/crear-local" element={<CreateStorePage />} />
        <Route path="/admin/crear-cajilla" element={<CreateVaultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
