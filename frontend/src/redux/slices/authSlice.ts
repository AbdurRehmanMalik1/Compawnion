import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiServer } from '../../apiconfig';
import { AxiosError } from 'axios';
import { getAxiosErrorData } from '../../utility';

interface UserState {
    name: string,
    email: string,
}
const initialState: UserState = {
    name: '',
    email: '',
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
                data?.error || 'Login failed'
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
            
        }

    }
})


export const { logout } = authSlice.actions
export default authSlice.reducer;