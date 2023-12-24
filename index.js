const express = require('express')
const child_process = require("child_process");
const rebootTried = require("./rebootTried.json")
const fs = require("fs");

const app = express()

app.get("/deploy", (req, res) => {
    const authorization = req.header("Authorization");
    if (authorization !== process.env.token) {
        return res.status(401).send({message: "Authorization failed"})
    }
    const command = `sudo -s <<EOF
    cd ~/cloud
    sudo docker-compose pull
    sudo docker-compose up -d`;
    child_process.exec(command, (error) => {
        if (error) {
            console.log(error)
            return res.status(500).send({message: "Failed to deploy server"})
        }
        return res.send({message: "Successfully deployed servers"})
    })
})

if (rebootTried.tried < 3) {
    const command = `sudo -s <<EOF
    sudo reboot`;
    setTimeout(() => {
        child_process.exec("curl google.com", (error) => {
            if (error) {
                console.log(error)
                child_process.exec(command)
            } else {
                rebootTried.tried += 1
                fs.writeFileSync("./rebootTried.json", JSON.stringify(rebootTried))
            }

        })
    }, 10 * 60 * 1000)
}

app.listen(4532, () => console.log("Auto deploy server started on port 4532"))
