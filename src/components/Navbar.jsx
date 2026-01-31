import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import api from "../api";
import { DollarSign } from "lucide-react";

function Navbar() {
  const { user, loading, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const Logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  if (loading) return <div>Chargement...</div>;
  return (
    <div className="navbar bg-transparent shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Manage Money</a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-dash">
            <div className="w-10 rounded-xl">
              {user ? (
                <div>
                  <h1 className="text-warning">{user.username.toUpperCase()}</h1>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <button onClick={Logout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
