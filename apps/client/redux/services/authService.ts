import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// export const fetchUsers = createAsyncThunk(
//   "user/fetchAll",
//   async (_, thunkApi) => {
//     try {
//       const res = await axios.get<User[]>(
//         `${process.env.NEXT_PUBLIC_API_URL}/users`
//       );
//       return res.data;
//     } catch (error) {
//       return thunkApi.rejectWithValue("Something went wrong :(");
//     }
//   }
// );
