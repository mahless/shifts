/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
        "./constants/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Cairo', 'sans-serif'],
            },
            safeArea: {
                'top': 'env(safe-area-inset-top)',
                'bottom': 'env(safe-area-inset-bottom)',
                'left': 'env(safe-area-inset-left)',
                'right': 'env(safe-area-inset-right)',
            }
        },
    },
    plugins: [],
}
