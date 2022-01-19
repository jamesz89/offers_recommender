//Get dependecies
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

//Google Services credentials
import serviceAccount from './serviceAccount.json'

//init database connection
initializeApp({
  credential: cert(serviceAccount)
})
const db = getFirestore()
//Fetch all docs from products collection
const fetchAllDocuments = () => {
  const productsRef = db.collection('products')
  const snapshot = await productsRef.get()
  return snapshot
}
//Start Loop
//Read a product
//Read offerPrice and price values
//Substract price - offerPrice
//Save result into new doc structure
//Calculate differential percentage
//Save result into new doc structure
//Create new collection products with offers
//Write each modified doc into collection
//Keep the same id for new docs
//End Loop