require("dotenv").config();
const { MongoClient } = require("mongodb");

const tutors = [
  {
    name: "Prof. Sarah Johnson",
    email: "sarah.johnson@example.com",
    image:
      "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=600",
    subject: "Cardiology & Anatomy",
    language: "English",
    description:
      "Experienced biology professor with 10+ years of teaching university students and pre-med tracks in cardiovascular health.",
    hourlyRate: 80,
    sessionStartDate: "2025-06-01", 
    sessionEndDate: "2025-08-31",
    totalSlot: 10,
    review: 4.9,
    availableDays: ["Mon", "Wed", "Fri"],
    availableTimeSlot: "4:00 PM - 7:00 PM",
    institution: "Johns Hopkins University",
    experience: "12 years",
    location: "Baltimore, MD",
    teachingMode: "Both",
    about:
      "Passionate about medical education and preparing the next generation of healthcare professionals.",
  },
  {
    name: "Ahmed Rahman",
    email: "ahmed.rahman@example.com",
    image:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600",
    subject: "Data Science & AI",
    language: "English, Bengali",
    description:
      "Data scientist specializing in neural networks and machine learning. Passionate about making complex coding topics easy to understand.",
    hourlyRate: 90,
    sessionStartDate: "2025-06-15",
    sessionEndDate: "2025-09-15",
    totalSlot: 8,
    review: 4.8,
    availableDays: ["Sun", "Tue", "Thu"],
    availableTimeSlot: "5:00 PM - 8:00 PM",
    institution: "Dhaka University / Tech Corp AI",
    experience: "5 years",
    location: "Dhaka, Bangladesh",
    teachingMode: "Online",
    about:
      "Breaking down complex algorithms into bite-sized, practical coding projects for students.",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    image:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=600",
    subject: "Early Childhood Development",
    language: "English, Hindi",
    description:
      "Pediatric education specialist with a focus on early child development, creative learning, and cognitive growth.",
    hourlyRate: 70,
    sessionStartDate: "2026-03-01",
    sessionEndDate: "2026-09-30",
    totalSlot: 12,
    review: 4.7,
    // --- New Fields Added Below ---
    availableDays: ["Mon", "Tue", "Wed", "Thu"],
    availableTimeSlot: "9:00 AM - 12:00 PM",
    institution: "Delhi Child Psychology Institute",
    experience: "8 years",
    location: "New Delhi, India",
    teachingMode: "Offline",
    about:
      "Dedicated to nurturing young minds using creative, interactive, and evidence-based learning techniques.",
  },
  {
    name: "James Wilson",
    email: "james.wilson@example.com",
    image:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600",
    subject: "Physiotherapy & Kinesiology",
    language: "English",
    description:
      "Sports therapist and fitness mentor with expertise in the musculoskeletal system, sports injuries, and physical rehabilitation.",
    hourlyRate: 85,
    sessionStartDate: "2025-06-10",
    sessionEndDate: "2025-08-10",
    totalSlot: 6,
    review: 4.6,
    // --- New Fields Added Below ---
    availableDays: ["Mon", "Thu"],
    availableTimeSlot: "2:00 PM - 5:00 PM",
    institution: "Loughborough University",
    experience: "7 years",
    location: "London, UK",
    teachingMode: "Both",
    about:
      "Helping fitness professionals and students master movement mechanics and rehabilitation protocols.",
  },
  {
    name: "Fatima Malik",
    email: "fatima.malik@example.com",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
    subject: "Organic Chemistry",
    language: "English, Urdu",
    description:
      "Chemistry researcher with extensive experience in molecular structures, laboratory procedures, and chemical equations.",
    hourlyRate: 75,
    sessionStartDate: "2026-05-01",
    sessionEndDate: "2026-10-30",
    totalSlot: 9,
    review: 4.5,
    // --- New Fields Added Below ---
    availableDays: ["Sat", "Sun", "Wed"],
    availableTimeSlot: "3:00 PM - 6:00 PM",
    institution: "NUST Chemistry Lab",
    experience: "6 years",
    location: "Islamabad, Pakistan",
    teachingMode: "Online",
    about:
      "Demystifying reaction mechanisms and chemical structures through visual, interactive walkthroughs.",
  },
  {
    name: "Coach Chen Wei",
    email: "chen.wei@example.com",
    image:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600",
    subject: "Leadership & Mindset",
    language: "English, Mandarin",
    description:
      "Executive coach focused on corporate mental health, professional growth, and cognitive behavioral adjustments for managers.",
    hourlyRate: 95,
    sessionStartDate: "2026-05-01",
    sessionEndDate: "2026-10-30",
    totalSlot: 7,
    review: 4.9,
    // --- New Fields Added Below ---
    availableDays: ["Fri", "Sat"],
    availableTimeSlot: "6:00 PM - 9:00 PM",
    institution: "Singapore Management University",
    experience: "15 years",
    location: "Downtown, Singapore",
    teachingMode: "Both",
    about:
      "Empowering corporate leaders to overcome burnout and optimize their team management strategies.",
  },
];

/* const tutors = [

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
    // image: "https://images.pexels.com/photos/6929180/pexels-photo-6929180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
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
 */
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
