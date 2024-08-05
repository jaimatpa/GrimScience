import type { _primary } from '#tailwind-config/theme/colors'
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', ...defaultTheme.fontFamily.sans]
      },

      colors: {
// green: {
//         '50': '#edfff4',
//         '100': '#d6ffe7',
//         '200': '#afffd0',
//         '300': '#71ffad',
//         '400': '#2dfb82',
//         '500': '#02e561',
//         '600': '#00bf4d',
//         '700': '#00903d',
//         '800': '#067536',
//         '900': '#085f2e',
//         '950': '#003618',
//         'DEFAULT': '#00903d',
//     },
    



        'gms-primary': {
          '50': '#d3f9fa',
          '100': '#acf1f5',
          '200': '#73e5ed',
          '300': '#33cfdd',
          '400': '#17b3c3',
          '500': '#15889b',
          '600': '#15889b',
          '700': '#197485',
          '800': '#1d5e6d',
          '900': '#1c4e5d',
          '950': '#0d343f',
          'DEFAULT': '#15889b',
        },
        'gms-gray': {
          '50': '#f5f5f6',
          '100': '#e6e6e7',
          '200': '#cfcfd2',
          '300': '#aeb0b2',
          '400': '#818387',
          '500': '#6a6c70',
          '600': '#5b5c5f',
          '700': '#4d4e51',
          '800': '#444546',
          '900': '#3b3b3e',
          '950': '#252527',
          'DEFAULT': '#818387',
        },
        'gms-purple': {
          '50': '#fcf7fc',
          '100': '#f8eef9',
          '200': '#f1dbf3',
          '300': '#e8bfe8',
          '400': '#d999d8',
          '500': '#c570c5',
          '600': '#9b4b99',
          '700': '#8a4186',
          '800': '#72366f',
          '900': '#5e315a',
          '950': '#3c1639',
          'DEFAULT': '#9b4b99',
        },

        'gms-teal': {
          '50': '#eefdfc',
          '100': '#d3f9fa',
          '200': '#acf0f5',
          '300': '#73e5ed',
          '400': '#33cfdd',
          '500': '#17b2c3',
          '600': '#15889c',
          '700': '#197385',
          '800': '#1d5e6d',
          '900': '#1c4e5d',
          '950': '#0d333f',
          'DEFAULT': '#15889c',
        },
        'gms-blue': {
          '50': '#f1f7fe',
          '100': '#e1eefd',
          '200': '#bddcfa',
          '300': '#82bff7',
          '400': '#409ff0',
          '500': '#1784e0',
          '600': '#0a67bf',
          '700': '#09519b',
          '800': '#0d4c8b',
          '900': '#103b6a',
          '950': '#0b2546',
          'DEFAULT': '#0d4c8b',
        },
        'gms-pink': {
          '50': '#fcf4f4',
          '100': '#fae9ea',
          '200': '#f4d7d8',
          '300': '#ebb6b9',
          '400': '#df8d94',
          '500': '#d06370',
          '600': '#bf5163',
          '700': '#9c3448',
          '800': '#832e41',
          '900': '#712a3c',
          '950': '#3e131d',
          'DEFAULT': '#bf5163',
        }


      }
    }
  },

  options: {
    safelist: [
      'bg-green-200',
      'hover:bg-green-200',
    ],
  },

  // variants: {
  //   extend: {
  //     backgroundColor: ['hover'],
  //   },
  // }
  
}

