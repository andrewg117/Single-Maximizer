import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import imageService from "./imageService"

const initialState = {
  image: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const postImage = createAsyncThunk('image/post', async (imageData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await imageService.postImage(imageData, token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const getImage = createAsyncThunk('image/get', async (imageData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await imageService.getImage(imageData, token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const updateImage = createAsyncThunk('image/put', async (imageData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await imageService.updateImage(imageData, token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const deleteImage = createAsyncThunk('image/delete', async (imageData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await imageService.deleteImage(imageData, token)
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
      .addCase(postImage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(postImage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.image = action.payload
      })
      .addCase(postImage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getImage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getImage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.image = action.payload
      })
      .addCase(getImage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateImage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isExpired = false
        state.image = action.payload
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteImage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteImage.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
        state.image = null
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset } = imageSlice.actions
export default imageSlice.reducer