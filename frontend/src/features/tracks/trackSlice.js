import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import trackService from "./trackService"

const initialState = {
  tracks: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const createTrack = createAsyncThunk('tracks/create', async (trackData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await trackService.createTrack(trackData, token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const getTracks = createAsyncThunk('tracks/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await trackService.getTrack(token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const deleteTrack = createAsyncThunk('tracks/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await trackService.deleteTrack(id, token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTrack.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createTrack.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tracks.push(action.payload)
      })
      .addCase(createTrack.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTracks.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTracks.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tracks = action.payload
      })
      .addCase(getTracks.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteTrack.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteTrack.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tracks = state.tracks.filter(
          (track) => track._id !== action.payload
        )
      })
      .addCase(deleteTrack.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset } = trackSlice.actions
export default trackSlice.reducer