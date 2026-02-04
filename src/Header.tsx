import {
  ColourSchemeButton,
  Navbar,
  NavLinks,
  NavLink,
  User,
} from "@diamondlightsource/sci-react-ui";
import { Box, Stack } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

const handleLogin = () => window.location.assign("/oauth2/sign_in");

const handleLogout = () => window.location.assign("/oauth2/sign_out");

export default function Header() {
  const user = useContext(UserContext);
  return (
    <Navbar
      logo="theme"
      containerWidth={false}
      rightSlot={
        <Stack direction="row" alignItems="center">
          <User
            color="white"
            onLogin={handleLogin}
            onLogout={handleLogout}
            user={
              user.person == null || user.person == undefined
                ? null
                : { fedid: user.person }
            }
          />
          <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            <ColourSchemeButton />
          </Box>
        </Stack>
      }
    >
      <NavLinks key="links">
        <NavLink to="/plans" key="plans" linkComponent={Link}>
          Plans
        </NavLink>
        <NavLink to="/submit" key="submit" linkComponent={Link}>
          Submit
        </NavLink>
        <NavLink to="/test" key="test" linkComponent={Link}>
          Test
        </NavLink>
      </NavLinks>
    </Navbar>
  );
}
