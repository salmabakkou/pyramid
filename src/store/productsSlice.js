import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addProduct } from "@/api/productService";

export const addProductThunk = createAsyncThunk(
    'products/add',
    async(formData) => {
        const data = await addProduct(formData)
        return data;
    }
);


const productSlice = createSlice({
    name:'products',
    initialState:{
        items:[],
        loading:false
    },
    extraReducers: (builder) =>{
        builder
         .addCase(addProductThunk.pending,(state)=>{
            state.loading = true;
         })
         .addCase(addProductThunk.fulfilled,(state, action)=>{
            state.loading = false;
            state.items.push(action.payload);
         })
         .addCase(addProductThunk.rejected, (state, action) => {
            state.loading = false;
            console.error("L'ajout a échoué :", action.error.message);
        });
    },
});
export default productSlice.reducer;