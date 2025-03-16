"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import PropTypes from 'prop-types';

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider {...props} enableSystem>
      {children}
    </NextThemesProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  attribute: PropTypes.string.isRequired,
  defaultTheme: PropTypes.string.isRequired,
  enableSystem: PropTypes.bool.isRequired,
};