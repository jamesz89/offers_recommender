//Get dependecies
import express from "express";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

//Google Services credentials
import serviceAccount from "./serviceAccount.json";

//init database connection
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

console.log("DB connection established");

//init express server
const app = express();
const PORT = 3000;

//Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/offers", async (req, res) => {
  let data = [];
  const productsRef = db.collection("productsWithOffers");
  const snapshot = await productsRef
    .orderBy("priceDifferencePercentage", "desc")
    .limit(12)
    .get();
  if (snapshot.empty) {
    return res.status(404).json({
      error: "not enough products to recommend",
    });
  }
  snapshot.forEach((doc) => data.push(doc.data()));
  res.json(data);
});

app.get("/offersByCategory/:id", async (req, res) => {
  let data = []
  let id = req.params.id
  const productsRef = db.collection("productsWithOffers")
  const snapshot = await productsRef.where('categoryId', '==', id).orderBy("priceDifferencePercentage", "desc").limit(12).get()
  if (snapshot.empty) {
    return res.status(404).json({
      error: "not enough products to recommend",
    })
  }
  snapshot.forEach((doc) => data.push(doc.data()))
  res.status(200).json(data)
});

app.listen(PORT, () => {
  console.log(`Express started on port ${PORT} `);
});
