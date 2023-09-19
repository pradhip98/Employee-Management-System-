import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Employee() {
  const [data,setData] = useState([])
  useEffect(()=>{
    axios.get('http://localhost:5000/getEmployee')
    .then(res=>{
      if(res.data.Status === `Success`){
        setData(res.data.Result)
      }
      
    })
    .catch(err=>{
      console.log(err)
    })
  },[])

  
 const deleteEmployee = (id)=>{
    axios.delete("http://localhost:5000/delete/"+id)
    .then(res=>{
      if(res.data.Status === `Success`){
        window.location.reload(true)
      } 
    })
    .catch(err=>{
      console.log(err)
    })
  }
  return (
    <div className='px-5 py-3'>
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to='/create' className='btn btn-success'>Add Employee</Link>
      <div className="mt-3">
      <table className='table'>
        <thead>
          <th>Name</th>
          <th>Image</th>
          <th>Email</th>
          <th>Salary</th>
          <th>Address</th>
          <th>Action</th>
        </thead>
        <tbody>
            {data.map((result,index) =>{
              return( <tr key={index}>
                <td>{result.name}</td>
                <td>
                  <img src={`http://localhost:5000/images/`+result.image} alt={result.name+` image`} className='employee-image'/>
                </td>
                <td>{result.email}</td>
                <td>{result.salary}</td>
                <td>{result.address}</td>
                <td>
                  <Link to={`/employeeEdit/`+result.id} className='btn btn-sm btn-success me-2'>Edit</Link>
                  <button onClick={e=>deleteEmployee(result._id)} className='btn btn-sm btn-danger'>Delete</button>
                </td>
               </tr>)
            })}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Employee