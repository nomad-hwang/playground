import { beforeEach, describe, expect, it } from 'vitest';
import { OrderbookData } from './orderbook';

describe('OrderbookData', () => {
	let orderbook: OrderbookData;

	beforeEach(() => {
		orderbook = new OrderbookData('BTC', 'USD');
	});

	describe('symbol', () => {
		it('should return the symbol', () => {
			expect(orderbook.symbol).toEqual('BTC-USD');
		});
	});

	describe('base_currency', () => {
		it('should return the base currency', () => {
			expect(orderbook.base).toEqual('BTC');
		});
	});

	describe('quote_currency', () => {
		it('should return the quote currency', () => {
			expect(orderbook.quote).toEqual('USD');
		});
	});

	describe('update', () => {
		it('should update bids and asks maps', () => {
			orderbook.bids = [
				[100, 10],
				[99, 20]
			];
			orderbook.asks = [
				[101, 30],
				[102, 40]
			];

			expect(orderbook['bidsMap'].get(100)).toEqual(10);
			expect(orderbook['bidsMap'].get(99)).toEqual(20);
			expect(orderbook['asksMap'].get(101)).toEqual(30);
			expect(orderbook['asksMap'].get(102)).toEqual(40);
		});

		it('should delete entries with size 0', () => {
			orderbook.bids = [
				[100, 10],
				[99, 20]
			];
			orderbook.asks = [
				[101, 30],
				[102, 0]
			];

			expect(orderbook['asksMap'].has(102)).toBeFalsy();
		});
	});

	describe('get_aggregated', () => {
		beforeEach(() => {
			orderbook.bids = [
				[100, 10],
				[99, 20]
			];
			orderbook.asks = [
				[101, 30],
				[102, 40],
				[110, 50]
			];
		});

		it('should aggregate bids by 5', () => {
			const result = orderbook.get_bids(5);

			expect(result).toEqual([
				{ side: 'bids', price: 100, size: 10 },
				{ side: 'bids', price: 95, size: 20 }
			]);
		});

		it('should aggregate asks by 5', () => {
			const asks = orderbook.get_asks(5);

			expect(asks).toEqual([
				{ side: 'asks', price: 100, size: 70 },
				{ side: 'asks', price: 110, size: 50 }
			]);
		});
	});
});
