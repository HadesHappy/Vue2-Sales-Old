export const getLocalStorageItem = (name: string): string | null => {
	return localStorage.getItem(name);
};

export const setLocalStorageItem = (name: string, value: string) => {
	localStorage.setItem(name, value);
};

export const getParsedLocalStorageItem = (name: string): string | null => {
	const property = getLocalStorageItem(name);
	if (property) {
		return JSON.parse(property);
	}
	return null;
};
