import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
	base: 'https://raph.github.io/js-pool/',
})


/*
Signle page config

export default defineConfig({
	plugins: [ viteSingleFile() ],
})
*/