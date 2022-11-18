const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const express = require('express');
const cors = require('cors');
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()
const port = process.env.PORT || 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xteb5ll.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    try {
        const serviceCollection = client.db('myphotography').collection('services');
        const serviceComments = client.db('myphotography').collection('comments')
        const signedUsers = client.db('myphotography').collection('signedusers')

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = serviceComments.find(query).sort({ time: -1 });
            const comments = await cursor.toArray();
            res.send(comments);
        });

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
            const result = signedUsers.find(query);
            const users = await result.toArray()
            res.send(users)

        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result)
        });

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const comments = await serviceComments.findOne(query);
            res.send(comments)
        });



        app.post('/services', async (req, res) => {
            let services = req.body
            const query = await serviceCollection.insertOne(services);
            res.send(query)
        });
        app.post('/reviews', async (req, res) => {
            let reviews = req.body
            const result = await serviceComments.insertOne(reviews);
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            let users = req.body
            const result = await signedUsers.insertOne(users);
            res.send(result)
        })


        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await serviceComments.deleteOne(query);
            // const result = await cursor.toArray()
            res.send(result)

        })

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const body = req.body;
            console.log(body);
            const option = { upsert: true }
            const updateUser = {
                $set: {
                    text: body.text,
                }
            }
            const result = await serviceComments.updateOne(filter, updateUser, option)
            res.send(result)
        })


        serviceComments.updateMany(
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

    }
    finally {

    }
}
run()



app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server running on${port}`);
})