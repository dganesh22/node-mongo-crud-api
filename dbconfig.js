const mongodb = require('mongodb')
require("dotenv").config()

// const URL = "mongodb://localhost:27017"
// const URL = "mongodb://127.0.0.1:27017"
let URL = ""
    if(process.env.MODE === "development") {
        URL = process.env.LOCAL_DB
    } else if (process.env.MODE === "production") {
        URL = process.env.CLOUD_DB
    }

const client =  new mongodb.MongoClient(URL)

// async handler

// async function main() {
//     await client.connect()
//     console.log(`mongodb connected successfully`)
//     return "...connected"
// }


// main().then(res => {
//      console.log(res)
// }).catch(err => {
//     console.log(err.message)
// })

module.exports = client