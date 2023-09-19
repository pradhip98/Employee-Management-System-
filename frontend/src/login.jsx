import React,{useState} from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  let[value,setValue] = useState({
    email:``,
    password:``,
  })
  axios.defaults.withCredentials = true;
  let[error,setError] = useState(``)
  let navigate = useNavigate()

 const handleSubmit=(event)=>{
     event.preventDefault();
     axios.post("http://localhost:5000/login",value)
     .then((res)=>{
      console.log(res)
      if(res.data.Status === `Success`){
         navigate(`/`); 

      }
      else{
        setError(res.data.Error)
      }
     })
     .catch(err=>console.log(err));

    }
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <div className="text-danger h6 text-center">
          {error && error}
        </div>
        <h3 className="text-center">Login</h3>
        <form action="" onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control mt-1 rounded-0"
              placeholder="Enter your Email"
              name="email" onChange={e => setValue({...value,email:e.target.value})}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control mt-1 rounded-0"
              placeholder="Enter the Password"
              name="password" onChange={e => setValue({...value,password:e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0 ">
            Submit
          </button>
          <div className="d-flex align-items-center justify-content-center">
            <input type="checkbox" name="" />
            <p className="my-1 mx-2">You agree to our terms and Policies</p>
          </div>
         
          <button className="btn btn-secondary rounded-0 border w-100 disabled">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
export default Login;
