import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [state, setState] = useState("Sign Up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Sign Up") {
        // Register / Sign Up API
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password
        });

        if (data?.success) {
          localStorage.setItem("token", data?.token);
          setToken(data?.token);
        } else {
          toast.error(data?.message);
          console.log("Register Error: ", data?.message);
        }
      } else {
        // Login API
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password
        });

        if (data?.success) {
          localStorage.setItem("token", data?.token);
          setToken(data?.token);
        } else {
          toast.error(data?.message);
          console.log("Login Error: ", data?.message);
        }
      }
    } catch (err) {
      console.log("Error from Register/login in Login.jsx", err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      console.log("redirect to last page");
      console.log("location ", location);
      // go to the last page you were before you try to access this page
      navigate(location.state?.from?.pathname || "/");
    }
  }, [location, navigate, token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "sign up" : "log in"} to book
          appointment
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              type="text"
              className="border border-zinc-300 rounded w-full p-2 mt-1 outline-none"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            className="border border-zinc-300 rounded w-full p-2 mt-1 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            className="border border-zinc-300 rounded w-full p-2 mt-1 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          {state === "Sign Up" ? "sign up" : "log in"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account ?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
}

export default Login;
