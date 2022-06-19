import {ViewStyle, TextStyle, ImageStyle} from 'react-native';
import {
  BaseTheme,
  createBox,
  createText,
  createTheme,
  useTheme as useReTheme,
} from '@shopify/restyle';

const palette = {
  purpleLight: '#8C6FF7',
  purplePrimary: '#5A31F4',
  purpleDark: '#3F22AB',

  greenLight: '#56DCBA',
  greenPrimary: '#0ECD9D',
  greenDark: '#0A906E',

  black: '#0B0B0B',
  white: '#F0F2F3',

  default: '#0C0D34',
};

export const theme: BaseTheme = createTheme({
  colors: {
    mainBackground: palette.white,
    cardPrimaryBackground: palette.purplePrimary,
    primary: palette.default,
    secondary: '#2CB9B0',
    danger: '#FF0058',
    text: 'rgba(12,12,52,0.5)',
    white: 'white',
    grey: '#F4F0EF',
    darkGrey: '#8A8D90',
    orange: '#FE5E33',
    yellow: '#FFC641',
    pink: '#FF87A2',
    violet: '#442CB9',
    lightGrey: '#FAFAFA',
    lightBlue: '#BFEAF5',
    black: palette.black,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xm: 54,
    xl: 75,
  },
  borderRadii: {
    s: 4,
    m: 10,
    l: 25,
    xl: 75,
  },
  breakpoints: {},
  none: {
    display: 'none',
  },
  textVariants: {
    hero: {
      fontSize: 80,
      lineHeight: 80,
      fontFamily: 'SFProText-Bold',
      color: 'white',
      textAlign: 'center',
    },
    title: {
      fontSize: 28,
      fontFamily: 'SFProText-Semibold',
      color: 'primary',
    },
    title1: {
      fontSize: 24,
      lineHeight: 30,
      fontFamily: 'SFProText-Bold',
      color: 'primary',
    },
    title2: {
      fontSize: 24,
      lineHeight: 30,
      fontFamily: 'SFProText-Semibold',
      color: 'primary',
    },
    title3: {
      fontSize: 20,
      lineHeight: 30,
      fontFamily: 'SFProText-Semibold',
      color: 'primary',
    },

    body: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'SFProText-Regular',
      color: 'text',
    },
    button: {
      fontSize: 15,
      fontFamily: 'SFProText-Medium',
      color: 'text',
      textAlign: 'center',
    },
    header: {
      fontSize: 12,
      lineHeight: 24,
      fontFamily: 'SFProText-Semibold',
      color: 'primary',
    },
    none: {
      display: 'none',
    },
  },
});

export type Theme = typeof theme;
export const Text = createText<Theme>();
export const Box = createBox<Theme>();
export const useTheme = () => useReTheme<Theme>();
type NamedStyles<T> = {[P in keyof T]: ViewStyle | TextStyle | ImageStyle};

export const makeStyles =
  <T extends NamedStyles<T>>(styles: (theme: Theme) => T) =>
  () => {
    const currentTheme = useTheme();
    return styles(currentTheme);
  };
