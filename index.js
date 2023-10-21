const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app =express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yctm60s.mongodb.net/?retryWrites=true&w=majority`;
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db('productDB').collection('products');
    const cartCollection = client.db('cartDB').collection('carts');

    app.get('/products/:brand', async(req, res) => {

      const brand = req.params.brand
      const query = {brand : brand}
      const cursor = productCollection.find(query);
      const result = await cursor.toArray()
     
      // console.log(brand);
      res.send(result);


    })

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
        console.log(result);
        res.send(result);
    });


    // UPDATE

    
    app.get('/update/:id', async(req, res) => {
      const id = req.params.id;
      
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
        console.log(result);
        res.send(result);
    })

app.put('/update/:id', async(req, res) => {
     const id = req.params.id;
     const filter = {_id: new ObjectId(id)}
     const options = {upsert: true};
     const updatedProduct = req.body
      const finalProduct = {

      $set: {
        name : updatedProduct.name,
         brand: updatedProduct.brand,
         type: updatedProduct.type,
         photo: updatedProduct.photo,
         price: updatedProduct.price,
         description: updatedProduct.description,
         rating:updatedProduct.rating
      }

     }
      
     const result = await productCollection.updateOne(filter, finalProduct, options)
     res.send(result);
})


    // app.get('/product/:id', async (req, res) => {
    //   const id = req.params.id;
    //   console.log(id);
    //   const query = { _id: new ObjectId(id) };
    //   const result = await productCollection.find(query).toArray();
    //     console.log(result);
    //     res.send(result);
    // });

    app.post('/products', async(req, res) => {
        const newProduct =  req.body
        console.log(newProduct);
        const result =  await productCollection.insertOne(newProduct)
        res.send(result)

    })

    app.delete('/products/:id', async(req, res) => {
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

   












    
    app.get('/cart/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });


    app.post('/cart', async(req, res) => {

      const cart = req.body;

      const result = await cartCollection.insertOne(cart);
      res.send(result)

    })


// Deleting card

    app.delete('/cart/:id', async(req, res) => {
      const id = req.params.id
      console.log(id);
      const query = {_id : new ObjectId(id)}
      console.log(query);
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })
    




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {

    res.send('automotive server running')
})

app.listen(port, () => {
    console.log(`Automotive server is running on ${port}`);
})