import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiServer } from '../../apiconfig';
import { getAxiosErrorData } from '../../utility';
import { PetInterface } from '../../types/Pet';

interface FilterOptions {
    ageRange?: [number, number],
    species?: string,
    gender?: string
}
interface AdoptState {
    search: string,
    filters: FilterOptions,
    results: PetInterface[],
    error: string,
    loading: boolean
}
const initialState: AdoptState = {
    search: '',
    filters: {
    },
    results: [],
    error: '',
    loading: false,
}

export const searchPet = createAsyncThunk(
    'adopt/search',
    async (searchFilter: { search: string; filters: FilterOptions }, thunkAPI) => {
        try {
            //assuming search is passed as body for now
            const response = await apiServer.post(`/adopt/search/`, searchFilter);
            return response.data;
        } catch (error: any) {
            // Handle axios error properly
            const data = getAxiosErrorData(error);
            return thunkAPI.rejectWithValue(
                data?.error.message || 'Login failed'
            );
            // return thunkAPI.rejectWithValue(
            //     error.response?.data?.message || 'Login failed'
            // );
        }
    }
);

const adoptSlice = createSlice({
    name: 'adopts',
    initialState: initialState,
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
        },
        setFilter(state, action: PayloadAction<AdoptState>) {
            const payload: AdoptState = action.payload;
            state.filters = payload.filters;
            state.search = payload.search;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(searchPet.pending, (state) => {
                state.loading = true;
                state.error = '';
                // state.results = [];
            })
            .addCase(searchPet.fulfilled, (state, action: PayloadAction<PetInterface[]>) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(searchPet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Something went wrong';
            });
    }
})


export const { setSearch, setFilter } = adoptSlice.actions;
export default  adoptSlice.reducer;