export const DEFAULT_TTL = 5000;

export default class Signal {
	constructor(name, data, ttl = DEFAULT_TTL) {
		this.name = '' + name;
		this.ttl = ttl;
		this.expiresAt = Date.now() + ttl;
		this.data = data;
	}
}