import type {IInspectResult, IProductData, IProductResponse} from '@/types'
import {MessageType} from '@/types'
import {v4 as uuidv4} from 'uuid'
import {sendMessage, unixtime, onMessageListener, parseProductHTML} from '@/utils'
import {addProduct} from '@/db/products'

onMessageListener<IInspectResult>(MessageType.parseProductByHtml, resp => {

	parseProductHTML(resp.data.html)
		.then(async (prod: IProductResponse|null) => {

			const product: IProductData|null = !prod ? null : {
				id: uuidv4(),
				name: prod.product_name,
				price: prod.price,
				currency_code: prod.currency_code,
				added_at: unixtime(),
				site_url: resp.data.site_url
			}

			if (product) {
				// save product to database
				await addProduct(product);
				// add product to store
				await sendMessage(MessageType.onProductSave, product);
			}

			// return product object
			resp.sendResponse(product);
		})
		.catch(() => {
			resp.sendResponse(null);
		});

	return true;
});