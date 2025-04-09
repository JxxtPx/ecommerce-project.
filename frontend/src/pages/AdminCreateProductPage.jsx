import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

function AdminCreateProductPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    const newProduct = {
      name,
      description,
      price,
      category,
      countInStock,
      image,
    };

    try {
      await axiosInstance.post("/products", newProduct, config);
      navigate("/admin/products");
    } catch (error) {
      console.error("❌ Failed to create product:", error);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axiosInstance.post("/upload", formData, config);
      setImage(data.url);
      setUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Product</h2>
      <form onSubmit={handleCreateProduct}>
        <div className="mb-3">
          <label>Name</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Price ($)</label>
          <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Stock Count</label>
          <input type="number" className="form-control" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <input type="text"  className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>

        <div className="mb-3">
          <label>Upload Image</label>
          <input type="file" className="form-control" onChange={uploadFileHandler} />
          {uploading && <div className="form-text text-info mt-2">Uploading...</div>}
        </div>

        {image && (
          <div className="mb-3">
            <img src={image} alt="Preview" style={{ height: "150px", borderRadius: "8px" }} />
          </div>
        )}

        <button type="submit" className="btn btn-success">Create Product</button>
      </form>
    </div>
  );
}

export default AdminCreateProductPage;
