import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EmployeeDetail() {
  const {id} = useParams();
  const [employee,setEmployee] =useState([])
  useEffect(()=>{
    axios.get(`http://localhost:5000/empdetails/`+id)
    .then(res=>setEmployee(res.data.Result[0]))
    .catch(err=>console.log(err))
  })
  const navigate = useNavigate()
  const handleLogout=()=>{
    axios.get(`http://localhost:5000/logout`)
    .then(res=>{
      navigate(`/start`)
    })
  }
      return (
   <div className="d-flex justify-content-center align-items-center flex-column mt-3">
    <img src={`http://localhost:5000/images/`+employee.image} className='w-25 rounded-circle' alt={employee.name+` image`}/>
    <div className='d-flex align-items-center flex-column'>
    <h3>{employee.name}</h3>
    <h3>{employee.email}</h3>
    <h3>{employee.salary}</h3>
    </div>
    <div>
      <button className="btn btn-primary me-4">Edit</button>
      <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
    </div>
   </div>
  )
}

export default EmployeeDetail