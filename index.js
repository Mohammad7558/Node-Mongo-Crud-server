const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// username : dbuser2
// password : sh55xi6tbrOsTN7n


const uri = "mongodb+srv://dbuser2:sh55xi6tbrOsTN7n@cluster0.s2zwxpd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('nodeMongoCrud').collection('users');

        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            res.send(user)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const uptadetUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email,
                }
            }
            const result = await usersCollection.updateOne(filter, uptadetUser, option);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            // console.log('trying to delete user')
            const result = await usersCollection.deleteOne(query);
            console.log(result)
            res.send(result)
        })

    }
    finally {

    }
}

run().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Api Running')
});

app.listen(port, () => {
    console.log('api is Running')
})