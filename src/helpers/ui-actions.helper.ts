export const uiActions = {
	copy2clipboard: function (value: string[]) {
		const text = value.join(", ");
		// We need to create a temporary input with the keywords in it to be able to copy it from the DOM
		// And then delete it from the DOM
		const input = document.createElement("input");
		document.body.appendChild(input);
		input.value = text;
		input.select();
		document.execCommand("copy");
		input.remove();
	},
};
