import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

function AdminEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axiosInstance.get(
        `/products/${id}`
      );
      setProduct(data);
      setName(data.name);
      setPrice(data.price);
      setDescription(data.description);
      setCountInStock(data.countInStock);
      setImage(data.image);
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    const updatedProduct = {
      name,
      price,
      description,
      countInStock,
      image,
      category: product.category || "",
    };

    await axiosInstance.put(
      `/products/${id}`,
      updatedProduct,
      config
    );
    navigate("/admin/products");
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

      const { data } = await axiosInstance.post(
        "/upload",
        formData,
        config
      );
      console.log(data.url);

      setImage(data.url); // Cloudinary URL
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Product</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Price ($)</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label>Category</label>
          <select
            className="form-select"
            value={product?.category || ""}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
          >
            <option value="">-- Select Category --</option>
            <option value="Alcohol">Alcohol</option>
            <option value="Beer">Beer</option>
            <option value="Whiskey">Whiskey</option>
            <option value="Vodka">Vodka</option>
            <option value="Rum">Rum</option>
            <option value="Wine">Wine</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Count In Stock</label>
          <input
            type="number"
            className="form-control"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Image</label>

          {/* Preview of current image */}
          {image && (
            <div className="mb-2">
              <img
                src={image}
                alt="Preview"
                style={{
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}

          <input
            type="file"
            className="form-control"
            onChange={uploadFileHandler}
            accept="image/*"
          />

          {uploading && (
            <div className="form-text text-info mt-2">Uploading...</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default AdminEditProductPage;
