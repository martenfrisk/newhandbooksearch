// const lines = require('./src/assets/hhlinesdump.json');
// const fs = require('fs');
const { MeiliSearch } = require('meilisearch');
(async () => {
	const client = new MeiliSearch({
		host: 'https://meili-router-zraqvc5gd4kituxj-gtw.qovery.io',
		apiKey: 'masterKey'
	});
	// client.index('handbook').updateSettings({
	// 	searchableAttributes: ['title', 'description', 'genre']
	// });

	const meili = client.index('handbook');
	for (let index = 1; index < 13; index++) {
		const line = require(`./hhlines3/${index}.json`);
		let response = await meili.addDocuments(line);
		console.log(response);
	}
})();

// const anotherFlatten = (obj) => {
// 	let output = obj.line;
// 	if (output.includes("''")) output = output.replace("''", "'");
// 	return output.replace(
// 		new RegExp(
// 			/\b(?!(?:That's\b)|(?:didn't\b)|(?:I'm\b)|(?:doesn't\b)|(?:can't\b)|(?:won't\b)|(?:don't\b)|(?:I've\b)|(?:I'd\b)|(?:I'm\b)|(?:I'll\b)|(?:she's\b)|(?:he's\b)|(?:it's\b)|(?:there's\b)|(?:they're\b)|(?:we're\b)|(?:you've\b)|(?:you're\b)|(?:couldn't\b)|(?:shouldn't\b)|(?:wouldn't\b))(([a-z]+|\w)'[a-z]+)+/,
// 			'gi'
// 		),
// 		(str) => str.replace("'", '')
// 	).replace(
// 		new RegExp(
// 			/\s'/, 'gi'
// 			),
// 			(str) => str.replace("'", '')
// 	);
// }

// const newFlatten = (obj) => {
// 	const output = obj._source.text
// 		.replace("''", "'")
// 		.replace(
// 			new RegExp(
// 				/\b(?!(?:That's\b)|(?:didn't\b)|(?:I'm\b)|(?:doesn't\b)|(?:can't\b)|(?:won't\b)|(?:don't\b)|(?:I've\b)|(?:I'd\b)|(?:I'm\b)|(?:I'll\b)|(?:she's\b)|(?:he's\b)|(?:it's\b)|(?:there's\b)|(?:they're\b)|(?:we're\b)|(?:you've\b)|(?:you're\b)|(?:couldn't\b)|(?:shouldn't\b)|(?:wouldn't\b))(([a-z]+|\w)'[a-z]+)+/,
// 				'gi'
// 			),
// 			(str) => str.replace("'", '')
// 		)
// 		.replace(new RegExp(/\s'/, 'gi'), (str) => str.replace("'", ''));
// 	return {
// 		id: obj.id,
// 		index: obj._index,
// 		podcast: 'Hollywood Handbook',
// 		episode: obj._source.Episode,
// 		line: output,
// 		speaker: obj._source.speaker,
// 		timeCode: obj._source.startTime,
// 		tags: obj._source.tags
// 	};
// };

// let items = [],
// 	suffix = 1;
// lines.forEach((line, index) => {
// 	items.push(newFlatten(line));
// 	if (index % 100 === 0) {
// 		fs.writeFileSync('hhlines2/' + suffix + '.json', JSON.stringify(items));
// 		console.log(`Saved file ${suffix}`)
// 		suffix++;

// 		items = [];
// 	}
// });

// for (let index = 1; index < 13; index++) {
// 	const line = require(`./hhlines3/${index}.json`);
// 	console.log(`loaded file ${index}`)
// 	line.forEach((el) => {
// 		if (items.length % 100 === 0) {
// 			fs.writeFileSync('hhlines4/' + suffix + '.json', JSON.stringify(items));
// 			console.log(`Saved file ${suffix}`);
// 			suffix++;
	
// 			items = [];
// 		}
// 		const newLine = el.line.replace("''", "'")
// 		const newObj = {
// 			line: newLine,
// 			...el
// 		};
// 		items.push(newObj);
// 	});
// }
