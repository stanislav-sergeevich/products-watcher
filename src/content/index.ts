import {NotifyX} from 'notifyx'
import 'notifyx/style.css'
import type {IInspectResult, IProductData, IMessageListenerResp} from '@/types'
import {MessageType} from '@/types'
import {onMessageListener, sendMessage} from '@/utils'

let inspector: HTMLElement | null = null;

function createRoot(): ShadowRoot {
	const host = document.createElement('div');
	host.id = '__awesome_products_watcher__';

	host.style.all    = 'initial'
	host.style.zIndex = '999999'

	document.documentElement.appendChild(host)

	return host.attachShadow({ mode: 'open' });
}

const root = createRoot();

async function sendOuterHTML(element: HTMLElement) {

	NotifyX.clear();

	// @todo move to shadow dom
	NotifyX.info('Сохранение товара...', {
		position: 'top-center',
		duration: 0
	});

	const product: IProductData|null = await sendMessage(MessageType.parseProductByHtml, <IInspectResult>{
		html: element.outerHTML,
		site_url: window.location.href
	});

	NotifyX.clear();

	NotifyX[product ? 'success' : 'error'](product ? `Товар "${product.name}" успешно добавлен` : 'Ошибка парсинга товара', {
		position: 'top-center',
		duration: 3000
	});
}

function onMouseMove(e: MouseEvent) {

	if (!e.target || !inspector) {
		return;
	}

	if (e.target === document.body) {
		return;
	}

	const hoverer = e.target as HTMLElement;
	const hovererStyle = window.getComputedStyle(hoverer);
	const rect: DOMRect = hoverer.getBoundingClientRect();

	inspector.style.top          = window.scrollY + rect.top + 'px';
	inspector.style.left         = window.scrollX + rect.left + 'px';
	inspector.style.width        = rect.width + 'px';
	inspector.style.height       = rect.height + 'px';
	inspector.style.borderRadius = hovererStyle.getPropertyValue('border-radius');
}

function onClick(e: MouseEvent) {
	e.stopPropagation();
	e.preventDefault();

	if (e.target) {
		sendOuterHTML(e.target as HTMLElement);
	}

	stopInspect();
}

function onKeyDown(e: KeyboardEvent) {
	if (e.key === 'Escape') {
		stopInspect();
	}
}

function startInspect() {

	if (inspector) {
		return;
	}

	// create inspector element
	inspector = document.createElement('div');
	inspector.style.position      = 'absolute';
	inspector.style.background    = 'rgba(255, 204, 60, 0.25)';
	inspector.style.transition    = 'all 0.4s';
	inspector.style.pointerEvents = 'none';
	inspector.style.zIndex        = '9999';
	inspector.style.outline       = '2px dashed rgba(255, 204, 60, 0.8)';
	inspector.style.userSelect    = 'none';
	inspector.style.borderRadius  = '8px';

	// add inspector div element to page
	root.append(inspector);

	// attach main events
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('click', onClick, true);
}

function stopInspect() {

	if (!inspector) {
		return;
	}

	// detach main events
	document.removeEventListener('mousemove', onMouseMove);
	document.removeEventListener('keydown', onKeyDown);
	document.removeEventListener('click', onClick, true);

	// remove inspector element
	inspector.remove();
	inspector = null;
}

onMessageListener(MessageType.startProductChoosing, (resp: IMessageListenerResp<any>) => {
	startInspect();
});