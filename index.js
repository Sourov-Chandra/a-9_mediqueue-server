require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT;
const cookieParser = require("cookie-parser");
const verifyToken = require("./middleware/verifyToken");

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mediqueue-orcin.vercel.app",
    ],
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
    const db = client.db("mediqueue");
    const tutorsCollection = db.collection("tutors");
    const bookingsCollection = db.collection("bookings");

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

    app.get("/tutors/search", async (req, res) => {
      try {
        const { search, startDate, endDate } = req.query;
        const filter = {};

        if (search && search.trim()) {
          filter.name = { $regex: search.trim(), $options: "i" };
        }

        if (startDate || endDate) {
          const dateFilter = {};

          if (startDate) {
            dateFilter.$gte = startDate;
          }
          if (endDate) {
            dateFilter.$lte = endDate;
          }

          filter.registrationDate = dateFilter; 
          // filter.createdAt = dateFilter;    
       
        }

        console.log("Filter:", filter);

        const result = await tutorsCollection.find(filter).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: error.message });
      }
    });
    app.get("/tutors/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await tutorsCollection.findOne(query);
      res.send(result);
    });

    app.post("/tutors", verifyToken, async (req, res) => {
      const tutor = req.body;
      const result = await tutorsCollection.insertOne(tutor);
      res.send(result);
    });

    app.get("/my-tutors", verifyToken, async (req, res) => {
      const email = req.user.email;
      const result = await tutorsCollection.find({ email }).toArray();
      res.send(result);
    });

    app.delete("/tutors/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const result = await tutorsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.patch("/tutors/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const updatedTutor = req.body;
      const result = await tutorsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedTutor },
      );
      res.send(result);
    });

    app.post("/bookings", verifyToken, async (req, res) => {
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

    app.get("/bookings", verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { studentEmail: email };
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    app.patch("/bookings/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id || id === "undefined") {
          return res
            .status(400)
            .send({ error: "Missing or invalid booking ID parameter" });
        }

        const result = await bookingsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status } },
        );

        if (result.matchedCount === 0) {
          return res
            .status(404)
            .send({ error: "No booking found with that ID" });
        }

        res.send(result);
      } catch (error) {
        console.error("Backend PATCH error:", error);
        res
          .status(500)
          .send({ error: "Internal server error during cancellation update" });
      }
    });

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.send({ success: true, token });
    });

    app.post("/jwt/logout", (req, res) => {
      res.send({ success: true });
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
