import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { AuthContext } from "../context";
import toast from "react-hot-toast";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!username || !username === ''){
      toast.error('Veuillez remplir tous les champs')
      return
    }
    setLoading(true);
    try {
      const res = await api.post("api/token/", {
        username,
        password,
      });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      try {
        const userRes = await api.get("api/user/");
        setUser(userRes.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur:",
          error,
        );
      }
      navigate("/", { replace: true });
    } catch (error) {
      toast.error('identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 md:mt-10 ">
        <legend className="fieldset-legend">Login</legend>

        <label className="label">Username</label>
        <input
          type="text"
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="minimun 4 caractères"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-warning mt-4" onClick={handleSubmit}>
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Se connecter"
          )}
        </button>
        <div className="flex">
          <span className="ml-45 mt-2 ">
            <Link to="/register">Create account</Link>
          </span>
        </div>
      </fieldset>
    </div>
  );
}

export default Login;
