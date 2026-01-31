import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!username || password === ''){
      toast.error('Veuillez remplir tous les champs')
      return
    }
    setLoading(true);

    try {
      const res = await api.post("api/register/", {
        username,
        password,
      });
      navigate("/login", {replace:true});
    } catch (error) {
      toast.error('Nom d\'utilisateur existant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 md:mt-30 mt-50">
        <legend className="fieldset-legend">Register please</legend>

        <label className="label">Nom d'utilisateur</label>
        <input
          type="text"
          className="input"
          placeholder="username"
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

        <button onClick={handleSubmit} className="btn btn-warning mt-4">
          {loading ? <span className="loading loading-spinner"></span>  : 'S\'enregistrer' }
        </button>
        <div className="flex">
          <span className="ml-30 mt-2 ">
            <Link to="/login">Vous avez un compte? Connectez-vous</Link>
          </span>
        </div>
      </fieldset>
    </div>
  );
}

export default Register;
