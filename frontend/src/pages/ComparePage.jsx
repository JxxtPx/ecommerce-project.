import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ComparePage() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [showModal, setShowModal] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products");
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  const toggleSelect = (product) => {
    if (selected.some((p) => p._id === product._id)) {
      setSelected((prev) => prev.filter((p) => p._id !== product._id));
    } else if (selected.length < 3) {
      setSelected((prev) => [...prev, product]);
    } else {
      toast.warn("You can only compare up to 3 products");
    }
  };

  const handleCompare = async () => {
    if (selected.length < 2) {
      return toast.warn("Select at least 2 products to compare");
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const payload = {
        products: selected.map((p) => ({
          name: p.name,
          description: p.description,
        })),
      };
      const { data } = await axiosInstance.post(
        "/ai/compare",
        payload,
        config
      );
      setResult(data.result);
      setShowModal(true);
    } catch (err) {
      toast.error("Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filteredList = products.filter((p) =>
      p.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFiltered(filteredList);
  };

  const handleResetSearch = () => {
    setSearch("");
    setFiltered(products);
  };

  return (
    <div className="container py-5 position-relative">
      <h3 className="mb-4" style={{ color: "#400d18" }}>AI Product Comparison</h3>

      {/* Search Bar */}
      <div className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
        />
        <button className="btn btn-outline-secondary" onClick={handleResetSearch}>
          All Products
        </button>
      </div>

      {/* Product Selection */}
      <div className="row g-3">
        {filtered.map((product) => (
          <div key={product._id} className="col-6 col-md-4 col-lg-3">
            <div
              className={`card shadow-sm p-2 ${
                selected.some((p) => p._id === product._id)
                  ? "border border-2 border-danger"
                  : ""
              }`}
              onClick={() => toggleSelect(product)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ height: "140px", objectFit: "contain" }}
              />
              <div className="mt-2 text-center small fw-semibold">
                {product.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Compare Button on Mobile */}
      <div
        className="d-md-none"
        style={{
          position: "fixed",
          bottom: "70px",
          right: "20px",
          zIndex: 999,
        }}
      >
        <button
          className="btn"
          style={{
            backgroundColor: "#c97b84",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "50px",
            fontWeight: "bold",
          }}
          onClick={handleCompare}
          disabled={loading}
        >
          {loading ? "Comparing..." : "Compare"}
        </button>
      </div>

      {/* Desktop Button */}
      <div className="text-center mt-4 d-none d-md-block">
        <button
          className="btn px-4"
          style={{ backgroundColor: "#c97b84", color: "#fff" }}
          onClick={handleCompare}
          disabled={loading}
        >
          {loading ? "Comparing..." : "Compare Selected Products"}
        </button>
      </div>

      {/* Comparison Result Popup Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Comparison Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {result.split("\n\n").map((section, idx) => (
            <div
              key={idx}
              className="p-3 mb-3 bg-light rounded shadow-sm border"
              style={{ whiteSpace: "pre-wrap", color: "#400d18" }}
            >
              {section}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ComparePage;
