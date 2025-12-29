export const enum MessageType {
	startProductChoosing = 'start_product_choosing',
	parseProductByHtml = 'parse_product_by_html',
	onProductSave = 'on_product_save'
}

export interface IProductData {
	id: string
	site_url: string
	name: string
	price: number
	added_at: number
	currency_code?: string
}

export interface IProductResponse {
	product_name: string
	price: number
	currency_code?: string
}

export interface IMessage {
	type: MessageType
	data?: Record<string, any>
}

export interface IInspectResult {
	html: string
	site_url: string
}

export interface IGeminiResponseCandidate {
	content: IGeminiResponseContent
	finishReason: string
	index: number
}

export interface IGeminiResponsePart {
	text: string
}

export interface IGeminiResponseContent {
	parts: IGeminiResponsePart[],
	role: string
}

export interface IGeminiResponse {
	candidates: IGeminiResponseCandidate[]
	modelVersion: string
	responseId: string
}

export interface IMessageListenerResp<T> {
	data: T
	sender: chrome.runtime.MessageSender
	sendResponse: (response?: any) => void
}