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
        <NavLink to="/customplan" key="customplan" linkComponent={Link}>
          Custom Plan
        </NavLink>
        <NavLink
          to="/blueapiresources"
          key="blueapiresources"
          linkComponent={Link}
        >
          Blueapi
        </NavLink>
        <NavLink to="/submit" key="submit" linkComponent={Link}>
          Submit JSON
        </NavLink>
        <NavLink to="/runs" key="rubs" linkComponent={Link}>
          View Runs
        </NavLink>
      </NavLinks>
    </Navbar>
  );
}
