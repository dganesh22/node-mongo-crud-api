const http = require('http')
const PORT = 3630
const client = require('./dbconfig')
const path = require('path')

// db connection
client.connect()
let db =   client.db("userdb")
let cl = db.collection("users");

const server = http.createServer(async function(req,res){
    //configure the headers
    // res.writeHead(200, { "content-type": "application/json"})
    
    let url = req.url; // req.url -> accept url path
    let method = req.method; // req.method -> accept http method

    // switch
    if(url === "/api/users/add" && method === "POST" ) {

        req.on("data", async function(data){
             let user = JSON.parse(data)
                // insert data into db collection
            let exEmail = await cl.find({ email: user.email }).toArray()
            let exMobile = await cl.find({ mobile: user.mobile }).toArray()
      
                if(exEmail.length !== 0){
                    res.writeHead(400, { "content-type": "application/json"})
                    res.end(JSON.stringify({ msg: `${user.email} already exists.`}))
                } else if(exMobile.length !== 0){
                    res.writeHead(400, { "content-type": "application/json"})
                    res.end(JSON.stringify({ msg: `${user.mobile} already exists.`}))
                } else {
                    // insert logic
                    let out =  await cl.insertOne(user)
                    res.writeHead(201, { "content-type": "application/json"})
                    res.end(JSON.stringify({ msg: "new user data inserted", user: out })) 
                }
        })

    } else if (url === "/api/users/all" && method === "GET") {

        res.writeHead(200, { "content-type": "application/json"})
        // read all data from db collection
            let out = await cl.find().toArray()
         res.end(JSON.stringify({ length: out.length, users: out })) 

    } else if (url === "/api/users/edit" || method === "PATCH") {
        // res.writeHead(201, { "content-type": "application/json"})

        // to retrive query from url
        let data = path.parse(req.url)
        let ref = data.base.split("?")[1].split('=')[1]

        req.on("data", async function(data){
            let user = JSON.parse(data)
                    // update logic
                   let out =  await cl.updateOne({email: ref}, {
                        $set: user
                   })
                   res.writeHead(201, { "content-type": "application/json"})
                   res.end(JSON.stringify({ msg: "user data updated", user: out })) 
           })

    } else if (url === "/api/users/delete" || method === "DELETE") {

         // to retrive query from url
         let data = path.parse(req.url)
         let ref = data.base.split("?")[1].split('=')[1]

         let exEmail = await cl.find({ email: ref }).toArray()
            if(exEmail.length === 0) {
                res.writeHead(300, { "content-type": "application/json"})
                res.end(JSON.stringify({ msg: "user not found" })) 
            } else {
                let out = await cl.deleteOne({ email: ref })
                res.writeHead(200, { "content-type": "application/json"})
                res.end(JSON.stringify({ msg: "user deleted successfully" })) 
            }

    } else {

        res.writeHead(404, { "content-type": "application/json"})
         res.end(JSON.stringify({ msg: "requested path not found" })) 
    }
     
        
    // res.end(JSON.stringify({url, method })) 
})

server.listen(PORT,() => {
    console.log(`server is started @ http://localhost:${PORT}`)
})