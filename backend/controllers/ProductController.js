import Product from "../models/Product.js"; // Make sure this is at the top!

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    let productId = req.params.id;
    const product = await Product.findById(productId).populate("reviews.user", "name _id");;
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// adimin routes logic

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, countInStock } =
      req.body;
    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      countInStock
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, countInStock } = req.body;
    const product=await Product.findById(req.params.id)
    if(!product){
        res.status(401).json({message:"Product not found"})
    }
    product.name=name || product.name
    product.price=price || product.price
    product.description=description || product.description
    product.countInStock=countInStock || product.countInStock
    product.image=image || product.image
    product.category=category || product.category

    const updatedProduct=await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteProduct=async(req,res)=>{
    try{
        const product= await Product.findById(req.params.id);
        if(!product) res.status(401).message({message:"product not found"});

       // await product.findByIdAndDelete(product._id); can use this but is delete quickly
       await Product.findByIdAndDelete(req.params.id);
        res.json({message:"product removed succesfully"})

    }catch(error){
        res.status(500).json({message:error.message})
    }

}

// GET /api/products/:id/related
const getRelatedProducts = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const related = await Product.find({
      category: currentProduct.category,
      _id: { $ne: currentProduct._id },
    }).limit(4); // You can adjust the limit

    res.json(related);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch related products" });
  }
};




export { getProducts, getProductById, createProduct, updateProduct,deleteProduct,getRelatedProducts };
