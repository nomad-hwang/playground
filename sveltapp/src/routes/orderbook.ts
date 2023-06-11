export type Side = 'bids' | 'asks';

export interface OrderData {
	side: Side;
	price: number;
	size: number;
}

export interface Orders {
	side: Side;
	orders: OrderData[];
	maxSize: number;
}

export class OrderbookData {
	private bidsMap: Map<number, number>;
	private asksMap: Map<number, number>;
	private baseCurrency: string;
	private quoteCurrency: string;

	constructor(baseCurrency: string, quoteCurrency: string) {
		this.bidsMap = new Map();
		this.asksMap = new Map();
		this.baseCurrency = baseCurrency;
		this.quoteCurrency = quoteCurrency;
	}

	get symbol(): string {
		return `${this.baseCurrency}-${this.quoteCurrency}`;
	}

	get base(): string {
		return this.baseCurrency;
	}

	get quote(): string {
		return this.quoteCurrency;
	}

	set bids(data: [price: number, size: number][]) {
		updateMap(this.bidsMap, data);
	}

	set asks(data: [price: number, size: number][]) {
		updateMap(this.asksMap, data);
	}

	// TODO: cache the result unless map is updated

	get_bids(aggregated: number, rangeCount: number): Orders {
		return aggregate(this.bidsMap, 'bids', aggregated, rangeCount);
	}

	get_asks(aggregated: number, rangeCount: number): Orders {
		return aggregate(this.asksMap, 'asks', aggregated, rangeCount);
	}
}

function updateMap(map: Map<number, number>, data: [price: number, size: number][]): void {
	data.forEach(([price, size]) => {
		if (size === 0) {
			map.delete(price);
		} else {
			map.set(price, size);
		}
	});
}

// TODO: maybe use array instead of map?
function aggregate(map: Map<number, number>, side: Side, by: number, rangeCount: number): Orders {
	const aggregated = new Map<number, number>();

	map.forEach((size, price) => {
		const key = Math.floor(price / by) * by;
		const prev = aggregated.get(key) || 0;
		aggregated.set(key, prev + size);
	});

	// convert to array of orders
	const orders: OrderData[] = [];
	aggregated.forEach((size, price) => {
		orders.push({ side, price, size });
	});

	// sort by price
	orders.sort((a, b) => {
		return a.price - b.price; // ascending
	});

	// cut to rangeCount
	if (side === 'asks') {
		orders.splice(rangeCount);
	} else {
		orders.splice(0, orders.length - rangeCount);
	}

	// find max size
	let maxSize = 0;
	orders.forEach(({ size }) => {
		if (size > maxSize) {
			maxSize = size;
		}
	});

	const result: Orders = {
		side,
		orders,
		maxSize
	};

	return result;
}
