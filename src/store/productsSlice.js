import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addProduct, getProducts, deleteProduct } from "@/api/productService";

export const addProductThunk = createAsyncThunk(
    'products/add',
    async(formData) => {
        const data = await addProduct(formData)
        return data;
    }
);

export const getProductsThunk = createAsyncThunk(
    'products/get',
    async()=>{
        const data = await  getProducts();
        return data;
    }
)

export const deleteProductThunk = createAsyncThunk(
    'products/delete',
    async(id) => {
        await deleteProduct(id);
        return id;
    }
)


const productSlice = createSlice({
    name:'products',
    initialState:{
        items:[],
        loading:false
    },
    extraReducers: (builder) =>{
        builder
        //Add
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
        })
        //Get
         .addCase(getProductsThunk.pending,(state)=>{
            state.loading = true;
         })
         .addCase(getProductsThunk.fulfilled,(state, action)=>{
            state.loading = false;
            state.items = action.payload;
         })
         .addCase(getProductsThunk.rejected, (state, action) => {
            state.loading = false;
            console.error("La récupération a échoué :", action.error.message);
        })
        //Delete
         .addCase(deleteProductThunk.pending,(state)=>{
            state.loading = true;
         })
         .addCase(deleteProductThunk.fulfilled,(state,action)=>{
            state.loading = false;
            state.items = state.items.filter((product)=> product.id !== action.payload);
         })
         .addCase(deleteProductThunk.rejected,(state, action)=>{
            state.loading = false;
            console.error("La suppression a échoué", action.error.message);
         })
    },
});
export default productSlice.reducer;