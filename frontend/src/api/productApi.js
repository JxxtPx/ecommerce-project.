import axios from "./axiosConfig"

export const getProducts = async()=>{
    try{
        const res=await axios.get("/products");
        return res.data;

    }catch(error){
        console.log("Failed to fetch products",error);
        throw error;
    }
}