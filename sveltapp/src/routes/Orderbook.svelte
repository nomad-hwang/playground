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
	<div class="Orderbook_symbol">
		<span>{data.symbol}</span>
		<input type="number" bind:value={aggregate} min="0.01" step="0.01" />
	</div>

	{#each [...asksData.orders].reverse() as order}
		<Order {order} {options} sizeSum={asksData.maxSize} />
	{/each}

	<div class="Orderbook_price">
		<span>Price</span>
	</div>

	{#each [...bidsData.orders].reverse() as order}
		<Order {order} {options} sizeSum={bidsData.maxSize} />
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

	.Orderbook_symbol {
		text-align: center;
		font-size: 2rem;
		margin: 0.5rem 0;
	}

	.Orderbook_symbol span {
		width: 90%;
	}
	.Orderbook_symbol input {
		vertical-align: middle;
		width: 10%;
	}

	.Orderbook_price {
		padding: 0.5rem;
		font-size: 1.5rem;
		text-align: center;
	}
</style>
