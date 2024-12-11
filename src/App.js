import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ViewActorByID from "./scenes/actors/ViewActorByID.jsx";
import { default as Actors } from "./scenes/actors/index.jsx";
import Approved from "./scenes/approved/index.jsx";
import Changepw from "./scenes/auth/changepw/index.jsx";
import Signup from "./scenes/auth/signup/Signup.jsx";
import AddNewBanner from "./scenes/changeBanner/AddNewBanner.jsx";
import EditBanner from "./scenes/changeBanner/EditBanner.jsx";
import ChangeBanner from "./scenes/changeBanner/index.jsx";
import ChangeContent from "./scenes/changeContent/index.jsx";
import Dashboard from "./scenes/dashboard";
import ViewDirectorByID from "./scenes/directors/ViewDirector.jsx";
import Directors from "./scenes/directors/index.jsx";
import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import EditPackages from "./scenes/packages/EditPckages.jsx";
import Packages from "./scenes/packages/index.jsx";
import ViewPending from "./scenes/pending/View.jsx";
import Pending from "./scenes/pending/index.jsx";
import ViewProducers from "./scenes/producer/ViewProducer.jsx";
import Producers from "./scenes/producer/index.jsx";
import PrivateRoutes from "./scenes/utils/PrivateRoutes.jsx";
import { ColorModeContext, useMode } from "./theme";
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<Signup />} />
              <Route element={<PrivateRoutes />}>
                <Route path="/dd" element={<Dashboard />} />
                <Route path="/changeContent" element={<ChangeContent />} />
                <Route path="/changeBanner" element={<ChangeBanner />} />
                <Route path="/editBanner/:id" element={<EditBanner />} />
                <Route path="/add-new-banner" element={<AddNewBanner />} />
                <Route path="/pending" element={<Pending />} />
                <Route path="/approved" element={<Approved />} />

                <Route path="/packages" element={<Packages />} />

                <Route
                  path="/subscription/edit/:id"
                  element={<EditPackages />}
                />

                <Route path="/actors" element={<Actors />} />
                <Route path="/directors" element={<Directors />} />
                <Route path="/director/:id" element={<ViewDirectorByID />} />
                <Route
                  path="/casting/pending/view/:id"
                  element={<ViewPending />}
                />
                <Route path="/user/:id" element={<ViewActorByID />} />
                <Route
                  path="/casting/pending/view/:id"
                  element={<ViewPending />}
                />
                <Route path="/producers" element={<Producers />} />
                <Route path="/producer/:id" element={<ViewProducers />} />

                <Route path="/changepw" element={<Changepw />} />
              </Route>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
