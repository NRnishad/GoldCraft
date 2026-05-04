import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useAppDispatch } from "./hooks";
import { loadCurrentUser } from "../features/auth/store/authSlice";
import { tokenStorage } from "../shared/utils/tokenStorage";

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = tokenStorage.getAccessToken();

    if (token) {
      dispatch(loadCurrentUser());
    }
  }, [dispatch]);

  return <Outlet />;
}