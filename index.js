// requires
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()

// calling
const app = express()
app.use(cors())
app.use(express.json())

// Port number selection
const port = process.env.port || 5000

// connect to Mongodb

const uri = "mongodb+srv://<username>:<password>@cluster0.xteb5ll.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get('/', (req, res) => {
    res.send('Api is running')
})
app.listen(port, () => {
    console.log('Api is good to use');
})
