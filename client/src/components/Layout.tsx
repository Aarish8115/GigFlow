import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/WOBgGIgflow_1.png";
function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="w-full min-h-screen bg-primary">
      <div className="px-2 py-2">
        <header className="flex flex-col gap-4 bg-secondary py-6 rounded-md items-center justify-between px-4 sm:flex-row sm:gap-0 sm:px-16">
          <Link
            to="/"
            className="text-2xl font-bold text-primary uppercase flex gap-1 items-center justify-center sm:justify-start"
          >
            <img src={logo} alt="Logo" className="w-16" />
            GigFlow
          </Link>

          {user && (
            <nav className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <NavLink
                to="/"
                end
                className="bg-primary text-background font-normal text-base px-3 py-1.5 rounded-sm w-full text-center sm:w-auto"
              >
                Browse Gigs
              </NavLink>
              <NavLink
                to="/gigs/new"
                className="bg-primary text-background font-normal text-base px-3 py-1.5 rounded-sm w-full text-center sm:w-auto"
              >
                Post a Gig
              </NavLink>
            </nav>
          )}

          <div className="flex flex-wrap justify-center gap-4 items-center sm:justify-end">
            {user ? (
              <>
                <Link to={"/bids/me"} className="text-primary font-semibold">
                  {user.username}
                </Link>
                <button
                  onClick={logout}
                  className="bg-primary text-background font-normal text-base px-3 py-1.5 rounded-sm w-full text-center sm:w-auto"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-primary text-background font-normal text-base px-3 py-1.5 rounded-sm w-full text-center sm:w-auto"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-background font-normal text-base px-3 py-1.5 rounded-sm w-full text-center sm:w-auto"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </header>
      </div>
      <main className="bg-primary px-2 sm:px-0">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
