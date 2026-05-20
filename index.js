require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [process.env.NEXT_PUBLIC_APP_URL], 
    credentials: true,
  }),
);
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

        const db = client.db("mediqueue");
        const tutorsCollection = db.collection("tutors");
        const bookingsCollection = db.collection("bookings");

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    app.get("/", (req, res) => {
      res.send("MediQueue server running!");
    });


    app.get("/tutors", async (req, res) => {
      const result = await tutorsCollection.find({}).toArray();
      res.send(result);
    });


    

  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
