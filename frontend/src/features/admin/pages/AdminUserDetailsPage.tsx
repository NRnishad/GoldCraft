import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { adminUserApi } from "../api/adminUserApi";
import type { AdminUser, AdminUserRole } from "../types/adminUserTypes";

import "./AdminPages.css";

export function AdminUserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<AdminUserRole>("jeweller");

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (!userId) {
        setErrorMessage("User ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await adminUserApi.getUserDetails(userId);
        const loadedUser = response.data.data.user;

        setUser(loadedUser);
        setSelectedRole(loadedUser.role);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [userId]);

  function handleRoleChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedRole(event.target.value as AdminUserRole);
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleToggleStatus() {
    if (!userId || !user) return;

    const nextStatus = !user.isActive;

    try {
      setIsUpdatingStatus(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const response = await adminUserApi.updateUserStatus(userId, {
        isActive: nextStatus,
      });

      const updatedUser = response.data.data.user;

      setUser(updatedUser);
      setSelectedRole(updatedUser.role);

      setSuccessMessage(
        updatedUser.isActive
          ? "User has been unblocked successfully."
          : "User has been blocked successfully."
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleUpdateRole() {
    if (!userId || !user) return;

    if (selectedRole === user.role) {
      setErrorMessage("Select a different role before saving.");
      return;
    }

    try {
      setIsUpdatingRole(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const response = await adminUserApi.updateUserRole(userId, {
        role: selectedRole,
      });

      const updatedUser = response.data.data.user;

      setUser(updatedUser);
      setSelectedRole(updatedUser.role);

      setSuccessMessage("User role updated successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsUpdatingRole(false);
    }
  }

  if (isLoading) {
    return <p className="admin-loading">Loading user details...</p>;
  }

  if (!user) {
    return (
      <section className="admin-page">
        <div className="admin-page__header">
          <div>
            <p className="admin-page__eyebrow">User details</p>
            <h1>User not found</h1>
            <p>{errorMessage || "This user could not be loaded."}</p>
          </div>
        </div>

        <Link to="/admin/users" className="admin-button admin-button--primary">
          Back to users
        </Link>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">User details</p>

          <h1>{user.name}</h1>

          <p>
            Review this user account, block or unblock access, and update their
            role if required.
          </p>
        </div>

        <Link to="/admin/users" className="admin-button admin-button--secondary">
          Back to users
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-card__body">
          {errorMessage && (
            <div className="admin-message admin-message--error" role="alert">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="admin-message admin-message--success" role="status">
              {successMessage}
            </div>
          )}

          <div className="admin-details-grid">
            <DetailBox label="Name" value={user.name} />
            <DetailBox label="Email" value={user.email} />
            <DetailBox label="Role" value={user.role} />
            <DetailBox
              label="Status"
              value={user.isActive ? "Active" : "Blocked"}
            />
            <DetailBox
              label="Email verified"
              value={user.isEmailVerified ? "Verified" : "Unverified"}
            />
            <DetailBox label="Created" value={formatDate(user.createdAt)} />
            <DetailBox label="Updated" value={formatDate(user.updatedAt)} />
            <DetailBox label="User ID" value={user.id} />
          </div>

          <div className="admin-details-actions">
            <div className="admin-action-panel">
              <h2>{user.isActive ? "Block user" : "Unblock user"}</h2>

              <p>
                {user.isActive
                  ? "Blocking this user prevents them from using GoldCraft."
                  : "Unblocking this user restores access to GoldCraft."}
              </p>

              <button
                type="button"
                className={
                  user.isActive
                    ? "admin-button admin-button--danger"
                    : "admin-button admin-button--primary"
                }
                onClick={handleToggleStatus}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus
                  ? "Updating status..."
                  : user.isActive
                    ? "Block user"
                    : "Unblock user"}
              </button>
            </div>

            <div className="admin-action-panel">
              <h2>Change role</h2>

              <p>
                Change this account between jeweller and admin. Backend rules
                prevent demoting the last active admin or changing your own role.
              </p>

              <div className="admin-actions">
                <label className="admin-field" htmlFor="role">
                  <span>Role</span>

                  <select
                    id="role"
                    name="role"
                    value={selectedRole}
                    onChange={handleRoleChange}
                  >
                    <option value="jeweller">Jeweller</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>

                <button
                  type="button"
                  className="admin-button admin-button--primary"
                  onClick={handleUpdateRole}
                  disabled={isUpdatingRole || selectedRole === user.role}
                >
                  {isUpdatingRole ? "Saving role..." : "Save role"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-detail-box">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
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