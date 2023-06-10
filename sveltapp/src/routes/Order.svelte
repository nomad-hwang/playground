<script context="module" lang="ts">
	type Align = 'left' | 'right';

	export interface Options {
		align: Align;
	}
</script>

<script lang="ts">
	import type { OrderData } from './orderbook';

	export let order: OrderData;
	export let sizeSum: number = 1.0;
	export let options: Options = { align: 'left' };

	$: width = `${(order.size / sizeSum) * 100}%`;
</script>

<div class="Order_order">
	<div class="Order_order_wrapper">
		<span class="Order_order_price">{order.price.toFixed(2)}</span>
		<span class="Order_order_size">{order.size.toFixed(8)}</span>
		<span class="Order_order_sum">{sizeSum.toFixed(8)}</span>
		<div
			class="Order_order_background Order_order_background--{order.side} Order_order_background--{options.align}"
			style="--width: {width}"
		/>
	</div>
</div>

<style>
	.Order_order {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		height: 100%;
	}

	.Order_order:hover {
		filter: invert(0.3);
		outline: 1px dashed rgb(255 255 255 / 30%);
	}

	.Order_order_wrapper {
		display: flex;
		justify-content: space-between;
		height: 100%;
		width: 100%;
		position: relative;
	}

	.Order_order_price,
	.Order_order_size,
	.Order_order_sum {
		width: 30%;
		text-align: right;
	}

	.Order_order_background {
		width: var(--width, 0%);
		height: 100%;
		position: absolute;
		z-index: -1;
	}

	.Order_order_background--left {
		left: 0;
	}

	.Order_order_background--right {
		right: 0;
	}

	.Order_order_background--bids {
		background-color: rgba(255, 0, 0, 0.25);
	}

	.Order_order_background--asks {
		background-color: rgba(0, 255, 0, 0.25);
	}
</style>
