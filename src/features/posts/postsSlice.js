// Reducer file that handle data form UI

import { createSlice, nanoid, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from "axios";

// fake api link
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const initialState = {
    posts: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

// function to fetch api (get all posts)
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data
})

// a function to add new post
export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})

// update
export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    const { id } = initialPost;
    // try-catch block only for development/testing with fake API
    // otherwise, remove try-catch and add updatePost.rejected case
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data
    } catch (err) {
        // return err.message; => cant update fake api => ignore the erreor
        return initialPost; // use the new data update right here in slice
    }
})

// delete
export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const { id } = initialPost;

    const response = await axios.delete(`${POSTS_URL}/${id}`)
    // API not return deleted postId => check action status => 200 => return that deleted post
    if (response?.status === 200) return initialPost;

    // if status is not 200 => return err text
    return `${response?.status}: ${response?.statusText}`;
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: { // this is an object have 2 function

        // this reducer-function ONLY works when there is NO API RELATED ACTION
        postAdded: {
            // first: function to handle data from form-component
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            // second: delare a prepare-function => trigger and get data form component
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(), // auto generate random id for posts
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },

        // reducer to update reaction count
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },

    // another reducer => handle other actions that not defined as part of slice' reducer
    extraReducers(builder) {
        builder // builder define 3 additional cases reducer that response to actions (status of api) outside slice

            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading' // if status of api === pending  => set staus of state === loading
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });

                // Add any fetched posts to the array
                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                // Fix for API post IDs:
                // Creating sortedPosts & assigning the id 
                // would be not be needed if the fake API 
                // returned accurate new post IDs
                const sortedPosts = state.posts.sort((a, b) => {
                    if (a.id > b.id) return 1
                    if (a.id < b.id) return -1
                    return 0
                })
                action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
                // End fix for fake API post IDs 

                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                state.posts.push(action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => { // action is data from api?
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                action.payload.date = new Date().toISOString(); // create new date
                const posts = state.posts.filter(post => post.id !== id)
                state.posts = [...posts, action.payload]
                // postsAdapter.upsertOne(state, action.payload)
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                const posts = state.posts.filter(post => post.id !== id)
                state.posts = posts;
                // postsAdapter.removeOne(state, id)
            })
    }
})

// to make its eaier to change to posts structure later => export all posts individually (mostly for component postList)
export const selectAllPosts = (state) => state.posts.posts; // first 'posts' is the name of property inside initial state | second 'posts' is the name of slice
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

// define a selector to get only a single post base on its id (remember to return)
export const selectPostById = (state, postId) => {
    return state.posts.posts.find(post => post.id === postId)
}

// memorised selector (inputs are one or more functions)
export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId], // the results of these 2 functions are arguments 
    (posts, userId) => posts.filter(post => post.userId === userId)
    
)


// postAdded & reactionAdded are a action-creator function auto created by toolkit
export const { postAdded, reactionAdded } = postsSlice.actions

export default postsSlice.reducer