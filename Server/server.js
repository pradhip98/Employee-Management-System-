import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path"

const app = express();
app.use(cors(
    {
    origin:["http://localhost:5173"],
    credentials:true,
    methods:[`POST`,`GET`,`PUT`,`DELETE`]
}
))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(`public`))

const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"signup"
})

con.connect(function(err){
    if(err){
        console.log(`Error in Connection`,err)
    }
    else{
        console.log(`Connected`)
    }
})
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,path.join("public/images"))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
const verifyUser = (req,res,next)=>{
    const token = req .cookie.token;
    if(!token) return res.json({Error:`You are not authenticated`})
    else{
     jwt.verify(token,"jwt-secret-key",(err,decoded)=>{
        if(err) return res.json({Error:`Token wrong`})
        req.role = decoded.role;
        req.id= decoded.id;
        next()
   })
}
    
}
app.get(`/dashboard`,verifyUser,(req,res)=>{
   return res.json({Status:`Success`, role: req.role, id: req.id})
})

app.get(`/admincount`,(req,res)=>{
    const sql=`select count(id) as admin from users`
    con.query(sql,(err,result)=>{
        if(err) return res.json({Error:`Error in running query`})
        else return res.json(result)
    })
})
app.get(`/empcount`,(req,res)=>{
    const sql=`select count(id) as emp from employee`
    con.query(sql,(err,result)=>{
        if(err) return res.json({Error:`Error in running query`})
        else return res.json(result)
    })
})
app.get(`/salarycount`,(req,res)=>{
    const sql=`select sum(salary) as total from employee`
    con.query(sql,(err,result)=>{
        if(err) return res.json({Error:`Error in running query`})
        else return res.json(result)
    })
})
// app.get(`/empdetails/:id`,(req,res)=>{
//     const id= req.params.id
//     const sql= `select * from employee where id=?`
//     con.query(sql,[id],(err,result)=>{
//         if(err) return res.json({Error:`error in running query`})
//         return res.json({Status:`Success`,Result:result})
//     })
    
// })
app.post(`/employeelogin`,(req,res)=>{
    const sql="SELECT * FROM employee WHERE EMAIL=?";
    con.query(sql,[req.body.email],(err,result)=>{
        if(err){
           return res.json({Status:`error`,Error:`Error in connection`})
        }
        if(result.length > 0){
            bcrypt.compare(req.body.password.toString(),result[0].password,(err,response)=>{
              if(err){
                return res.json({Error:`error in password`})
                }
                const token = jwt.sign({role:"employee",id:result[0].id},"jwt-secret-key",{expiresIn:"1d"})
                res.cookie("token",token)
                return res.json({Status:`Success`,id:result[0].id})
            }
     )}
        else{
          return res.json({Status:`error`,Error:`Wrong email or password`}) 
        }
    });

})
app.post(`/login`,(req,res)=>{
    const sql="SELECT * FROM users WHERE EMAIL=? AND PASSWORD=?";
    con.query(sql,[req.body.email,req.body.password],(err,result)=>{
        if(err){
           return res.json({Status:`error`,Error:`Error in connection`})
        }
        if(result.length > 0){
            const token = jwt.sign({role:"admin",id:result[0].id},"jwt-secret-key",{expiresIn:"1d"})
            res.cookie("token",token)
            return res.json({Status:`Success`})
        }
        else{
          return res.json({Status:`error`,Error:`Wrong email or password`}) 
        }
    });

})

app.get(`/logout`,(req,res)=>{
    res.clearCookie(`token`);
    return res.json({Status:`Success`})
})

app.get(`/get/:id`,(req,res)=>{
    const id= req.params.id;
    const sql = `select * from employee where id= ?`
    con.query(sql,[id],(err,result)=>{
        if(err){
            return res.json({Error:`Error in sql`})
        }
        return res.json({Status:`Success`,Result:result})
    })
})
app.put(`/update/:id`,(req,res)=>{
    const id = req.params.id;
    const sql=`update employee set salary = ? where id =?`
    con.query(sql,[req.body.salary,id],(err,result)=>{
        if(err){
             return res.json({Error:`Error in updating query`})
        }
        return res.json({Status:`Success`})
    })
})
app.delete(`/delete/:id`,(req,res)=>{
    const id= req.params.id;
    const sql=`delete from employee where id =?`
    con.query(sql,[id],(err,result)=>{
        if(err){
            return res.json({Error:`Error in deleting query`})
        }
        else{
            return res.json({Status:`Success`})
        }
    })
    
})
app.get(`/getEmployee`,(req,res)=>{
    const sql = `select * from employee`
    con.query(sql,(err,result)=>{
        if(err){
           return res.json({Error: `Get employee error in sql`})}
        return res.json({Status:`Success`,Result:result})
    })
})
app.post(`/create`,upload.single("image"),(req,res) => {
    console.log(req.body)
    const sql="INSERT INTO `employee` (`name`,`email`,`password`,`salary`,`address`,`image`) VALUES (?)";

    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if (err) {
            return res.json({ Error: `Error in hasing password` })
        }
        
               const values = [
                req.body.name,
                req.body.email,
                hash,
                req.body.salary,
                req.body.address,
                req.file.filename
                ];

        con.query(sql,[values],(err,result)=>{
            if(err){
                return res.json({Error:`Inside sign up query`})
                
            }
            return res.json({Status:`Success`})
        });
        
    })
});
app.listen(5000, () => {
    console.log(`Server is Running`)
})