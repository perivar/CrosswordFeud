module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:jsx-a11y/recommended",
    "plugin:import/typescript", // extends the recommended import with typescript import/resolver support for .ts and .tsx
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  parserOptions: {
    // ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    // sourceType: "module", // Allows for the use of imports
    // ecmaFeatures: {
    //   jsx: true,
    // },
    project: "tsconfig.json",
    tsconfigRootDir: "ClientApp",
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y", "prettier"],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",

    // https://gist.github.com/1natsu172/a65a4b45faed2bd3fa74b24163e4256e

    /**
     * @description rules of @typescript-eslint
     */
    "@typescript-eslint/prefer-interface": "off", // also want to use "type"
    "@typescript-eslint/explicit-function-return-type": "off", // annoying to force return type
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/interface-name-prefix": "off", // off = disagree with TS team on usefulness
    "@typescript-eslint/no-explicit-any": "off", // off = I'm only allergic to implicit any
    "@typescript-eslint/explicit-member-accessibility": "off", // ok with implicit public
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-use-before-define": "off",

		// note you must disable the base rule as it can report incorrect errors
		"camelcase": "off",
		"@typescript-eslint/camelcase": ["error", { "properties": "never" }],

    /**
     * @description rules of eslint-plugin-react
     */
    "react/jsx-filename-extension": [
      "warn",
      {
        extensions: [".jsx", ".tsx"],
      },
    ], // also want to use with ".tsx"
    "react/prop-types": "off", // Is this incompatible with TS props type?
    "react/no-find-dom-node": "warn",
		"react/no-string-refs": "warn",
		"react/jsx-no-bind": "warn",

    /**
     * @description rules of eslint-plugin-react-hooks
     */
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    /**
     * @description rules of eslint-plugin-prettier
     */
    "prettier/prettier": [
      "error",
      {
				semi: true,
				"jsxBracketSameLine": true,
        trailingComma: "none",
        singleQuote: true,
        printWidth: 120,
        tabWidth: 2,
      },
		],
		
    /**
     * @description rules of eslint-plugin-jsx-a11y
     */
		"jsx-a11y/anchor-is-valid": [
			"error",
			{
					"components": [
							"Link"
					],
					"specialLink": [
							"to",
							"hrefLeft",
							"hrefRight"
					],
					"aspects": [
							"noHref",
							"invalidHref",
							"preferButton"
					]
			}
	]
  },
  settings: {
    react: {
      version: "16.8.6", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};
