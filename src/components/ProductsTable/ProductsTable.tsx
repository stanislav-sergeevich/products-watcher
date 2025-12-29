import {useState} from 'react'
import clsx from 'clsx'
import style from './ProductsTable.module.sass'
import type {IProductData} from '@/types'
import {useAppSelector, useAppDispatch} from '@/hooks'
import {getProducts, removeProduct} from '@/db/products'
import {syncProducts} from '@/stores/productsSlice.ts'

export const ProductsTable = () => {

	const [delConfirm, setDelConfirm] = useState<string|null>(null);

	const items    = useAppSelector((state) => state.products.items);
	const dispatch = useAppDispatch();

	async function deleteProduct(prod: IProductData) {
		if (delConfirm === prod.id) {

			await removeProduct(prod.id);

			// лучше убрать из списка только удаленный товар, но на сейчас можно и так оставить)
			const products = await getProducts();
			dispatch(syncProducts(products));

			setDelConfirm(null);
			return;
		} else {
			setDelConfirm(prod.id);
		}
	}

	return <div className={style.table_wrapper}>

		{items.length === 0 && <p className={style.msg_404}>No products added</p>}

		{items.length > 0 && <table className={style.table}>
			<thead>
				<tr>
					<th>Product</th>
					<th>Price</th>
					<th>Added at</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{items.map((prod: IProductData) => {
					const date = new Date(prod.added_at * 1000);

					return <tr>
						<td>{prod.name}</td>
						<td style={{width: '20%'}}>{prod.currency_code} {prod.price}</td>
						<td style={{width: '80px'}}>
							{date.toLocaleDateString()}
							<br/>
							{date.toLocaleTimeString()}
						</td>
						<td>
							<div className={style.table_actions}>

								<a href={prod.site_url} className={clsx('btn', 'btn_icon')} title={prod.site_url} target="_blank">
									<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><g fill="none"><path d="M6.25 4.5A1.75 1.75 0 0 0 4.5 6.25v7.5c0 .966.784 1.75 1.75 1.75h7.5a1.75 1.75 0 0 0 1.75-1.75v-2a.75.75 0 0 1 1.5 0v2A3.25 3.25 0 0 1 13.75 17h-7.5A3.25 3.25 0 0 1 3 13.75v-7.5A3.25 3.25 0 0 1 6.25 3h2a.75.75 0 0 1 0 1.5h-2zm4.25-.75a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V5.56l-3.72 3.72a.75.75 0 1 1-1.06-1.06l3.72-3.72h-3.19a.75.75 0 0 1-.75-.75z" fill="currentColor"></path></g></svg>
								</a>

								<button type="button" className={clsx('btn_icon', delConfirm === prod.id && 'btn_error')}
										onBlur={() => setDelConfirm(null)}
										onClick={() => deleteProduct(prod)}>
									<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<g fill="none">
											<path
												d="M12 1.75a3.25 3.25 0 0 1 3.245 3.066L15.25 5h5.25a.75.75 0 0 1 .102 1.493L20.5 6.5h-.796l-1.28 13.02a2.75 2.75 0 0 1-2.561 2.474l-.176.006H8.313a2.75 2.75 0 0 1-2.714-2.307l-.023-.174L4.295 6.5H3.5a.75.75 0 0 1-.743-.648L2.75 5.75a.75.75 0 0 1 .648-.743L3.5 5h5.25A3.25 3.25 0 0 1 12 1.75zm6.197 4.75H5.802l1.267 12.872a1.25 1.25 0 0 0 1.117 1.122l.127.006h7.374c.6 0 1.109-.425 1.225-1.002l.02-.126L18.196 6.5zM13.75 9.25a.75.75 0 0 1 .743.648L14.5 10v7a.75.75 0 0 1-1.493.102L13 17v-7a.75.75 0 0 1 .75-.75zm-3.5 0a.75.75 0 0 1 .743.648L11 10v7a.75.75 0 0 1-1.493.102L9.5 17v-7a.75.75 0 0 1 .75-.75zm1.75-6a1.75 1.75 0 0 0-1.744 1.606L10.25 5h3.5A1.75 1.75 0 0 0 12 3.25z"
												fill="currentColor"></path>
										</g>
									</svg>
								</button>

							</div>
						</td>
					</tr>
				})}
			</tbody>
		</table>}
	</div>
}