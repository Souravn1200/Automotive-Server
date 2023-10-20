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
    await client.connect();

    const productCollection = client.db('productDB').collection('products')

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
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.find(query).toArray();
        console.log(result);
        res.send(result);
    });

    app.post('/products', async(req, res) => {
        const newProduct =  req.body
        console.log(newProduct);
        const result =  await productCollection.insertOne(newProduct)
        res.send(result)

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