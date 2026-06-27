export const typography = {
  fontFamily: {
    display: "'Montserrat Alternates', sans-serif",
    heading: "'Montserrat', sans-serif",
    body: "'Mulish', sans-serif",
    sans: "'Mulish', system-ui, sans-serif",
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    hero: '5rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;
