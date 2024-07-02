const { PrismaClient} = require("@prisma/client");
const dotenv = require('dotenv');
dotenv.config();

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    }
});

async function connectDB(){
    try {
        await prisma.$connect();
        console.log("Connected")
    } catch (error) {
        console.log("Not connected", error);
    }
}
connectDB();

module.exports = prisma;