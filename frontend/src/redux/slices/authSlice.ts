import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiServerAuth } from "../../apiconfig";
import { getAxiosErrorData } from "../../utility";

interface UserData {
  _id: string;
  name: string;
  email: string;
  avatar: string | undefined;
  isVerified: boolean | string;
  role: string;
}

interface UserState extends UserData {
  isAuthenticated: boolean;
  loading: boolean;
  error: string;
}

const initialState: UserState = {
  _id: "",
  name: "",
  email: "",
  avatar: "",
  isVerified: false,
  role: "",
  isAuthenticated: false,
  loading: false,
  error: "",
};

// ───────────────────────────────────────────────────────────────────────────────
// Async Thunks

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (
    credentials: {
      name: string;
      email: string;
      password: string;
      avatar: string | undefined;
    },
    thunkAPI
  ) => {
    try {
      const response = await apiServerAuth.post("/signup", credentials, {
        withCredentials: true, // Ensure credentials are sent with this request
      });
      return response.data.user;
    } catch (error: any) {
      const data = getAxiosErrorData(error);
      return thunkAPI.rejectWithValue(data?.error?.message || "Signup failed");
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (otp: string, thunkAPI) => {
    try {
      const response = await apiServerAuth.post(
        "/verify",
        { otp },
        {
          withCredentials: true, // Ensure credentials are sent with this request
        }
      );
      return response.data.user;
    } catch (error: any) {
      const data = getAxiosErrorData(error);
      return thunkAPI.rejectWithValue(
        data?.error?.message || "OTP verification failed"
      );
    }
  }
);

export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async (_, thunkAPI) => {
    try {
      await apiServerAuth.post(
        "/resend-verification",
        {},
        {
          withCredentials: true, // Ensure credentials are sent with this request
        }
      );
    } catch (error: any) {
      const data = getAxiosErrorData(error);
      return thunkAPI.rejectWithValue(
        data?.error?.message || "Failed to resend OTP"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await apiServerAuth.post("/login", credentials, {
        withCredentials: true, // Ensure credentials are sent with this request
      });
      return response.data.user;
    } catch (error: any) {
      const data = getAxiosErrorData(error);
      return thunkAPI.rejectWithValue(data?.error?.message || "Login failed");
    }
  }
);

export const autoLogin = createAsyncThunk(
  "auth/autoLogin",
  async (_, thunkAPI) => {
    try {
      const response = await apiServerAuth.get("/me", {
        withCredentials: true,
      });
      console.log({ response });

      return response.data.user;
    } catch (error: any) {
      const data = getAxiosErrorData(error);
      return thunkAPI.rejectWithValue(
        data?.error?.message || "Auto-login failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await apiServerAuth.post(
        "/logout",
        {},
        {
          withCredentials: true, // Ensure credentials are sent with this request
        }
      );
    } catch (error: any) {
      const data = getAxiosErrorData(error);
      return thunkAPI.rejectWithValue(data?.error?.message || "Logout failed");
    }
  }
);

export const registerUserRole = createAsyncThunk(
  "auth/registerUserRole",
  async ({ role, roleData }: { role: string; roleData: any }, thunkAPI) => {
    try {
      const response = await apiServerAuth.post(
        "/register-role",
        { role, roleData },
        {
          withCredentials: true, // Ensure credentials are sent with this request
        }
      );
      return response.data.user;
    } catch (error: any) {
      const data = getAxiosErrorData(error);
      return thunkAPI.rejectWithValue(
        data?.error?.message || "Role registration failed"
      );
    }
  }
);

// ───────────────────────────────────────────────────────────────────────────────
// Slice

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Login ─────────────────────────────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          Object.assign(state, action.payload, {
            isAuthenticated: true,
            loading: false,
            error: "",
          });
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ─── Signup ────────────────────────────────────────────────────────────
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        signupUser.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          Object.assign(state, action.payload, {
            isAuthenticated: true,
            loading: false,
            error: "",
          });
        }
      )
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ─── OTP Verify ───────────────────────────────────────────────────────
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        verifyOTP.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          Object.assign(state, action.payload, {
            isAuthenticated: true,
            loading: false,
            error: "",
          });
        }
      )
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ─── Resend OTP ───────────────────────────────────────────────────────
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ─── Register Role ─────────────────────────────────────────────────────
      .addCase(registerUserRole.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        registerUserRole.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          Object.assign(state, action.payload, {
            isAuthenticated: true,
            loading: false,
            error: "",
          });
        }
      )
      .addCase(registerUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ─── Logout ───────────────────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(autoLogin.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        autoLogin.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          Object.assign(state, action.payload, {
            isAuthenticated: true,
            loading: false,
            error: "",
          });
        }
      )
      .addCase(autoLogin.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false; // ensure logged out if session invalid
        state.error = "";
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
