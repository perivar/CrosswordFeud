// .prettierrc.js
module.exports = {
	semi: true,
	jsxBracketSameLine: true,	
	trailingComma: 'none',
	singleQuote: true,
	printWidth: 120,
	tabWidth: 2,
	overrides: [
		{
				files: "*.scss",
				options: {
						tabWidth: 4
				}
		}
	]
};
