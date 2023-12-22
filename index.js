const express = require('express')
const child_process = require("child_process");

const app = express()

app.get("/deploy", (req, res) => {
    const authorization = req.header("Authorization");
    if (authorization !== process.env.token) {
        return res.status(401).send({message: "Authorization failed"})
    }
    const command = "cd ~/cloud && docker-compose pull && docker-compose up -d";
    child_process.exec(command, (error, stdout) => {
        if (error) {
            return res.status(500).send({message: "Failed to deploy server"})
        }
        return res.send({message: "Successfully deployed servers"})
    })
})


app.listen(4532, () => console.log("Auto deploy server started on port 4532"))
