// eslint-disable-next-line @typescript-eslint/no-explicit-any
type throttleFunction = (args: any) => void
export const throttle = (delay: number, fn: throttleFunction): throttleFunction => {
	let inDebounce = null;
	return (args) => {
		clearTimeout(inDebounce);
		inDebounce = setTimeout(() => fn(args), delay);
	};
};

export const highlight = (needle: string, haystack: string): string => {
	const result: string = haystack.replace(new RegExp(needle, 'gi'), (str) => `<em>${str}</em>`);
	if (result.includes("'")) return removeApostrophe(result);
	return result;
};

export const secToMins = (seconds: number): string => {
	const minutes: number = seconds / 60;
	const totMins: string = minutes.toFixed(2);
	const number = totMins.replace('.', ':');
	return number;
};
export const removeApostrophe = (input: string): string => {
	let output = input;
	if (input.includes("''")) output = input.replace("''", "'");
	return output.replace(
		new RegExp(
			/\b(?!(?:That's\b)|(?:didn't\b)|(?:I'm\b)|(?:doesn't\b)|(?:can't\b)|(?:won't\b)|(?:don't\b)|(?:I've\b)|(?:I'd\b)|(?:I'm\b)|(?:I'll\b)|(?:she's\b)|(?:he's\b)|(?:it's\b)|(?:there's\b)|(?:they're\b)|(?:we're\b)|(?:you've\b)|(?:you're\b)|(?:couldn't\b)|(?:shouldn't\b)|(?:wouldn't\b))(([a-z]+|\w)'[a-z]+)+/,
			'gi'
		),
		(str: string) => str.replace("'", '')
	);
};

export const randomQuery = [
	'santa man',
	'teaser freezer',
	'chef kevin',
	'moriarty',
	'scoop troop',
  'eggnog',
	'gmail roulette',
	'speak on that',
	'ice bucket challenge',
	'cards against humanity',
	'engineer cody boy',
	"i love you and i'm in love with you",
	'guardians of the galaxy',
	'teen pope',
	'bosch',
	'homemade water',
	'doughboys'
];
export const getRandomInt = (max: number): number => Math.floor(Math.random() * Math.floor(max));
