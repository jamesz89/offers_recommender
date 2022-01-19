//Get dependecies
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

//Google Services credentials
import serviceAccount from "./serviceAccount.json";

//init database connection
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

const fetchAllDocuments = async () => {
  const productsRef = db.collection("products");
  const snapshot = await productsRef.get();
  return snapshot;
};

const calculatePriceDifference = (price, offerPrice) => {
  const result = price - offerPrice;
  if (result <= 0) {
    return 0;
  }
  return result;
};

const calculatePriceDifferencePercentage = (price, offerPrice) => {
  const difference = price - offerPrice;
  return Math.round((difference * 100) / price);
};

const products = await fetchAllDocuments();

products.forEach(async (product) => {
  let priceDifference = calculatePriceDifference(
    product.data().price,
    product.data().offerPrice
  );
  let priceDifferencePercentage = calculatePriceDifferencePercentage(
    product.data().price,
    product.data().offerPrice
  );
  if (priceDifferencePercentage > 0) {
    let docRef = db.collection("productsWithOffers").doc(product.id);
    await docRef.set({
      brand: product.data().brand,
      categoryId: product.data().categoryId,
      imageUrl: product.data().imageUrl,
      name: product.data().name,
      offerPrice: product.data().offerPrice,
      price: product.data().price,
      sku: product.data().sku,
      url: product.data().url,
      priceDifference: priceDifference,
      priceDifferencePercentage: priceDifferencePercentage,
    });
    console.log("adding...", product.data().name);
  }
});