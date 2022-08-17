/** @type {import('tailwindcss').Config} */
module.exports = {
   mode: "jit", // just in time mode (https://v2.tailwindcss.com/docs/just-in-time-mode)
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/client/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      source: "Source Code Pro, sans-serif",
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
    keyframes: {
      zoomOut: {
        '0%': { transform: 'scale(1,1)', color:"white" },
        '100%': { transform: 'scale(10,10)', color: "black"},
      },
      zoomIn: {
        '0%': { transform: 'scale(10,10)', color: "black"},
        '100%': { transform: 'scale(1,1)', color:"white" },
      },
    },
    animation: {
      'zoom-out': 'zoomOut 2s ease-in-out alternate',
      'zoom-in': 'zoomIn'
    },
  }},
  plugins: [],
}
