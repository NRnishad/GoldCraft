import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutUser } from "../../features/auth/store/authSlice";

export function AppLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  async function handleLogout() {
    await dispatch(logoutUser());
    navigate("/login");
  }

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <header
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            textDecoration: "none",
            color: "black",
          }}
        >
          GoldCraft
        </Link>

        <nav style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link to="/shop/onboarding">Shop Onboarding</Link>
          <Link to="/shop/profile">Shop Profile</Link>

          {user?.role === "admin" && <Link to="/admin/users">Admin</Link>}

          {user ? (
            <>
              <span>{user.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main style={{ padding: "24px" }}>
        <Outlet />
      </main>
    </div>
  );
}