import { createSlice } from '@reduxjs/toolkit';
import type { Site } from '../../api/siteApi';
import { fetchSitesThunk, createSiteThunk, updateSiteThunk, deleteSiteThunk, fetchSiteThunk } from './siteThunks';

interface SiteState {
  sites: Site[];
  currentSite: Site | null;
  loading: boolean;
  error: string | null;
}

const initialState: SiteState = {
  sites: [],
  currentSite: null,
  loading: false,
  error: null,
};

const siteSlice = createSlice({
  name: 'sites',
  initialState,
  reducers: {
    setCurrentSite(state, action) {
      state.currentSite = action.payload;
    },
    clearSiteError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSitesThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchSitesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.sites = action.payload;
      })
      .addCase(fetchSitesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSiteThunk.fulfilled, (state, action) => {
        state.currentSite = action.payload;
      })
      .addCase(createSiteThunk.fulfilled, (state, action) => {
        state.sites.push(action.payload);
      })
      .addCase(updateSiteThunk.fulfilled, (state, action) => {
        const updatedSite = action.payload as unknown as Site; // Assuming backend returns site.
        const idx = state.sites.findIndex((s) => s.id === updatedSite.id);
        if (idx !== -1) state.sites[idx] = updatedSite;
        if (state.currentSite?.id === updatedSite.id) state.currentSite = updatedSite;
      })
      .addCase(deleteSiteThunk.fulfilled, (state, action) => {
        state.sites = state.sites.filter((s) => s.id !== action.payload);
      });
  },
});

export const { setCurrentSite, clearSiteError } = siteSlice.actions;
export default siteSlice.reducer;
