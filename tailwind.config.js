module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        textColor: '#4611a7',
        bgColor: '#4611a7',
        bgColorHo: '#7133e2'
      },
      fontFamily: {
        'nanumGothicBold':['NanumBarunGothicBold'],
      }
},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
