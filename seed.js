require("dotenv").config();
const { MongoClient } = require("mongodb");

const tutors = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    subject: "Cardiology",
    language: "English",
    description:
      "Experienced cardiologist with 10+ years of teaching medical students and residents in cardiovascular health.",
    hourlyRate: 80,
    sessionStartDate: "2025-06-01",
    sessionEndDate: "2025-08-31",
    totalSlot: 10,
    review: 4.9,
  },
  {
    name: "Dr. Ahmed Rahman",
    email: "ahmed.rahman@example.com",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    subject: "Neurology",
    language: "English, Bengali",
    description:
      "Neurologist specializing in brain and nervous system disorders. Passionate about making complex topics easy to understand.",
    hourlyRate: 90,
    sessionStartDate: "2025-06-15",
    sessionEndDate: "2025-09-15",
    totalSlot: 8,
    review: 4.8,
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@example.com",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    subject: "Pediatrics",
    language: "English, Hindi",
    description:
      "Pediatric specialist with a focus on child health, development, and preventive care.",
    hourlyRate: 70,
    sessionStartDate: "2025-07-01",
    sessionEndDate: "2025-09-30",
    totalSlot: 12,
    review: 4.7,
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@example.com",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    subject: "Orthopedics",
    language: "English",
    description:
      "Orthopedic surgeon with expertise in musculoskeletal system, sports injuries, and rehabilitation.",
    hourlyRate: 85,
    sessionStartDate: "2025-06-10",
    sessionEndDate: "2025-08-10",
    totalSlot: 6,
    review: 4.6,
  },
  {
    name: "Dr. Fatima Malik",
    email: "fatima.malik@example.com",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    subject: "Dermatology",
    language: "English, Urdu",
    description:
      "Dermatologist with extensive experience in skin conditions, cosmetic procedures, and dermatopathology.",
    hourlyRate: 75,
    sessionStartDate: "2025-07-15",
    sessionEndDate: "2025-10-15",
    totalSlot: 9,
    review: 4.5,
  },
  {
    name: "Dr. Chen Wei",
    email: "chen.wei@example.com",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    subject: "Psychiatry",
    language: "English, Mandarin",
    description:
      "Psychiatrist focused on mental health, cognitive behavioral therapy, and neuropsychiatric disorders.",
    hourlyRate: 95,
    sessionStartDate: "2025-06-20",
    sessionEndDate: "2025-09-20",
    totalSlot: 7,
    review: 4.9,
  },
];

async function seed() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("mediqueue");
    const collection = db.collection("tutors");
    await collection.deleteMany({});
    await collection.insertMany(tutors);
    console.log("Seeded", tutors.length, "tutors successfully!");
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
