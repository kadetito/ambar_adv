import { ApplicationRouter } from "./router/ApplicationRouter";
import { AppTheme } from "./theme";

export const BasePattern = () => {
  return (
    <AppTheme>
      <ApplicationRouter />
    </AppTheme>
  );
};
