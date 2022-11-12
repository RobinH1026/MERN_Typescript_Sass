import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
const mysql = require("mysql");
const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")

dotenv.config();
if (!process.env.PORT) {
    process.exit(1);
}
 
const PORT: number = parseInt(process.env.PORT as string, 10);
 
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());


const db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.SQL_PORT ,
    sslmode : "REQUIRED"
})
db.getConnection( (err:any, connection:any)=> {
    if (err) throw (err)
        console.log ("DB connected successful: " + connection.threadId)
        let createTodos = `create table if not exists usertable(
            id int primary key auto_increment,
            user varchar(255)not null,
            email varchar(255)not null,
            password varchar(255)not null
        )`;

        connection.query(createTodos, function(err:any, results:any, fields:any) {
        if (err) {
        console.log(err.message);
        }
        });
})
app.post("/register", async (req,res) => {
    const user:string = req.body.username;
    const hashedPassword:string = await bcrypt.hash(req.body.password,10);
    const email:string =req.body.email;
    db.getConnection( async (err:any, connection:any) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM userTable WHERE email = ?"
        const search_query = mysql.format(sqlSearch,[email])
        const sqlInsert = "INSERT INTO userTable VALUES (0,?,?,?)"
        const insert_query = mysql.format(sqlInsert,[user, email, hashedPassword])
        await connection.query (search_query, async (err:any, result:any) => {
            if (err) throw (err)
            console.log("------> Search Results")
            console.log(result.length)
            if (result.length != 0) {
                connection.release()
                console.log("------> User already exists")
                res.sendStatus(409) 
            } 
            else {
                await connection.query (insert_query, (err:any, result:any)=> {
                    connection.release()
                    if (err) throw (err)
                    console.log ("--------> Created new User")
                    console.log(result.insertId)
                    res.sendStatus(201)
                })
            }
        })
    })
})

app.post("/login", async (req, res) => {
    const email:string =req.body.email;
    console.log(email);
    const password:string = req.body.password;
    db.getConnection( async (err:any, connection:any) => {
        if (err) throw (err)
        const sqlSearch = "SELECT password FROM userTable WHERE email = ?"
        const search_query = mysql.format(sqlSearch,[email])
        await connection.query (search_query, async (err:any, result:any) => {
            if (err) throw (err)
            // throw (
            //     res.sendStatus(500)
            // )
            console.log(result[0])
            if(!result.length){
                res.sendStatus(500)
            }
            else {
                console.log(result[0].password)
                const hashedPassword = result[0].password;
                const isValid = await bcrypt.compare(password, hashedPassword);
                if (isValid) {
                    console.log("------> login success!")
                    // res.sendStatus(201)
                    jwt.sign(
                        {email},
                        process.env.JWT_SECRET,
                        { expiresIn: 1200000 },
                        (err:any, token:any) => {
                          if (err) throw err;
                          res.json({ token });
                        }
                    );
                } else {
                    console.log ("--------> login fault!")
                    res.sendStatus(409)
                }
            }
        })
    })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});