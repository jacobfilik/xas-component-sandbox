import {
  ThemeProvider,
  DiamondTheme,
  Footer,
  Navbar,
  NavLinks,
  NavLink,
  ColourSchemeButton,
} from "@diamondlightsource/sci-react-ui";
import { CssBaseline, Stack } from "@mui/material";
import TestComponent from "./TestComponent";

function App() {
  return (
    <ThemeProvider theme={DiamondTheme}>
      <CssBaseline />
      <Stack height="100vh" width="100vw" spacing={1}>
        <Navbar
          logo="theme"
          containerWidth={false}
          rightSlot={<ColourSchemeButton />}
        >
          <NavLinks key="links">
            <NavLink href="#" key="first">
              A link
            </NavLink>
          </NavLinks>
        </Navbar>
        <TestComponent />
        <Footer copyright="Diamond Light Source" />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
