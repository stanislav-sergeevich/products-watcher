import type {IMessage, IMessageListenerResp} from '@/types'
import {MessageType} from '@/types'

export function unixtime() {
	return Math.floor(Date.now() / 1000);
}

export function sendMessage(type: MessageType, data?: any): Promise<any> {
	return new Promise(async (resolve) => {
		try {
			const res = await chrome.runtime.sendMessage<IMessage>({type, data});
			resolve(res);
		} catch (e) {
			resolve(null);
		}
	});
}

export function arrayToCsv(items: string[][], headers: string[]): string {
	return [
		headers,
		...items.map(items => {
			return items.map(str => `"${str.replace(/"/g, '\"')}"`)
		})
	]
	.map(e => e.join(','))
	.join('\n');
}

export function saveAs(blob: Blob, filename: string) {
	const elem = window.document.createElement('a');
	elem.href = window.URL.createObjectURL(blob);
	elem.download = filename;
	document.body.appendChild(elem);
	elem.click();
	document.body.removeChild(elem);
}

export function sendActiveTabMessage(type: MessageType, data?: any): Promise<any> {
	return new Promise((resolve, reject) => {
		chrome.tabs.query({active: true, currentWindow: true}, async (tabs)=> {

			if (tabs.length && tabs[0].id) {
				const resp: any = await chrome.tabs.sendMessage<IMessage, any>(tabs[0].id, {type, data});
				resolve(resp);
				return;
			}

			reject();
		});
	})
}

export function onMessageListener<T>(type: MessageType, callback: (data: IMessageListenerResp<T>) => boolean|void) {

	const listener = (msg: IMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {

		if (msg.type !== type) {
			return;
		}

		return callback(<IMessageListenerResp<T>>{
			data: msg.data as T,
			sender,
			sendResponse
		});
	}

	chrome.runtime.onMessage.addListener(listener);

	return {
		dispose() {
			chrome.runtime.onMessage.removeListener(listener);
		}
	}
}

export * from './parser.ts'