const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")
const empModel = require(`./model/employee`)
const adminModel = require(`./model/admin`)

const app = express();
app.use(cors(
    {
        origin: ["http://localhost:5173"],
        credentials: true,
        methods: [`POST`, `GET`, `PUT`, `DELETE`]
    }
))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(`public`))


mongoose.connect(`mongodb://127.0.0.1:27017/management`)
    .then(() => console.log(`connected`))
    .catch(err => console.log(err))


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join("public/images"))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

const verifyUser = (req, res, next) => {
    const token = res.cookie.token
    if (!token) return res.json({ Error: `You are not authenticated` })
     jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if(err) return res.json({ Error: `Token wrong` })
            req.role = decoded.role;
            req.id = decoded.id;
            next()
    })
}
app.post(`/employeelogin`, (req, res) => {
    empModel.find({ "email": req.body.email })
        .then((result, err) => {
            if (err) {
                return res.json({ Status: `error`, Error: `Error in connection` })
            }
            if (result.length > 0)
            {
                bcrypt.compare(req.body.password.toString(), result[0].password, (err,response) => {
                    if (err) {
                        return res.json({ Error: `error in password` })
                    }
                    const token = jwt.sign({ role: "employee", id: result[0]._id }, "jwt-secret-key", { expiresIn: "1d" })
                    res.cookie("token", token)
                    return res.json({ Status: `Success`, id: result[0]._id })
                })
            }
            else {
                return res.json({ Status: `error`, Error: `Wrong email or password` })
            }
        })
        .catch(err => console.log(err))
})
app.post(`/login`, (req, res) => {
    adminModel.find({ "email": req.body.email, "password": req.body.password })
        .then((result,err) => {
            if (err) {
                return res.json({ Status: `error`, Error: `Error in connection` })
            }
            else if (result.length > 0) {
                const token = jwt.sign({ role:"admin", id:result[0]._id }, "jwt-secret-key", { expiresIn: "1d" })
                res.cookie("token", token)
                return res.json({ Status:`Success`})
            }
            else {
                return res.json({ Status: `error`, Error: `Wrong email or password`})
            }
        })
        .catch(err => console.log(err))
})

app.get(`/logout`, (req, res) => {
    res.clearCookie("token");
    return res.json({ Status: `Success` })
})

app.get(`/dashboard`, verifyUser, (req,res) => {
   return res.json({Status:`Success`, role: req.role, id: req.id })
})

app.get(`/admincount`, (req, res) => {
    adminModel.find()
        .then((result,err) => {
            if (err) return res.json({ Error: `Error in running query` })
            return res.json({Status:`Success`,Result:result})
        })
        .catch(err => console.log(err))
})

app.get(`/empcount`, (req, res) => {
    empModel.find()
        .then((result, err) => {
            if (err) return res.json({ Error: `Error in running query` })
            else return res.json(result.length)
        })
        .catch(err => console.log(err))
})

app.get(`/salarycount`, (req, res) => {
    empModel.find()
        .then((result, err) => {
            if (err) return res.json({ Error: `Error in running query` })
            else {
                let salary = 0;
                for (let i of result) {
                    salary += Number(i.salary)
                }
                return res.json({Status:`Success`,Result:salary})
            }
        })
        .catch(err => console.log(err))
})
app.get(`/empdetails/:id`, (req, res) => {
    const id = req.params.id
    empModel.find({ "_id": id })
        .then((result, err) => {
            if (err) return res.json({ Error: `error in running query` })
            return res.json({ Status: `Success`, Result: result })
        })
        .catch(err => console.log(err))
})


app.get(`/get/:id`, (req, res) => {
    const id = req.params.id;
    empModel.findById(id)
        .then((result, err) => {
            if (err) {
                return res.json({ Error: `Error in sql` })
            }
            return res.json({ Status: `Success`, Result: result })
        })
        .catch(err=>console.log(err))
})
app.put(`/update/:id`, (req, res) => {
    const id = req.params.id;
    empModel.findByIdAndUpdate(id,{
        name:req.body.name,
        email:req.body.email,
        salary:req.body.salary,
        address:req.body.address
    }) 
    .then((result,err)=> {
        if (err) {
            return res.json({ Error: `Error in updating query` })
        }

        return res.json({ Status:`Success`})
    })
})
app.delete(`/delete/:id`, (req, res) => {
    const id = req.params.id;
    empModel.findByIdAndDelete(id)
        .then((result, err) => {
            if (err) {
                return res.json({ Error: `Error in deleting query` })
            }
            else {
                return res.json({ Status: `Success` })
            }
        })
        .catch(err => console.log(err))
})
app.get(`/getEmployee`, (req, res) => {
    empModel.find()
        .then((result, err) => {
            if (err) {
                return res.json({ Error: `Get employee error in mongoose` })
            }
            console.log(result)
            return res.json({ Status: `Success`, Result: result })
        })
        .catch(err => console.log(err))
})
app.post(`/create`, upload.single("image"), (req, res) => {

    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if (err) {
            return res.json({ Error: `Error in hasing password` })
        }

        const values = new empModel({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            salary: req.body.salary,
            address: req.body.address,
            image: req.file.filename
        })


        values.save()
            .then((err, result) => {
                if (err) return res.json({ Error: `Error in save` })
                console.log(`Data Saved`)
                return res.json({ Status: `Success` })
            })
            .catch(err => console.log(err.message))

    })
})

app.listen(5000, () => {
    console.log(`Server is Running`)
})