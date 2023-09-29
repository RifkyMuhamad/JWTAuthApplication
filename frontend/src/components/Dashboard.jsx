import { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expToken, setExpToken] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    refreshToken();
    getUsers();
  }, []);

  const navigate = useNavigate();

  const tokenEndPoint = "http://localhost:5000/token";
  const usersEndPoint = "http://localhost:5000/users";

  const refreshToken = async () => {
    try {
      const response = await axios.get(tokenEndPoint);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.userName);
      setExpToken(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expToken * 1000 < currentDate.getTime()) {
        const response = await axios.get(tokenEndPoint);
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.userName);
        setExpToken(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getUsers = async () => {
    const response = await axiosJWT.get(usersEndPoint, {
      headers: {
        Authorization: `Beared ${token}`,
      },
    });
    setUsers(response.data);
    console.log(response.data);
  };

  return (
    <div className="container mt-5">
      <h1>Welcome : {name}</h1>
      <button onClick={getUsers} className="button is-info">
        Get Users
      </button>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((users, index) => (
            <tr key={users.id}>
              <th>{index + 1}</th>
              <th>{users.name}</th>
              <th>{users.email}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
