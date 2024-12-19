module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{svg,png,json,js}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};