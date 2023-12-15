const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://resturent-management:iMkmIeA3BMj2mP1N@cluster0.ruyf0su.mongodb.net/?retryWrites=true&w=majority";
// const uri = `mongodb+srv://resturent-management:$iMkmIeA3BMj2mP1N@cluster0.swu9d.mongodb.net/?retryWrites=true&w=majority`;

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

    const usersCollection = client.db("bistroDb").collection("users");
    const menuCollection = client.db("bistroDb").collection("menu");
    const reviewCollection = client.db("bistroDb").collection("reviews");
    const booingCollection = client.db("bistroDb").collection("booking");
    app.post("/users",async(req,res)=>{
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.send(result);
    })
    app.get("/users",async(req,res)=>{
      const result = await usersCollection.find().toArray();
      res.send(result);
    })
    app.delete("/users/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })
    //update users 
    app.patch('/users/admin/:id',async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: 'admin'
        }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })
    app.post('/carts', async(req,res)=>{
      const cardItems = req.body;
      // console.log(cardItems);
      const result = await booingCollection.insertOne(cardItems);
      res.send(result)
    })
    app.get("/carts", async(req,res)=>{
      const email = req.query.email;
      // console.log(email);
      const query = { email: email };
      const result = await booingCollection.find(query).toArray();
      res.send(result);
    })
    app.get('/menu', async(req, res) =>{
        const result = await menuCollection.find().toArray();
        res.send(result);
    })
    
    app.get('/reviews', async(req, res) =>{
        const result = await reviewCollection.find().toArray();
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
    res.send('boss is sitting')
})

app.listen(port, () => {
    console.log(`Bistro boss is sitting on port ${port}`);
})