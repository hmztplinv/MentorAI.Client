/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // 'media' veya 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        therapist: {
          cbt: '#4F46E5',         // Bilişsel Davranışçı Terapi
          psychoanalytic: '#7C3AED', // Psikanalitik
          humanistic: '#10B981',    // Hümanistik
          existential: '#6366F1',   // Varoluşçu
          gestalt: '#EC4899',       // Gestalt
          act: '#8B5CF6',           // Kabul ve Kararlılık
          positive: '#F59E0B',      // Pozitif Psikoloji
          schema: '#EF4444',        // Şema
          solution_focused: '#14B8A6', // Çözüm Odaklı
          narrative: '#3B82F6',     // Naratif
          family_systems: '#6D28D9', // Aile Sistemleri
          dbt: '#D946EF',           // Diyalektik Davranış
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
}