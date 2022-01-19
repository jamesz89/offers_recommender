//Get dependecies
import 'dotenv/config'
import express from "express";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

//Google Firebase credentials
const { private_key } = JSON.parse(process.env.PRIVATE_KEY)

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: private_key,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
}
console.log(process.env.TYPE)

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
  res.send("<h1>Offers Recommender API</h1> <span>by James</span>");
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
  snapshot.forEach((doc) =>
    data.push({
      brand: doc.data().brand,
      categoryId: doc.data().categoryId,
      imageUrl: doc.data().imageUrl,
      name: doc.data().name,
      offerPrice: doc.data().offerPrice,
      price: doc.data().price,
      priceDifference: doc.data().priceDifference,
      priceDifferencePercentage: doc.data().priceDifferencePercentage,
      sku: doc.data().sku,
      url: doc.data().url,
    })
  );
  res.status(200).json(data);
});

app.get("/offersByCategory/:id", async (req, res) => {
  let data = [];
  let id = req.params.id;
  const productsRef = db.collection("productsWithOffers");
  const snapshot = await productsRef
    .where("categoryId", "==", id)
    .orderBy("priceDifferencePercentage", "desc")
    .limit(12)
    .get();
  if (snapshot.empty) {
    return res.status(404).json({
      error: "not enough products to recommend",
    });
  }
  snapshot.forEach((doc) =>
    data.push({
      brand: doc.data().brand,
      categoryId: doc.data().categoryId,
      imageUrl: doc.data().imageUrl,
      name: doc.data().name,
      offerPrice: doc.data().offerPrice,
      price: doc.data().price,
      priceDifference: doc.data().priceDifference,
      priceDifferencePercentage: doc.data().priceDifferencePercentage,
      sku: doc.data().sku,
      url: doc.data().url,
    })
  );
  res.status(200).json(data);
});

//Open PORT
app.listen(PORT, () => {
  console.log(`Express started on port ${PORT} `);
});
