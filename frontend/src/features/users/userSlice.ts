import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsersApi, createPMApi, createSupervisorApi, updateUserApi, deleteUserApi } from '../../api/userApi';
import type { User, CreatePMUserPayload, CreateSupervisorUserPayload } from '../../api/userApi';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await getUsersApi();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.msg || 'Failed to fetch users');
  }
});

export const createPM = createAsyncThunk('users/createPM', async (payload: CreatePMUserPayload, { rejectWithValue }) => {
  try {
    const response = await createPMApi(payload);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.msg || 'Failed to create Project Manager');
  }
});

export const createSupervisor = createAsyncThunk('users/createSupervisor', async (payload: CreateSupervisorUserPayload, { rejectWithValue }) => {
  try {
    const response = await createSupervisorApi(payload);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.msg || 'Failed to create Supervisor');
  }
});

export const updateUser = createAsyncThunk('users/update', async ({ id, payload }: { id: number; payload: Partial<User & { password?: string }> }, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(id, payload);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.msg || 'Failed to update user');
  }
});

export const deleteUser = createAsyncThunk('users/delete', async (id: number, { rejectWithValue }) => {
  try {
    await deleteUserApi(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.msg || 'Failed to delete user');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPM.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(createSupervisor.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) {
          state.users[idx] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  }
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
