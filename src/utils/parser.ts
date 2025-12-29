import type {IProductResponse, IGeminiResponse} from '@/types'

export const parseProductHTML = (html: string): Promise<IProductResponse|null> => {
	return new Promise((resolve, reject) => {
		fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
			method: 'POST',
			headers: {
				'x-goog-api-key': import.meta.env.VITE_GEMINI_API,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				contents: [
					{
						parts: [
							{text: `${html} \n Извлеки название товара, цену и ISO код валюты если возможно. Ответ строго в JSON: {"product_name": string, "price": number, "currency_code": string|undefined}`}
						]
					}
				],
			}),
		}).then(async (resp: Response) => {

			try {
				const data: IGeminiResponse = await resp.json();
				const likeJson: string = data.candidates[0].content.parts[0].text;

				const prod: Record<string, any> = JSON.parse(
					likeJson.substring(
						likeJson.indexOf('{'),
						likeJson.indexOf('}') + 1
					)
				);

				if (typeof prod.product_name !== 'string' || typeof prod.price !== 'number') {
					throw Error();
				}

				resolve(<IProductResponse>{
					product_name: prod.product_name,
					price: prod.price,
					currency_code: prod.currency_code
				});

			} catch (_) {
				reject(null);
			}

		}).catch(() => {
			reject(null);
		});
	});
}