import type { ReactNode } from "react";

import "./SharedUI.css";

interface PageStateProps {
  title: string;
  message?: string;
  action?: ReactNode;
}

export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return <p className="page-state__loading">{message}</p>;
}

export function PageError({ title, message, action }: PageStateProps) {
  return (
    <div className="page-state">
      <h1>{title}</h1>

      {message && <p>{message}</p>}

      {action && <div className="page-state__action">{action}</div>}
    </div>
  );
}

export function EmptyState({ title, message, action }: PageStateProps) {
  return (
    <div className="page-state">
      <h1>{title}</h1>

      {message && <p>{message}</p>}

      {action && <div className="page-state__action">{action}</div>}
    </div>
  );
}