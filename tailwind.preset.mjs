import plugin from 'tailwindcss/plugin';

// Shared design system for the website. Tailwind v4 loads this through @config.
export default {
  theme: {
    extend: {
      colors: {
        canvas: '#f9f8f5',
        ink: '#242a38',
        brand: '#6553a6',
        'brand-link': '#6952a6',
        'brand-label': '#7764ac',
        'brand-dot': '#a78be0',
        'brand-light': '#bca8f2',
        'surface-border': '#e8e5e4',
        'night-canvas': '#161b25',
        'night-ink': '#ebebf2',
        'night-surface': '#272c37',
        'night-border': '#414657',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      screens: {
        tablet: { max: '900px' },
        mobile: { max: '700px' },
      },
    },
  },
  plugins: [
    plugin(({ addComponents, theme }) => {
      addComponents({
        '.wrap': {
          width: 'min(1180px, calc(100% - 48px))',
          marginInline: 'auto',
          '@media (max-width: 700px)': { width: 'min(100% - 32px, 560px)' },
        },
        '.button': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          minHeight: '52px',
          padding: '0 24px',
          borderRadius: '16px',
          fontSize: '15px',
          fontWeight: '700',
          transition: 'transform .2s, box-shadow .2s',
          background: '#fff',
          border: `1px solid ${theme('colors.surface-border')}`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 28px #463e6540',
          },
          '@media (prefers-color-scheme: dark)': {
            '&:not(.button-primary)': {
              background: theme('colors.night-surface'),
              color: '#f2eff8',
              borderColor: theme('colors.night-border'),
            },
          },
        },
        '.button-primary': {
          color: '#fff',
          background: theme('colors.brand'),
          borderColor: theme('colors.brand'),
          boxShadow: '0 8px 20px #6553a62b',
        },
        '.button-small': {
          minHeight: '40px',
          padding: '0 17px',
          borderRadius: '12px',
          fontSize: '13px',
          gap: '10px',
        },
        '.eyebrow': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: theme('colors.brand-label'),
          textTransform: 'uppercase',
          letterSpacing: '.14em',
          fontWeight: '800',
          fontSize: '11px',
          '&::before': {
            content: '""',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: theme('colors.brand-dot'),
            boxShadow: '0 0 0 5px #e9e0fb',
          },
        },
        '.text-link': {
          color: theme('colors.brand-link'),
          fontWeight: '700',
          '&:hover': { textDecoration: 'underline' },
        },
      });
    }),
  ],
};
