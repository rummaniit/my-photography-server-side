// requires
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xteb5ll.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    await client.connect()
    console.log("Data is Connected");
    const serviceCollections = client.db('photography').collection('services')
    const reviewsCollections = client.db('photography').collection('reviews')
    const userCollections = client.db('photography').collection('signedusers')

    try {
        app.get('/services', async (req, res) => {
            const query = {}
            const cuesor = serviceCollections.find(query)
            const services = await cuesor.toArray()
            res.send(services)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await serviceCollections.findOne(query);
            res.send(result)
        })


        app.get('/reviews', async (req, res) => {
            const query = {}
            const cuesor = reviewsCollections.find(query)
            const reviews = await cuesor.toArray()
            res.send(reviews)
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollections.findOne(query);
            res.send(result)
        })

        app.post('/reviews', async (req, res) => {
            let reviews = req.body
            const result = await reviewsCollections.insertOne(reviews);
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            let users = req.body
            const result = await userCollections.insertOne(users);
            res.send(result)
        })


        app.get('/users', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = { email: req.query.email };
            }
            const result = userCollections.find(query);
            const users = await result.toArray()
            res.send(users)

        })
    }
    finally {
        console.log('All is Looking god');
    }

}
run()




// photography
// services



// testing
app.get('/', (req, res) => {
    res.send('Api is running')
})
app.listen(port, () => {
    console.log('Api is good to use');
})
