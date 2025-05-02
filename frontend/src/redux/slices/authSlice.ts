import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiServer } from '../../apiconfig';
import { getAxiosErrorData } from '../../utility';

interface UserState {
    isAuthenticated: boolean,
    name: string,
    email: string,
    error: string,
    loading: boolean,
}
const initialState: UserState = {
    isAuthenticated: false,
    name: '',
    email: '',
    error: '',
    loading: false
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { email: string; password: string }, thunkAPI) => {
        try {
            const response = await apiServer.post('/login', credentials);
            return response.data;
        } catch (error: any) {
            // Handle axios error properly
            const data = getAxiosErrorData(error);
            return thunkAPI.rejectWithValue(
                data?.error?.message || 'Login failed'
            );
            // return thunkAPI.rejectWithValue(
            //     error.response?.data?.message || 'Login failed'
            // );
        }
    }
);

const authSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        logout(state, action: PayloadAction<string>) {
            state.isAuthenticated = false;
            state.email = '';
            state.name = '';
            state.error = '';
            state.loading = false;
        }

    },
    extraReducers: (builder) => {
        builder.
            addCase(loginUser.pending, (state) => {
                state.isAuthenticated = false;
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
                state.name = action.payload.name;
                state.email = action.payload.email;
                state.error = '';
                state.loading = false;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Login failed';
            })
    }
})


export const { logout } = authSlice.actions
export default authSlice.reducer;