import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="w-full h-screen bg-primary">
      <div className="px-2 py-2">
        <header className="flex bg-secondary py-6 rounded-md items-center justify-between px-16 ">
          <Link to="/" className="text-2xl font-bold text-primary">
            GigFlow
          </Link>

          {user && (
            <nav className="flex gap-2">
              <NavLink
                to="/"
                end
                className="bg-primary  text-background font-normal text-base px-3 py-1.5 rounded-sm "
              >
                Browse Gigs
              </NavLink>
              <NavLink
                to="/gigs/new"
                className="bg-primary  text-background font-normal text-base px-3 py-1.5 rounded-sm "
              >
                Post a Gig
              </NavLink>
            </nav>
          )}

          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <span className="text-primary font-semibold">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="bg-primary  text-background font-normal text-base px-3 py-1.5 rounded-sm "
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-primary  text-background font-normal text-base px-3 py-1.5 rounded-sm "
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary  text-background font-normal text-base px-3 py-1.5 rounded-sm "
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </header>
      </div>
      <main className="bg-primary">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
