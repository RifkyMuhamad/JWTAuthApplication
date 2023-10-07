import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorData, setErrorData] = useState("");

  const LoginEndPoint = "http://localhost:5000/login";

  const formData = {
    emailOrUsername: emailOrUsername,
    password: password,
  };

  const navigate = useNavigate();

  const auth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(LoginEndPoint, formData);
      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      const errorResponseData = error.response.data;
      setErrorData(errorResponseData);
      console.log(error.response.data);
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
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
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
                <div>
                  {errorData.msg ? (
                    Array.isArray(errorData.msg) ? (
                      errorData.msg.map((message, index) => (
                        <p key={index}>{message.messages}</p>
                      ))
                    ) : (
                      <p>{errorData.msg}</p>
                    )
                  ) : null}
                </div>
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
