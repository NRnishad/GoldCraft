import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { authApi } from "../api/authApi";
import type { AuthUser, LoginInput, RegisterInput } from "../types/authTypes";
import { tokenStorage } from "../../../shared/utils/tokenStorage";

interface AuthState {
  user: AuthUser | null;
  registeredEmail: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  registeredEmail: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

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

  return "Something went wrong";
}

export const registerUser = createAsyncThunk<
  AuthUser,
  RegisterInput,
  { rejectValue: string }
>("auth/registerUser", async (input, thunkApi) => {
  try {
    const response = await authApi.register(input);

    return response.data.data.user;
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const loginUser = createAsyncThunk<
  AuthUser,
  LoginInput,
  { rejectValue: string }
>("auth/loginUser", async (input, thunkApi) => {
  try {
    const response = await authApi.login(input);

    const { user, accessToken, refreshToken } = response.data.data;

    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);

    return user;
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const loadCurrentUser = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>("auth/loadCurrentUser", async (_, thunkApi) => {
  try {
    const response = await authApi.getMe();

    return response.data.data.user;
  } catch (error) {
    tokenStorage.clearTokens();

    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, thunkApi) => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();

      if (refreshToken) {
        await authApi.logout(refreshToken);
      }

      tokenStorage.clearTokens();
    } catch (error) {
      tokenStorage.clearTokens();

      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },

    forceLogout(state) {
      tokenStorage.clearTokens();

      state.user = null;
      state.registeredEmail = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = null;
        state.registeredEmail = action.payload.email;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.user = null;
        state.registeredEmail = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload || "Register failed";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      })

      // Load current user
      .addCase(loadCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.registeredEmail = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.registeredEmail = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload || null;
      });
  },
});

export const { clearAuthError, forceLogout } = authSlice.actions;

export default authSlice.reducer;