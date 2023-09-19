import React,{useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


function EmployeeEdit() {
  const [data, setData] = useState({
    name: "",
    email: "",
    salary: "",
    address: "",
  });
  const navigate = useNavigate();

  const {id} = useParams();
  useEffect(()=>{
    axios.get('http://localhost:5000/get/'+id)
    .then(res =>{
      console.log(res)
        setData({...data,
            name:res.data.Result.name,
            email:res.data.Result.email,
            salary:res.data.Result.salary,
            address:res.data.Result.address,
        })
    })
  .catch(err=>console.log(err));
  },[])

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.put("http://localhost:5000/update/"+id,data)
      .then((res) => {
        if(res.data.Status === `Success`){
            navigate(`/employee`);
        }
     })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="d-flex align-items-center flex-column pt-5">
      <h2>Update Employee</h2>
      <form onSubmit={handleSubmit} className="row g-3 w-50">
        <div className="col-12">
          <label htmlFor="inputName" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            onChange={(e) => setData({ ...data, name: e.target.value })}
            value={data.name}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputEmail4" className="form-label">
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            value={data.email}
          />
        </div>
         <div className="col-12">
          <label htmlFor="inputSalary" className="form-label">
            Salary
          </label>
          <input
            type="text"
            className="form-control"
            id="inputSalary"
            onChange={(e) => setData({ ...data, salary: e.target.value })}
            value={data.salary}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputAddress" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            onChange={(e) => setData({ ...data, address: e.target.value })}
            value={data.address}
          />
        </div>
         <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeEdit;
