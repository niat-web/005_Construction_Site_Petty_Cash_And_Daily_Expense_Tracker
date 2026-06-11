import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getProjectsApi, createProjectApi, updateProjectApi, deleteProjectApi } from '../../api/projectApi';
import type { Project, CreateProjectPayload } from '../../api/projectApi';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await getProjectsApi();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.msg || 'Failed to fetch projects');
  }
});

export const createProject = createAsyncThunk('projects/create', async (payload: CreateProjectPayload, { rejectWithValue }) => {
  try {
    const response = await createProjectApi(payload);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.msg || 'Failed to create project');
  }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, payload }: { id: number; payload: Partial<CreateProjectPayload> }, { rejectWithValue }) => {
  try {
    const response = await updateProjectApi(id, payload);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.msg || 'Failed to update project');
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id: number, { rejectWithValue }) => {
  try {
    await deleteProjectApi(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.msg || 'Failed to delete project');
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.projects.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) {
          state.projects[idx] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
      });
  }
});

export const { clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;
