import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import GigDetailPage from "./pages/GigDetailPage";
import GigsPage from "./pages/GigsPage";
import LoginPage from "./pages/LoginPage";
import NewGigPage from "./pages/NewGigPage";
import RegisterPage from "./pages/RegisterPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <GigsPage /> },
      { path: "gigs/:gigId", element: <GigDetailPage /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: "gigs/new", element: <NewGigPage /> }],
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);

function App() {
  return <RouterProvider  router={router} />;
}

export default App;
