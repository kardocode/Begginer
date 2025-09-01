const express = require("express");
const app = express();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";

const userData =[
    {username: 'shiva@gmail.com',password: 'pass'},
    {username: 'gaur@gmail.com',password: 'pass'}
];

function userExist(username,password){
    // write logic to return true or false if this user exist in ALL_users array.
    for(let i = 0;i<userData.length;i++){
        if(userData[i].username===username && userData[i].password ===  password ){
            return true;
        }
    }
    return false;
}

app.use(express.json())
app.post("/signin",(req,res)=>{
    // returns a json web token with username encrypted
    const {username,password} = req.body;
    const signinSchema = zod.object({
        username : zod.string().email(),
        password : zod.string().min(4),
    });
    const validatesignin = signinSchema.safeParse({username,password});
    if (!userExist(username,password)){
        res.status(403).json({
            msg: "INCORRECT Credentials",
            token,
        });
    }
    if( !validatesignin.success){
        return res.status(400).json({msg:"Invalid Inputs"});
    }
    var token = jwt.sign({username: username},jwtPassword);
    return res.json({
        token,
    });
});


app.get('/user',(req,res)=>{
    //  Returns an array of users if user is signed in(token is correct)
    //          returns 403 status code if not.
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({msg:"No token provided"})
    }
    try{
        const decoded = jwt.verify(token,jwtPassword);
        const username = decoded.username;
    }catch (err){
        return res.status(403).json({msg:"Invalid Token"});
    }
});

const port = 3002;

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
});


// LE CHAT MISTRAL RECOMMENDATIONS

// Additional Recommendations

// Security: Storing passwords in plaintext is not secure. Use a hashing library like bcrypt to hash passwords before storing them.
// Error Handling: Add error handling for cases where username or password is not provided.
// Case Sensitivity: Consider normalizing usernames (e.g., converting to lowercase) before comparison to avoid case sensitivity issues.

