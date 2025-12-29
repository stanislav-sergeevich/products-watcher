import {useEffect} from 'react'
import {ProductsTable} from '@/components/ProductsTable/ProductsTable.tsx'
import {MessageType, type IProductData, type IMessageListenerResp} from '@/types'
import {useAppDispatch} from '@/hooks'
import {syncProducts, addStoreProduct} from '@/stores/productsSlice'
import {getProducts, clearProducts} from '@/db/products.ts'
import {sendActiveTabMessage, onMessageListener, arrayToCsv, saveAs} from '@/utils'

function App() {

	const dispatch = useAppDispatch();

	async function chooseProductOnPage() {
		// send message to active tab
		await sendActiveTabMessage(MessageType.startProductChoosing);
		// close current popup window
		window.close();
	}

	async function maybeClearProducts() {
		if (confirm('Clear all products?')) {
			await clearProducts();
			dispatch(syncProducts([]));
		}
	}

	function onProductSave(resp: IMessageListenerResp<IProductData>): boolean {
		dispatch(addStoreProduct(resp.data));
		return false;
	}

	async function exportProducts() {
		const products: IProductData[] = await getProducts();
		const productsFormatted: string[][] = products.map(prod => {
			return [
				prod.name,
				prod.price.toString(),
				prod.currency_code ?? '',
				prod.site_url,
				prod.added_at.toString()
			]
		});

		const csv: string = arrayToCsv(productsFormatted, [
			'Product name',
			'Price',
			'Currency code',
			'Page URL',
			'Added At'
		]);

		const blob = new Blob([csv], {type: 'text/csv'});
		saveAs(blob, 'tracked_prices.csv');
	}

	useEffect(() => {

		// add products saver watcher
		const onProductSaveListener = onMessageListener<IProductData>(MessageType.onProductSave, onProductSave);

		// load saved products into store
		getProducts().then((products: IProductData[]) => {
			products.length > 0 && dispatch(syncProducts(products));
		});

		return () => {
			onProductSaveListener.dispose();
		}
	}, []);

	return (
		<>
			<div className="btn-group" style={{marginBottom: '1.5rem'}}>
				<button type="button" className="btn_prime" onClick={chooseProductOnPage}>Add product</button>
				<button type="button" className="btn_success" onClick={exportProducts}>Export as CSV</button>

				<button type="button" className="" onClick={maybeClearProducts} style={{marginLeft: 'auto'}}>Clear All</button>
			</div>

			<ProductsTable/>
		</>
	)
}

export default App