import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "./authService"

const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isExpired: false,
  message: '',
}

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const emailUser = createAsyncThunk('auth/emailUser', async (userData, thunkAPI) => {
  try {
    return await authService.emailUser(userData)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})


export const emailData = createAsyncThunk('auth/emailData', async (token, thunkAPI) => {
  try {
    return await authService.emailData(token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const resetPass = createAsyncThunk('auth/reset', async (userData, thunkAPI) => {
  try {
    return await authService.reset(userData)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const getUser = createAsyncThunk('auth/getUser', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await authService.getUser(token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const updateUser = createAsyncThunk('auth/update', async (userData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await authService.update(userData, token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const getTokenResult = createAsyncThunk('auth/token', (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return authService.checkToken(token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const logout = createAsyncThunk('auth/logout', () => {
  authService.logout()
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false
      state.isSuccess = false
      state.isLoading = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isExpired = false
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(emailUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(emailUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isExpired = false
      })
      .addCase(emailUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(emailData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(emailData.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isExpired = false
      })
      .addCase(emailData.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isExpired = false
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(resetPass.pending, (state) => {
        state.isLoading = true
      })
      .addCase(resetPass.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
        state.isExpired = false
      })
      .addCase(resetPass.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = {
          ...state.user,
          ...action.payload
        }
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isExpired = false
        state.user = {
          ...state.user,
          ...action.payload
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTokenResult.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTokenResult.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isExpired = action.payload
      })
      .addCase(getTokenResult.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.isExpired = true
        state.user = null
      })
  }
})

export const { reset } = authSlice.actions
export default authSlice.reducer