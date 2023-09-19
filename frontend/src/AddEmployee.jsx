import React,{useEffect, useState}from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";


function AddEmployee() {
    const[data,setData] = useState({
        name:"",
        email:"",
        password:"",
        salary:"",
        address:"",
        image:"",
    })
    
    // let data = JSON.stringify({data});
    const navigate = useNavigate()

    const handleSubmit=(event) =>{
        event.preventDefault();
        const formData = new FormData;
        formData.append("name",data.name)
        formData.append("email",data.email)
        formData.append("password",data.password)
        formData.append("salary",data.salary)
        formData.append("address",data.address)
        formData.append("image",data.image)

       axios.post("http://localhost:5000/create",formData)
            .then(res=>{
              navigate(`/employee`)              
            })
            .catch(err=>
                {
                    console.log(err);
                })
       
        }
  return (
    <div className='d-flex align-items-center flex-column pt-5'>
    <h2>Add Employee</h2>
    <form onSubmit={handleSubmit} className="row g-3 w-50">
    <div className="col-12">
            <label htmlFor="inputName" className="form-label">Name</label>
            <input type="text" className="form-control" id='inputName' 
            onChange={e=>setData({...data,name:e.target.value})}/>
        </div>
        <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">Email</label>
            <input type="text" className="form-control" id='inputEmail4' 
            onChange={e=>setData({...data,email:e.target.value})}/>
        </div>
        <div className="col-12">
            <label htmlFor="inputPassword4" className="form-label">Password</label>
            <input type="password" className="form-control" id='inputPassword4' 
            onChange={e=>setData({...data,password:e.target.value})}/>
        </div>
        <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">Salary</label>
            <input type="text" className="form-control" id='inputSalary' 
            onChange={e=>setData({...data,salary:e.target.value})}/>
        </div>
        <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">Address</label>
            <input type="text" className="form-control" id='inputAddress' 
            onChange={e=>setData({...data,address:e.target.value})}/>
        </div>
        <div className="col-12">
            <label htmlFor="inputGroupFile01" className="form-label">Select Image</label>
            <input type="file" className="form-control" id='inputGroupFile01'
            onChange={e=>setData({...data,image:e.target.files[0]})}/>
        </div>
        <div className="col-12">
            <button type='submit' className='btn btn-primary'>Create</button>
        </div>
    </form>
    </div>
  )
}

export default AddEmployee