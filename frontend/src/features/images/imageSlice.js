import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import imageService from "./imageService"

const initialState = {
  image: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const postNewCover = createAsyncThunk('image/newCover', async (imageData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await imageService.postImage(imageData, token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(postNewCover.pending, (state) => {
        state.isLoading = true
      })
      .addCase(postNewCover.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.image.push(action.payload)
      })
      .addCase(postNewCover.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset } = imageSlice.actions
export default imageSlice.reducer