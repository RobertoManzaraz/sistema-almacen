/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                zinc: {
                    50: '#f6f6f7',
                    100: '#e5e5e7',
                    200: '#c7c7cc',
                    300: '#a1a1a6',
                    400: '#8e8e93',
                    450: '#7c7c80',
                    500: '#636366',
                    550: '#48484a',
                    600: '#3a3a3c',
                    650: '#2c2c2e',
                    700: '#242426',
                    750: '#1c1c1e',
                    800: '#141416',
                    850: '#0e0e10',
                    900: '#09090a',
                    950: '#040405',
                },
                red: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    450: '#ef4444',
                    500: '#e50914', // Vibrant premium red
                    600: '#b80710',
                    650: '#91050a',
                    700: '#730408',
                    800: '#550205',
                    900: '#380103',
                    950: '#1e0002', // Deep wine background
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
};
