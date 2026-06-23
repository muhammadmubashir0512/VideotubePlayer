import dotenv from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js"

dotenv.config({
    path: "./.env"
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server chal raha hai port ${process.env.PORT} pe`)
        })
    })
    .catch((error) => {
        console.log("Database connect nahi hua", error)
        process.exit(1)
    })

