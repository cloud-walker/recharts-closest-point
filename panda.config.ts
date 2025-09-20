import {defineConfig} from '@pandacss/dev'

export default defineConfig({
	// Whether to use css reset
	preflight: true,
	strictPropertyValues: true,
	strictTokens: true,
	validation: 'error',
	jsxFramework: 'react',
	jsxStyleProps: 'minimal',
	outExtension: 'js',

	// Where to look for your css declarations
	include: ['./src/**/*.{ts,tsx}'],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {},
	},

	// importMap: {
	// 	css: '#/system/css',
	// 	jsx: '#/system/jsx',
	// 	patterns: '#/system/patterns',
	// 	recipes: '#/system/recipes',
	// },

	// The output directory for your css system
	outdir: 'styled-system',
})
