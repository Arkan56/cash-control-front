import AddMovementPage from "./pages/addmovement";
import MovementsPage from "./pages/movements";
import { BrowserRouter, Routes, Route } from "react-router";
import VaultsPage from "./pages/vaults";
import StoresPage from "./pages/stores";
import AdminDashboardPage from "./pages/admin/dashboard";
import CreateStorePage from "./pages/admin/createStore";
import CreateVaultPage from "./pages/admin/createVault";
import LoginPage from "./pages/auth/login";
import { RequireRol } from "./components/requireRol";
import CreateUserPage from "./pages/admin/createUser";

const ADMIN_ROL = 1;
const WORKER_ROL = 2;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/movimientos/:vaultId"
          element={
            <RequireRol rolesPermitidos={[ADMIN_ROL, WORKER_ROL]}>
              <MovementsPage />
            </RequireRol>
          }
        />

        <Route
          path="/añadir-movimiento/:vaultId"
          element={
            <RequireRol rolesPermitidos={[ADMIN_ROL, WORKER_ROL]}>
              <AddMovementPage />
            </RequireRol>
          }
        />

        <Route
          path="/cajillas/:storeId"
          element={
            <RequireRol rolesPermitidos={[ADMIN_ROL, WORKER_ROL]}>
              <VaultsPage />
            </RequireRol>
          }
        />

        <Route
          path="/tiendas"
          element={
            <RequireRol rolesPermitidos={[ADMIN_ROL, WORKER_ROL]}>
              <StoresPage />
            </RequireRol>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireRol rolesPermitidos={[ADMIN_ROL]}>
              <AdminDashboardPage />
            </RequireRol>
          }
        />

        <Route
          path="/admin/crear-local"
          element={
            <RequireRol rolesPermitidos={[ADMIN_ROL]}>
              <CreateStorePage />
            </RequireRol>
          }
        />

        <Route
          path="/admin/crear-cajilla"
          element={
            <RequireRol rolesPermitidos={[ADMIN_ROL]}>
              <CreateVaultPage />
            </RequireRol>
          }
        />

        <Route
          path="/admin/crear-usuario"
          element={
            <RequireRol rolesPermitidos={[ADMIN_ROL]}>
              <CreateUserPage />
            </RequireRol>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
8;
