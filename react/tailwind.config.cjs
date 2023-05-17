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
            boxShadow: {
                '2xl': 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
              }
        },
       
    },
    plugins: [
        require('flowbite/plugin')
    ],
};
