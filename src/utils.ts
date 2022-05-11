export function getType(val) {
	return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
}

export function isDev() {
	return true;
}

export function magnitude(num) {
	// math math math
	return Math.floor(Math.log10(Math.abs(num)));
}

// Note the map function signature: Key is passed to the function
export function objectMap<KType extends string, TIn, TOut>(obj: Record<KType, TIn>, fn: (key: KType, value: TIn) => TOut): Record<KType, TOut> {
	let newObj: Record<string, TOut> = {};
	for (const key in obj) {
		newObj[key] = fn(key, obj[key]);
	}
	return newObj;
}

// Icons used throughout the app are single unicode characters
export function isValidIcon(icon: string): boolean {
	return icon.length === 1;
}

// Must start with # and no "shorthand"
export function isValidColor(hexColor: string): boolean {
	return hexColor.length === 7;
}
