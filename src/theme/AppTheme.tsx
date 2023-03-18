import { FC } from "react";
import { ThemeProvider } from "@emotion/react";

import CssBaseline from "@mui/material/CssBaseline";
import { ambarTheme } from "./";

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const AppTheme: FC<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={ambarTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
