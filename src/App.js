import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ViewActorByID from "./scenes/actors/ViewActorByID.jsx";
import { default as Actors } from "./scenes/actors/index.jsx";
import Changepw from "./scenes/auth/changepw/index.jsx";
import Signup from "./scenes/auth/signup/Signup.jsx";
import AddNewBlog from "./scenes/blogs/AddNewBlogs.jsx";
import EditBlog from "./scenes/blogs/EditBlogs.jsx";
import ViewBlogById from "./scenes/blogs/ViewBlogById.jsx";
import Blogs from "./scenes/blogs/index.jsx";
import AddCoupon from "./scenes/coupon/AddNewCoupon.jsx";
import EditCoupon from "./scenes/coupon/EditCouponByID.jsx";
import ViewCoupon from "./scenes/coupon/ViewCouponById.jsx";
import Coupon from "./scenes/coupon/index.jsx";
import Dashboard from "./scenes/dashboard";
import EditAdminDetails from "./scenes/dashboard/EditAdminDetails.jsx";
import ViewDirectorByID from "./scenes/directors/ViewDirector.jsx";
import Directors from "./scenes/directors/index.jsx";
import ViewFeedbackByID from "./scenes/feedbacks/ViewFeedbacksById.jsx";
import Feedback from "./scenes/feedbacks/index.jsx";
import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import AddPackages from "./scenes/packages/AddPackages.jsx";
import EditPackages from "./scenes/packages/EditPckages.jsx";
import Packages from "./scenes/packages/index.jsx";
import ViewPaymentDetails from "./scenes/payments/ViewPaymentById.jsx";
import Payments from "./scenes/payments/index.jsx";
import ViewPending from "./scenes/pending/View.jsx";
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
                <Route path="/blog" element={<Blogs />} />
                <Route path="/addNewBlog" element={<AddNewBlog />} />
                <Route path="/viewBlog/:id" element={<ViewBlogById />} />
                <Route path="/editBlog/:id" element={<EditBlog />} />

                <Route path="/packages" element={<Packages />} />

                <Route path="/payments" element={<Payments />} />
                <Route
                  path="/payment/viewpayment/:id"
                  element={<ViewPaymentDetails />}
                />

                <Route path="/feedback" element={<Feedback />} />
                <Route path="/feedback/:id" element={<ViewFeedbackByID />} />

                <Route
                  path="/subscription/edit/:id"
                  element={<EditPackages />}
                />
                <Route path="/subscription/add" element={<AddPackages />} />

                <Route path="/coupons" element={<Coupon />} />
                <Route path="/coupon/view/:id" element={<ViewCoupon />} />
                <Route path="/coupon/edit/:id" element={<EditCoupon />} />
                <Route path="/coupon/add" element={<AddCoupon />} />

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
                <Route
                  path="/editAdminDetails"
                  element={<EditAdminDetails />}
                />
              </Route>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
