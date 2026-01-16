import axios from "axios";
import api from "./apiConfig";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dodacbzhu/upload";
const UPLOAD_PRESET = "pyramid";

export const addProduct = async(formData)=>{
    let imageUrl="";
    //Pour envoyer une image à Cloudinary
    if (formData.image instanceof File) {
    const imageData = new FormData();
    imageData.append("file", formData.image);
    imageData.append("upload_preset", UPLOAD_PRESET);

    const cloudinaryRes = await axios.post(CLOUDINARY_URL, imageData);
    imageUrl = cloudinaryRes.data.secure_url; 
  }
   //Création de l'objet Produit
    const product = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        quantity: Number(formData.quantity),
        image: imageUrl,
  };
   //Envoi MockApi
    const res = await api.post('/products',product);
    return res.data;
};