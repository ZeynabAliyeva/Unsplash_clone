import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	const { data } = await axios.get('/posts');
	return data;
});

export const savePost = createAsyncThunk('post/savePost', async ({ postId, userId }) => {
	const response = await axios.post(`/users/${userId}/save-post/${postId}`);
	return response.data;
});

export const removePost = createAsyncThunk('post/removePost', async ({ postId }) => {
	const response = await axios.delete(`/posts/${postId}`);
	return response.data;
});

export const saveLike = createAsyncThunk('post/likePost', async ({ postId, userId }) => {
	const response = await axios.post(`/users/${userId}/like-post/${postId}`);
	return response.data;
});

export const commentsAdd = createAsyncThunk('post/comments', async () => {
	const response = await axios.put(`/posts/comments/post`);
	return response.data;
});

const initialState = {
	posts: {
		items: [],
		status: 'loading',
	},
};

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	extraReducers: {
		[fetchPosts.pending]: (state) => {
			state.posts.items = [];
			state.posts.status = 'loading';
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = 'loaded';
		},
		[fetchPosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'error';
		},
	},
});

export const postsReducer = postsSlice.reducer;

export const selectPosts = (state) => state.auth.status;
