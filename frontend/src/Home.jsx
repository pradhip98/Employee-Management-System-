import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [admin, setAdmin] = useState([]);
  const [employee, setEmployee] = useState();
  const [salary, setSalary] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:5000/admincount")
      .then((res) => {
        if (res.data.Status === `Success`) {
          setAdmin(res.data.Result);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5000/empcount")
      .then((res) => {
        setEmployee(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5000/salarycount")
      .then((res) => {
        setSalary(res.data.Result);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <div className="p-3 d-flex justify-content-around">
        <div className="px-3 pb-3 pt-2 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Admin</h4>
          </div>
          <hr />
          <div><h5>Total: {admin.length}</h5></div>
        </div>
        <div className="px-3 pb-3 pt-2 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Employee</h4>
          </div>
          <hr />
          <div>
            <h5>Total: {employee}</h5>
          </div>
        </div>
        <div className="px-3 pb-3 pt-2 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Salary</h4>
          </div>
          <hr />
          <div>
            <h5>Total: {salary}</h5>
          </div>
        </div>
      </div>
      {/*Number of admins*/}
      <div className="mt-4 px-5 pt-3">
        <h3>List of Admins</h3>
        <table className="table">
          <thead>
            <th>Email</th>
          </thead>
          <tbody>
            {admin.map((result) => {
              return (
                <tr>
                  <td>{result.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
