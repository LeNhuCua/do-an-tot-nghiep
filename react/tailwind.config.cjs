/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
    
    theme: {
        extend: {
            colors: {
                "yellow-400": "#FED700",
                "gray-400":  "#5B5B5B",
                "gray-300" : "#D6D6D6",
                "gray-200": "#f1f1f1",
                "gray-100" : "#F0F0F0",
                "red-400": "#CF5050",
                "orange-400" : "#F19708",
            },
        },
    },
    plugins: [
        require('flowbite/plugin')
    ],
};
