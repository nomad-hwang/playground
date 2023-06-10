<script lang="ts">
	import Order, { type Options as OrderOptions } from './Order.svelte';
	import type { OrderbookData } from './orderbook';

	export let data: OrderbookData;
	export let options: OrderOptions = { align: 'left' };
	export let range: number = 20;
	export let aggregate: number = 0.01;

	$: bidsData = data.get_bids(aggregate, range);
	$: asksData = data.get_asks(aggregate, range);
</script>

<div class="hys-layout--panel Orderbook_orderbook">
	<h1>{data.symbol}</h1>
	<!-- get bids and asks. findout it's max value -->

	{#each bidsData.orders as order}
		<Order {order} {options} sizeSum={bidsData.maxSize} />
	{/each}

	<div class="Orderbook_price">
		<span>{100.0} {data.quote}</span>
	</div>

	{#each asksData.orders as order}
		<Order {order} {options} sizeSum={asksData.maxSize} />
	{/each}
</div>

<style>
	.Orderbook_orderbook {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 400px;
		z-index: 1;
	}

	.Orderbook_price {
		padding: 0.5rem;
		font-size: 1.5rem;
		text-align: center;
	}

	h1 {
		margin: 0;
		text-align: center;
	}
</style>
