import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const loginEndPoint = "http://localhost:5000/login";

  const formData = {
    email: email,
    password: password,
  };

  const auth = async (e) => {
    e.preventDefault();
    try {
      await axios.post(loginEndPoint, formData);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop">
              <form className="box" onSubmit={auth}>
                <div className="field mt-5">
                  <label className="label" htmlFor="emailInput">
                    Email or Username
                  </label>
                  <div className="controls">
                    <input
                      type="text"
                      id="emailInput"
                      className="input"
                      placeholder="Username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field mt-5">
                  <label className="label" htmlFor="passwordInput">
                    Password
                  </label>
                  <div className="controls">
                    <input
                      type="password"
                      id="passwordInput"
                      className="input"
                      placeholder="******"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <p className="has-text-centered">{msg}</p>
                <div className="field mt-5">
                  <button className="button is-success is-fullwidth">
                    Login
                  </button>
                </div>
              </form>
              <div>
                <Link to={"http://localhost:5173/register"}> Register?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
