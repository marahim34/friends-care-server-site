const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ivhgvma.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const carsCollection = client.db('fantasyCar').collection('cars');
const categoriesCollection = client.db('fantasyCar').collection('categories');
const usersCollection = client.db('fantasyCar').collection('users');

async function run() {
    try {
        // app.put('/users/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const user = req.body;
        //     const filter = { email: email };
        //     const option = { upsert: true };
        //     const updatedDoc = {
        //         $set: user,
        //     }
        //     const result = await usersCollection.updateOne(filter, updatedDoc, option);

        //     const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {
        //         expiresIn: '1hr'
        //     });
        //     res.send(result, token);
        //     console.log(result, token);
        // })

        app.get('/cars', async (req, res) => {
            const query = {};
            const result = await carsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category_id: id }
            const carCategories = await carsCollection.find(query);
            // console.log(carCategories);
            const result = await carCategories.toArray();
            // console.log(result);
            res.send(result);
        })

        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { name: id.data }
            // console.log(query);
            const car = await carsCollection.findOne(query);
            // console.log(car);
            res.send(car);
        })



    }
    finally {

    }
}
run().catch(error => console.error(error))



app.get('/', (req, res) => {
    res.send(`Server is running on `);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});