import { BrowserRouter, unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { isNative } from "./platform";
import { createNativeHistory } from "./transitions";

// In the app, route changes animate as native page transitions (see transitions.js).
const nativeHistory = isNative ? createNativeHistory() : null;

export const AppRouter = ({ children }) =>
  isNative ? (
    <HistoryRouter history={nativeHistory} useTransitions={false}>
      {children}
    </HistoryRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );

export default AppRouter;
