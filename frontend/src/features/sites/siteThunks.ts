import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllSitesApi,
  getSiteApi,
  createSiteApi,
  updateSiteApi,
  deleteSiteApi,
} from '../../api/siteApi';
import type { CreateSitePayload } from '../../api/siteApi';

export const fetchSitesThunk = createAsyncThunk(
  'sites/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllSitesApi();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch sites');
    }
  }
);

export const fetchSiteThunk = createAsyncThunk(
  'sites/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getSiteApi(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch site');
    }
  }
);

export const createSiteThunk = createAsyncThunk(
  'sites/create',
  async (payload: CreateSitePayload, { rejectWithValue }) => {
    try {
      const response = await createSiteApi(payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to create site');
    }
  }
);

export const updateSiteThunk = createAsyncThunk(
  'sites/update',
  async (
    { id, payload }: { id: number; payload: Partial<CreateSitePayload> },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateSiteApi(id, payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to update site');
    }
  }
);

export const deleteSiteThunk = createAsyncThunk(
  'sites/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteSiteApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to delete site');
    }
  }
);
