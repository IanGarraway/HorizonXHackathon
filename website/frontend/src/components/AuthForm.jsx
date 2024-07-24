import AuthService from "../services/Auth.service.js";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function AuthForm({ setUser }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnIsDisabled, setBtnIsDisabled] = useState(true);
  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);

  const navigateTo = useNavigate();

  useEffect(() => {
    if (username && password) {
      setBtnIsDisabled(false);
    } else {
      setBtnIsDisabled(true);
    }
    setError("");
    setFormError({});
  }, [username, email, password]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(username, password);
      if (response.status == 200) {
        const userData = {
          username: response.data.username,
          loggedIn: true,
          ...(response.data.admin && { admin: true }),
        };
        setCookie("user", userData, { path: "/", maxAge: 86400 });
        setUser(userData);
        navigateTo("/");
      } else {
        setError(response.status);
      }

      //setHasCookie(true);
    } catch (error) {
      setError(error.message);
      setBtnIsDisabled(false);
    }
  };
  return (
    <div className="mt-8 max-w-md mx-auto">
      <form onSubmit={onSubmitHandler} className="grid grid-cols-1 gap-6 mb-5">
        <label htmlFor="email" className="block">
          <span className="text-gray-700">Email</span>
          <input
            type="text"
            name="username"
            id="username"
            autoComplete="username"
            placeholder="demoname"
            className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            // onBlur={validateEmail}
          />
          {formError.email && (
            <p className="text-red-700 border border-red-300 bg-red-50 text-center mx-auto rounded-xl py-2 my-2 w-full">
              {formError.email}
            </p>
          )}
        </label>
        <label htmlFor="password" className="block">
          <span>Password</span>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete={"current-password"}
            placeholder="password"
            className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            // onBlur={validatePassword}
          />
          {formError.password && (
            <p className="text-red-700 border border-red-300 bg-red-50 text-center mx-auto rounded-xl py-2 my-2 w-full">
              {formError.password}
            </p>
          )}
        </label>
        <button
          name="submit"
          disabled={btnIsDisabled}
          className="mx-auto w-1/3 py-2 border-2 border-fire bg-red-200/50 rounded-full hover:bg-red-400/50 active:bg-red-600/50 focus:outline-none focus:ring focus:ring-red-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed"
          type="submit"
        >
          Login
        </button>
        {error && (
          <p className="text-red-700 border border-red-300 bg-red-50 text-center mx-auto rounded-xl py-2 my-2 w-full">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
