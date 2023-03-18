import { createTheme } from "@mui/material";
import { red, amber, green } from "@mui/material/colors";

export const ambarTheme = createTheme({
  palette: {
    primary: {
      main: "#262254",
    },
    secondary: {
      main: "#543884",
    },
    error: {
      main: red.A400,
    },
  },
});
