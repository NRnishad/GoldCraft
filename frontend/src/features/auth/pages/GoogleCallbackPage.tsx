import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { loadCurrentUser } from "../store/authSlice";
import { tokenStorage } from "../../../shared/utils/tokenStorage";

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userStr = searchParams.get("user");

    if (accessToken && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(refreshToken);
        
        // Load the full user state into Redux
        dispatch(loadCurrentUser()).unwrap().then((loadedUser) => {
          if (loadedUser.role === "jeweller") {
             navigate("/shop/onboarding", { replace: true });
          } else {
             navigate("/", { replace: true });
          }
        }).catch(() => {
          navigate("/login?error=Failed to load user profile", { replace: true });
        });
      } catch (error) {
        navigate("/login?error=Invalid user data received", { replace: true });
      }
    } else {
      navigate("/login?error=Google login failed", { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>Completing Google Sign In...</p>
    </div>
  );
}