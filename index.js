// requires
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require("cors")
const app = express()
app.use(cors());
require('dotenv').config()
// var jwt = require('jsonwebtoken');

// calling
app.use(express.json())
// const app = connect()

// Port number selection
const port = process.env.PORT || 5000

// connect to Mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xteb5ll.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// function verifyJWT(req, res, next) {
//     const authorize = req.headers.authorization
//     // let decoded=req.decoded
//     if (!authorize) {
//         res.status(401).send({
//             message: 'unauthorised access'
//         })
//     }
//     const token = authorize.split(' ')[1]
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//         if (err) {
//             res.status(403).send({ message: 'unauthorised access' })
//         }
//         req.decoded = decoded
//         next()
//     })
// }
async function run() {
    await client.connect()
    console.log("Data is Connected");
    const serviceCollections = client.db('photography').collection('services')
    const reviewsCollections = client.db('photography').collection('reviews')
    const userCollections = client.db('photography').collection('signedusers')

    try {
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollections.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await serviceCollections.findOne(query);
            res.send(result)
        })
        app.post('/services', async (req, res) => {
            let services = req.body
            const result = await serviceCollections.insertOne(services);
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
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollections.deleteOne(query);
            // const result = await cursor.toArray()
            res.send(result)

        })

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const rev = req.body
            const option = { upsert: true }
            const updateRev = {
                $set: {
                    name: rev.name,
                    ratings: rev.retings
                }
            }
            const result = await reviewsCollections.updateOne(query, updateRev, option)
            res.send(result)
        })
        reviewsCollections.updateMany(
            {
                updatedAt: { $exists: false }
            },
            {
                $currentDate: {
                    updatedAt: true
                }
            },
            {}
        )
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
        app.post('/jwt', (req, res) => {
            // let decoded = req.decoded
            // if (decoded.email != req.query.email) {
            //     res.send({ message: 'Unauthorised ' })
            // }
            // const result = req.body
            // var token = jwt.sign(result, process.env.ACCESS_TOKEN_SECREET, { expiresIn: '1h' });

            // res.send({ token })
            const user = req.body
            var token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.send({ token })
            console.log(user);
        })



        app.get('/users', async (req, res) => {
            console.log(req.headers.authorization);
            let decoded = req.decoded
            if (decoded.email !== req.query.email) {
                res.status(403).send({
                    message: 'unauthorised access'
                })
            }
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
        console.log('All is Looking good');
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
