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

function verifyJWT(req, res, next) {
    // console.log(req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1];
    // console.log(token);

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }

        req.decoded = decoded;
        next()
    })
}

async function run() {
    try {
        const carsCollection = client.db('fantasyCar').collection('cars');
        const categoriesCollection = client.db('fantasyCar').collection('categories');
        const usersCollection = client.db('fantasyCar').collection('users');
        const bookingCollection = client.db('fantasyCar').collection('bookings');
        const rolesCollection = client.db('fantasyCar').collection('role');
        const blogsCollection = client.db('fantasyCar').collection('blogs');

        const verifyAdmin = async (req, res, next) => {
            // console.log(req.decoded.email);
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await usersCollection.findOne(query)

            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }

            next()
        }

        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'Buyer'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, option);
            console.log(result);
            const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {
                expiresIn: '1hr'
            })
            console.log(token, result);
            res.send({ result, token })
        });

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                //  && user.email
                const token = jwt.sign({ email }, process.env.SECRET_ACCESS_TOKEN, {
                    expiresIn: '1hr'
                });
                return res.send({ accessToken: token })
            }
            res.status(403).send({ accessToken: '' })
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            // console.log(user);
            const result = await usersCollection.insertOne(user);
            // console.log(result);
            res.send(result);
        });

        app.get('/users', async (req, res) => {
            const query = {};
            // console.log(query);
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });


        // app.put('/users/admin/:email', verifyJWT, async (req, res) => {
        //     const decodedEmail = req.decoded.email;
        //     // console.log(decodedEmail);
        //     const filter = { email: decodedEmail };
        //     const user = await usersCollection.findOne(filter);
        //     if (user.role !== 'admin') {
        //         return res.status(403).send({ message: 'forbidden access' })
        //     }
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) }
        //     const options = { upsert: true }
        //     const updatedDoc = {
        //         $set: {
        //             role: 'admin'
        //         }
        //     }
        //     const result = await usersCollection.updateOne(query, updatedDoc, options);
        //     res.send(result);
        // });

        app.put('/users/admin/:id', verifyJWT, async (req, res) => {

            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });


        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });

        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            console.log(user);
            res.send({ isSeller: user?.role === 'seller' });
        });

        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            console.log(user);
            res.send({ isBuyer: user?.role === 'buyer' });
        });

        // // verify SEller
        // app.put('/users/admin/:email', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) }
        //     const options = { upsert: true }
        //     const updatedDoc = {
        //         $set: {
        //             status: 'verified'
        //         }
        //     }
        //     const result = await usersCollection.updateOne(query, updatedDoc, options);
        //     res.send(result);
        // });

        app.get('/users/:role', async (req, res) => {
            const role = req.params.role;
            const query = { role: role };
            const result = await usersCollection.find(query).toArray();
            res.send(result)
        })

        app.put('/users/admin/:email', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    status: 'verified'
                }
            }
            const result = await usersCollection.updateOne(query, updatedDoc, options);
            res.send(result);
        });

        // app.get('/users/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const user = await usersCollection.findOne(query);
        //     res.send({ isSeller: user?.role === 'seller' });
        // });

        app.get('/cars', async (req, res) => {
            // const decoded = req.decoded;
            // if (decoded.email !== req.query.email) {
            //     res.status(403).send({ message: 'unauthorized access' })
            // }

            let query = {};
            // if (req.query.email) {
            //     query = {
            //         email: req.query.email
            //     }
            // }

            const result = await carsCollection.find(query).toArray();
            res.send(result);
            // console.log(result);
        });

        // app.get('/orders', verityJWT, async (req, res) => {
        //     // console.log(req.headers.authorization);
        //     const decoded = req.decoded;
        //     console.log(decoded);
        //     if (decoded.email !== req.query.email) {
        //         res.status(403).send({ message: 'unauthorized access' })
        //     }

        //     let query = {};
        //     if (req.query.email) {
        //         query = {
        //             email: req.query.email
        //         }
        //     }
        //     const cursor = orderCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.send(orders);
        // })

        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result)
        });

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category_id: id }
            const carCategories = await carsCollection.find(query);
            // console.log(carCategories);
            const result = await carCategories.toArray();
            // console.log(result);
            res.send(result);
        });

        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const car = await carsCollection.findOne(query);
            res.send(car);
        })

        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { name: id.data }
            const car = await carsCollection.findOne(query);
            res.send(car);
        })
        // app.get('/cars/:id', async (req, res) => {
        //     const model = req.params.id;
        //     const query = { name: id.data }
        //     const car = await carsCollection.findOne(query);
        //     res.send(car);
        // });

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            // console.log(booking);

            const query = {
                model: booking.model
            }
            // console.log(query);

            const alreadyBooked = await bookingCollection.findOne(query);
            // console.log(alreadyBooked);

            // if (alreadyBooked) {
            //     const message = 'This car is already booked';
            //     console.log(message);
            //     return res.send({ acknowledged: false }, message)
            // }

            const result = await bookingCollection.insertOne(booking);

            res.send(result);
        });

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            // const decodedEmail = req.decoded.email;
            // if (email !== decodedEmail) {
            //     return res.status(403).send({ message: 'forbidden access' })
            // }
            const filter = { email: email };
            const bookings = await bookingCollection.find(filter).toArray();
            res.send(bookings);
        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.query.id;
            console.log(id);
            // const decodedEmail = req.decoded.email;
            // if (email !== decodedEmail) {
            //     return res.status(403).send({ message: 'forbidden access' })
            // }
            const filter = { _id: ObjectId(id) };
            const bookings = await bookingCollection.findOne(filter);
            res.send(bookings);
        })

        app.get('/allbookings', async (req, res) => {
            const filter = {};
            const bookings = await bookingCollection.find(filter).toArray();
            res.send(bookings);
        })

        app.post('/cars', async (req, res) => {
            const car = req.body;
            const result = await carsCollection.insertOne(car);
            res.send(result)
        });

        app.get('/my-cars', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            // const decodedEmail = req.decoded.email;
            // if (email !== decodedEmail) {
            //     return res.status(403).send({ message: 'forbidden access' })
            // }
            const filter = { email: email };
            const cars = await carsCollection.find(filter).toArray();
            res.send(cars);
        })


        app.get('/dashboard/users', async (req, res) => {
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/role', async (req, res) => {
            const query = {};
            const result = await rolesCollection.find(query).toArray();
            res.send(result)
        });

        app.get('/users/role/:role', async (req, res) => {
            const role = req.params.role;
            // console.log(id);
            const query = { role: role }
            const roleCategories = await usersCollection.find(query);
            // console.log(carCategories);
            const result = await roleCategories.toArray();
            console.log(result);
            res.send(result);
        });

        app.get('/users/role/buyer', async (req, res) => {
            const role = req.params.role;
            // console.log(id);
            const query = { role: "buyer" }
            const roleCategories = await usersCollection.find(query);
            // console.log(carCategories);
            const result = await roleCategories.toArray();
            console.log(result);
            res.send(result);
        });

        app.get('/users/role/seller', async (req, res) => {
            const role = req.params.role;
            // console.log(id);
            const query = { role: "seller" }
            const roleCategories = await usersCollection.find(query);
            // console.log(carCategories);
            const result = await roleCategories.toArray();
            console.log(result);
            res.send(result);
        });

        // app.get('/bookings', async (req, res) => {
        //     let query = {};
        //     const email = req.query.email;
        //     if (email) {
        //         query: {
        //             guestEmail: email
        //         }
        //     }
        //     const bookings = await bookingCollection.find(query).toArray();
        //     res.send(bookings);
        // })

        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = await blogsCollection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
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