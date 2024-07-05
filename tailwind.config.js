/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
        fontFamily: {
            mono: ['monospace', 'Roboto', 'IBM Plex Sans', 'sans-serif'],
            system: ['system-ui', 'Roboto', 'IBM Plex Sans', 'sans-serif']
        }
    },
    plugins: []
}
