import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchCourses = createAsyncThunk(
    "courses/fetchCourses",
    async () => {
        const res = await api.get("/courses");
        return res.data;
    }
);

export const createCourse = createAsyncThunk(
    "courses/createCourse",
    async (courseData) => {
        const res = await api.post("/courses", courseData);
        return res.data;
    }
);

const courseSlice = createSlice({
    name: "courses",
    initialState: {
        courses: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
            });
    },
});

export default courseSlice.reducer;