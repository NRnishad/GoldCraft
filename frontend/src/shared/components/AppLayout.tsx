import { useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutUser } from "../../features/auth/store/authSlice";

import "./AppLayout.css";

interface NavItem {
  label: string;
  to: string;
  roles?: Array<"jeweller" | "admin">;
}

const navItems: NavItem[] = [
  {
  label: "Dashboard",
  to: "/dashboard",
},
  {
    label: "Shop Onboarding",
    to: "/shop/onboarding",
    roles: ["jeweller"],
  },
  {
    label: "Shop Profile",
    to: "/shop/profile",
    roles: ["jeweller"],
  },
  {
    label: "Admin Users",
    to: "/admin/users",
    roles: ["admin"],
  },
  {
    label: "Change Password",
    to: "/change-password",
  },
];

export function AppLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) {
      return true;
    }

    if (!user) {
      return false;
    }

    return item.roles.includes(user.role);
  });

  async function handleLogout() {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="app-shell">
      <aside
        className={
          isMobileMenuOpen
            ? "app-shell__sidebar app-shell__sidebar--open"
            : "app-shell__sidebar"
        }
      >
        <div className="app-shell__sidebar-header">
          <Link to="/dashboard" className="app-shell__brand" onClick={closeMobileMenu}>
            <span className="app-shell__brand-mark">G</span>

            <span>
              <strong>GoldCraft</strong>
              <small>Dashboard</small>
            </span>
          </Link>

          <button
            type="button"
            className="app-shell__mobile-close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="app-shell__nav" aria-label="Dashboard navigation">
          {visibleNavItems.map((item) => (
            <DashboardNavLink
              key={item.to}
              to={item.to}
              onClick={closeMobileMenu}
            >
              {item.label}
            </DashboardNavLink>
          ))}
        </nav>

        <div className="app-shell__sidebar-footer">
          {user && (
            <div className="app-shell__user-card">
              <div className="app-shell__user-avatar" aria-hidden="true">
                {getInitial(user.name || user.email)}
              </div>

              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <small>{user.role}</small>
              </div>
            </div>
          )}

          <button
            type="button"
            className="app-shell__logout-button"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <button
          type="button"
          className="app-shell__overlay"
          onClick={closeMobileMenu}
          aria-label="Close menu overlay"
        />
      )}

      <div className="app-shell__content">
        <header className="app-shell__topbar">
          <button
            type="button"
            className="app-shell__menu-button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div>
            <p className="app-shell__topbar-eyebrow">GoldCraft workspace</p>
            <h1>Dashboard</h1>
          </div>

          {user && (
            <div className="app-shell__topbar-user">
              <span>{user.email}</span>
              <strong>{user.role}</strong>
            </div>
          )}
        </header>

        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function DashboardNavLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={to === "/"}
      className={({ isActive }) =>
        isActive ? "app-shell__nav-link app-shell__nav-link--active" : "app-shell__nav-link"
      }
    >
      {children}
    </NavLink>
  );
}

function getInitial(value: string): string {
  return value.trim().charAt(0).toUpperCase() || "G";
}