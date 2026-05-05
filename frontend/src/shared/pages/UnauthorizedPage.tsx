import { Link } from "react-router-dom";

import "./PageStyles.css";

export function UnauthorizedPage() {
  return (
    <main className="simple-page">
      <section className="simple-page__card">
        <p className="simple-page__eyebrow">Access denied</p>

        <h1>You do not have permission to view this page.</h1>

        <p>
          This area is protected by role. If you believe this is a mistake, sign
          in with the correct account.
        </p>

        <div className="simple-page__actions">
          <Link to="/dashboard" className="simple-page__button simple-page__button--primary">
  Go to dashboard
</Link>

          <Link to="/login" className="simple-page__button simple-page__button--secondary">
            Sign in again
          </Link>
        </div>
      </section>
    </main>
  );
}