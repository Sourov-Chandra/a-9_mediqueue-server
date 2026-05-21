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

    app.get("/tutors/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await tutorsCollection.findOne(query);
      res.send(result);
    });

    app.post("/tutors", async (req, res) => {
      const tutor = req.body;
      const result = await tutorsCollection.insertOne(tutor);
      res.send(result);
    });

    app.get("/my-tutors", async (req, res) => {
      const { email } = req.query;
      const query = email ? { email } : {};
      const result = await tutorsCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/tutors/:id", async (req, res) => {
      const { id } = req.params;
      const result = await tutorsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.patch("/tutors/:id", async (req, res) => {
      const { id } = req.params;
      const updatedTutor = req.body;
      const result = await tutorsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedTutor },
      );
      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;

      const alreadyBooked = await bookingsCollection.findOne({
        tutorId: booking.tutorId,
        studentEmail: booking.studentEmail,
      });

      if (alreadyBooked) {
        return res.status(400).send({
          message: "You have already booked this tutor session!",
        });
      }

      const tutor = await tutorsCollection.findOne({
        _id: new ObjectId(booking.tutorId),
      });

      if (!tutor || tutor.totalSlot === 0) {
        return res.status(400).send({ message: "No slots available" });
      }

      const result = await bookingsCollection.insertOne(booking);

      await tutorsCollection.updateOne(
        { _id: new ObjectId(booking.tutorId) },
        { $inc: { totalSlot: -1 } },
      );

      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
