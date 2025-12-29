import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {IProductData} from '@/types'

export interface IProductsSlice {
	items: IProductData[]
}

export const productsSlice = createSlice({
	name: 'products',
	initialState: <IProductsSlice>{
		items: [],
	},
	reducers: {
		setProducts(state, action: PayloadAction<IProductData[]>) {
			state.items = action.payload ?? [];
		},
		addProduct(state, action: PayloadAction<IProductData>) {
			state.items.unshift(action.payload);
		},
	},
})

export const {
	setProducts: syncProducts,
	addProduct: addStoreProduct,
} = productsSlice.actions

export default productsSlice.reducer