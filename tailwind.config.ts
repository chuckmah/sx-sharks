import type { Config } from 'tailwindcss';

export default {
    content: ['./app/**/*.{js,jsx,ts,tsx}'],
    daisyui: {
        themes: ['dark'],
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
    darkMode: 'class',
    theme: {
        extend: {
            screen: {
                'max-md': { max: '767px' },
            },
        },
    },
} satisfies Config;
