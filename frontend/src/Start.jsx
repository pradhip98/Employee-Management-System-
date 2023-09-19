import React from "react";
import { useNavigate } from "react-router-dom";

function Start() {
    const navigate = useNavigate()
      return (
    <div className="d-flex align-items-center justify-content-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm text-center">
        <h3>Login as</h3>
        <div className="d-flex justify-content-evenly mt-5 ">
          <button className="btn btn-primary btn-lg" onClick={e=>navigate(`/employeelogin`)}>Employee</button>
          <button className="btn btn-success btn-lg" onClick={e=>navigate(`/login`)}>Admin</button>
        </div>
      </div>
    </div>
  );
}

export default Start;
