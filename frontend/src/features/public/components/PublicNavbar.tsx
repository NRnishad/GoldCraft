import { Link, NavLink } from "react-router-dom";

import "../pages/PublicPages.css";

export function PublicNavbar() {
  return (
    <header className="public-navbar">
      <Link to="/" className="public-navbar__brand" aria-label="GoldCraft home">
        <span className="public-navbar__brand-mark">G</span>

        <span>
          <strong>GoldCraft</strong>
          <small>AI gold poster studio</small>
        </span>
      </Link>

      <nav className="public-navbar__links" aria-label="Public navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "public-navbar__link public-navbar__link--active"
              : "public-navbar__link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/pricing"
          className={({ isActive }) =>
            isActive
              ? "public-navbar__link public-navbar__link--active"
              : "public-navbar__link"
          }
        >
          Pricing
        </NavLink>
      </nav>

      <div className="public-navbar__actions">
        <Link to="/login" className="public-navbar__login">
          Login
        </Link>

        <Link to="/login" className="public-navbar__cta">
          Try out
        </Link>
      </div>
    </header>
  );
}