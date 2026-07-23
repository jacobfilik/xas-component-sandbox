import {
  ThemeProvider,
  DiamondDSTheme,
  Footer,
} from "@diamondlightsource/sci-react-ui";
import { CssBaseline, Stack } from "@mui/material";
import TestComponent from "./TestComponent";
import { Route, Routes } from "react-router-dom";
import PlanPage from "./PlanPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SubmitPage from "./SubmitPage";
import HomePage from "./HomePage";
import { UserProvider } from "./UserContext";
import Header from "./Header";
import RequireAuth from "./RequireAuth";
import DevicePage from "./DevicePage";
import TaskPage from "./TaskPage";
import CustomPlanPage from "./CustomPlanPage";
import BlueapiResources from "./BlueapiResources";
import RunViewPage from "./RunViewPage";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={DiamondDSTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Stack height="100vh" width="100vw" spacing={1}>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/plans"
                element={
                  <RequireAuth>
                    <PlanPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/devices"
                element={
                  <RequireAuth>
                    <DevicePage />
                  </RequireAuth>
                }
              />
              <Route
                path="/tasks"
                element={
                  <RequireAuth>
                    <TaskPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/submit"
                element={
                  <RequireAuth>
                    <SubmitPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/blueapiresources"
                element={
                  <RequireAuth>
                    <BlueapiResources />
                  </RequireAuth>
                }
              />
              <Route
                path="/customplan"
                element={
                  <RequireAuth>
                    <CustomPlanPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/runs"
                element={
                  <RequireAuth>
                    <RunViewPage />
                  </RequireAuth>
                }
              />
              <Route path="/test" element={<TestComponent />} />
            </Routes>
            <Footer copyright="Diamond Light Source" />
          </Stack>
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
