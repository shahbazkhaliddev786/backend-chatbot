const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./routes/routes");
dotenv.config();
const app = express();
const port = process.env.PORT;

// middlewares
app.use(cors());
app.use(express.json());

app.use("/", router);

// routes
app.get("/", (req,res)=>{
    res.json({message: "Server started"});
});



app.listen(port, ()=>{
    console.log(`Server at: http://localhost:${port}`);
});

// npx prisma studio cli
// npx prisma
// npx prisma generate
// npx prisma db push