import type {IProductData} from '@/types'
import {openDB, PRODUCTS_STORE_NAME} from '@/db'

export async function addProduct(product: IProductData) {

	const db = await openDB()
	const tx = db.transaction(PRODUCTS_STORE_NAME, 'readwrite')

	tx.objectStore(PRODUCTS_STORE_NAME).put(product);
}

export async function getProducts(): Promise<IProductData[]> {

	const db = await openDB()
	const tx = db.transaction(PRODUCTS_STORE_NAME, 'readonly')
	const store = tx.objectStore(PRODUCTS_STORE_NAME)

	return new Promise((resolve, reject) => {
		const request = store.getAll()
		request.onsuccess = () => {
			const products: IProductData[] = request.result;

			// order by price DESC
			// @todo rewrite to use store.createIndex...
			products.sort((a, b) => b.added_at - a.added_at);

			resolve(products);
		}
		request.onerror = () => reject(request.error)
	});
}

export async function removeProduct(id: string) {
	const db = await openDB()
	const tx = db.transaction(PRODUCTS_STORE_NAME, 'readwrite')

	tx.objectStore(PRODUCTS_STORE_NAME).delete(id)
}

export async function clearProducts(){
	const db = await openDB()
	const tx = db.transaction(PRODUCTS_STORE_NAME, 'readwrite')
	const store = tx.objectStore(PRODUCTS_STORE_NAME)

	store.clear()
}