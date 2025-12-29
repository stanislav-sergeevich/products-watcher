const DB_NAME = 'products-db'
const DB_VERSION = 1

export const PRODUCTS_STORE_NAME = 'products'

export function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION)

		request.onupgradeneeded = () => {
			const db = request.result

			if (!db.objectStoreNames.contains(PRODUCTS_STORE_NAME)) {
				db.createObjectStore(PRODUCTS_STORE_NAME, { keyPath: 'id' })
			}
		}

		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})
}
