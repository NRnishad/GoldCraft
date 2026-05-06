import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import { adminUserApi } from "../api/adminUserApi";
import type {
  AdminUser,
  AdminUserRole,
  AdminUsersPagination,
  ListAdminUsersParams,
} from "../types/adminUserTypes";

import "./AdminPages.css";

interface FilterState {
  search: string;
  role: AdminUserRole | "";
  isActive: "true" | "false" | "";
  isEmailVerified: "true" | "false" | "";
}

const DEFAULT_LIMIT = 10;

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<AdminUsersPagination>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    role: "",
    isActive: "",
    isEmailVerified: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUsers({
      page: 1
    });
    
  }, []);

  async function loadUsers(options?: { page?: number }) {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const params: ListAdminUsersParams = {
        search: filters.search.trim() || undefined,
        role: filters.role,
        isActive: parseBooleanFilter(filters.isActive),
        isEmailVerified: parseBooleanFilter(filters.isEmailVerified),
        page: options?.page || pagination.page || 1,
        limit: DEFAULT_LIMIT,
      };

      const response = await adminUserApi.listUsers(params);

      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function handleFilterChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
    }));
  }

  async function handleSubmitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadUsers({ page: 1 });
  }

  async function handleClearFilters() {
    setFilters({
      search: "",
      role: "",
      isActive: "",
      isEmailVerified: "",
    });

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await adminUserApi.listUsers({
        page: 1,
        limit: DEFAULT_LIMIT,
      });

      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePreviousPage() {
    if (pagination.page <= 1) return;

    await loadUsers({
      page: pagination.page - 1,
    });
  }

  async function handleNextPage() {
    if (pagination.page >= pagination.totalPages) return;

    await loadUsers({
      page: pagination.page + 1,
    });
  }

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow"></p>

          <h1>Manage GoldCraft users</h1>

         
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__body">
          {errorMessage && (
            <div className="admin-message admin-message--error" role="alert">
              {errorMessage}
            </div>
          )}

          <form className="admin-filters" onSubmit={handleSubmitFilters}>
            <label className="admin-field" htmlFor="search">
              <span>Search</span>

              <input
                id="search"
                name="search"
                type="text"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Name or email"
              />
            </label>

            <label className="admin-field" htmlFor="role">
              <span>Role</span>

              <select
                id="role"
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
              >
                <option value="">All roles</option>
                <option value="jeweller">Jeweller</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="admin-field" htmlFor="isActive">
              <span>Status</span>

              <select
                id="isActive"
                name="isActive"
                value={filters.isActive}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Blocked</option>
              </select>
            </label>

            <label className="admin-field" htmlFor="isEmailVerified">
              <span>Email</span>

              <select
                id="isEmailVerified"
                name="isEmailVerified"
                value={filters.isEmailVerified}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </label>

            <div className="admin-actions">
              <button
                type="submit"
                className="admin-button admin-button--primary"
                disabled={isLoading}
              >
                Apply
              </button>

              <button
                type="button"
                className="admin-button admin-button--secondary"
                onClick={handleClearFilters}
                disabled={isLoading}
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Email</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6}>Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6}>No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-user-cell">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                    </td>

                    <td>
                      <RoleBadge role={user.role} />
                    </td>

                    <td>
                      <StatusBadge isActive={user.isActive} />
                    </td>

                    <td>
                      <EmailBadge isEmailVerified={user.isEmailVerified} />
                    </td>

                    <td>{formatDate(user.createdAt)}</td>

                    <td>
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="admin-button admin-button--secondary"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <p>
            Page {pagination.page} of {pagination.totalPages || 1} ·{" "}
            {pagination.total} users
          </p>

          <div className="admin-actions">
            <button
              type="button"
              className="admin-button admin-button--secondary"
              onClick={handlePreviousPage}
              disabled={isLoading || pagination.page <= 1}
            >
              Previous
            </button>

            <button
              type="button"
              className="admin-button admin-button--secondary"
              onClick={handleNextPage}
              disabled={isLoading || pagination.page >= pagination.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function parseBooleanFilter(value: "true" | "false" | "") {
  if (value === "true") return true;
  if (value === "false") return false;
  return "";
}

function RoleBadge({ role }: { role: AdminUserRole }) {
  return (
    <span
      className={
        role === "admin"
          ? "admin-badge admin-badge--admin"
          : "admin-badge admin-badge--jeweller"
      }
    >
      {role}
    </span>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={
        isActive
          ? "admin-badge admin-badge--active"
          : "admin-badge admin-badge--blocked"
      }
    >
      {isActive ? "Active" : "Blocked"}
    </span>
  );
}

function EmailBadge({ isEmailVerified }: { isEmailVerified: boolean }) {
  return (
    <span
      className={
        isEmailVerified
          ? "admin-badge admin-badge--verified"
          : "admin-badge admin-badge--unverified"
      }
    >
      {isEmailVerified ? "Verified" : "Unverified"}
    </span>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as { message?: string };

    if (data.message) {
      return data.message;
    }
  }

  return "Something went wrong. Please try again.";
}