import { Link } from "react-router-dom";

import "./PageStyles.css";

export function NotFoundPage() {
  return (
    <main className="simple-page">
      <section className="simple-page__card">
        <p className="simple-page__eyebrow">404</p>

        <h1>Page not found.</h1>

        <p>
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="simple-page__actions">
          <Link to="/" className="simple-page__button simple-page__button--primary">
            Go to home
          </Link>

          <Link to="/login" className="simple-page__button simple-page__button--secondary">
            Go to login
          </Link>
        </div>
      </section>
    </main>
  );
}