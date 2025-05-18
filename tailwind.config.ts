// tailwind.config.js o tailwind.config.ts
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'media', // Questa è la chiave!
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                background: 'var(--color-background)',
                accent: 'var(--color-accent)',
                foreground: 'var(--color-foreground)',
            }
        },
    },
    plugins: [],
};