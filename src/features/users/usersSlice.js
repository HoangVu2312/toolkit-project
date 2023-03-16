import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fake api
const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

const initialState = []

// function to fetch api (export to index.js => load when client open app)
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get(USERS_URL);
    return response.data
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},

    // only handle one case (successful get all users from api)
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return action.payload;
        })
    }
})

// create a selector (object that contain all users)
export const selectAllUsers = (state) => state.users;

// create a selctor that return a single user based on its userId 
export const selectUserById = (state, userId) => {
   return state.users.find(user => user.id === userId)
}

export default usersSlice.reducer