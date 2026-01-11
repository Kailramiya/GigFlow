// Modern UI Theme - Professional and Clean Design
export const theme = {
  // Primary Colors - Blue gradient theme
  colors: {
    primary: '#4F46E5',      // Indigo
    primaryLight: '#6366F1',  // Light Indigo
    primaryDark: '#4338CA',   // Dark Indigo
    secondary: '#10B981',     // Emerald green
    secondaryLight: '#34D399',
    accent: '#F59E0B',        // Amber
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Neutrals
    white: '#FFFFFF',
    black: '#0F172A',
    gray: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    
    // Semantic colors
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      tertiary: '#94A3B8',
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  // Border radius
  borderRadius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  
  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Common component styles
export const commonStyles = {
  button: {
    base: {
      fontFamily: theme.typography.fontFamily.sans,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      padding: '0.625rem 1.25rem',
      borderRadius: theme.borderRadius.lg,
      border: 'none',
      cursor: 'pointer',
      transition: `all ${theme.transitions.base}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      boxShadow: theme.shadows.sm,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.white,
      boxShadow: theme.shadows.sm,
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primary}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.text.secondary,
    },
  },
  
  input: {
    base: {
      width: '100%',
      padding: '0.75rem 1rem',
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.sans,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.white,
      color: theme.colors.text.primary,
      transition: `all ${theme.transitions.fast}`,
      boxSizing: 'border-box',
    },
    focus: {
      outline: 'none',
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 3px ${theme.colors.primary}20`,
    },
    error: {
      borderColor: theme.colors.error,
    },
  },
  
  card: {
    base: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      boxShadow: theme.shadows.md,
      padding: theme.spacing.xl,
      border: `1px solid ${theme.colors.border}`,
      transition: `all ${theme.transitions.base}`,
    },
    hover: {
      boxShadow: theme.shadows.lg,
      transform: 'translateY(-2px)',
    },
  },
  
  badge: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      borderRadius: theme.borderRadius.full,
    },
    success: {
      backgroundColor: `${theme.colors.success}15`,
      color: theme.colors.success,
    },
    warning: {
      backgroundColor: `${theme.colors.warning}15`,
      color: theme.colors.warning,
    },
    error: {
      backgroundColor: `${theme.colors.error}15`,
      color: theme.colors.error,
    },
    info: {
      backgroundColor: `${theme.colors.info}15`,
      color: theme.colors.info,
    },
  },
};

export default theme;
