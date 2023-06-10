<script context="module" lang="ts">
	interface DepthUpdate {
		e: string;
		E: number;
		s: string;
		U: number;
		u: number;
		b: [string, string][];
		a: [string, string][];
	}
</script>

<script lang="ts">
	import Orderbook from './Orderbook.svelte';
	import { OrderbookData } from './orderbook';

	import { onMount } from 'svelte';

	let orderbook = new OrderbookData('BTC', 'USD');

	onMount(() => {
		// const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth@100ms');
		const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@depth@100ms');

		ws.addEventListener('open', () => {
			console.log('connected');
		});

		ws.addEventListener('message', (event) => {
			const data: DepthUpdate = JSON.parse(event.data as string);
			orderbook.bids = data.b.map(([price, size]) => [Number(price), Number(size)]);
			orderbook.asks = data.a.map(([price, size]) => [Number(price), Number(size)]);
		});

		ws.addEventListener('close', () => {
			console.log('disconnected');
		});
	});
</script>

<Orderbook data={orderbook} />
