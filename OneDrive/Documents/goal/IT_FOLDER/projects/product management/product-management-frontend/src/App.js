import React, { useEffect, useState } from "react";
import "./index.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api/products";

// sample products (used only if backend is not running)
const sampleProducts = [
  { 
    id: 1, 
    name: "Classic Watch", 
    price: 99.99, 
    category: "Accessories", 
    description: "Elegant analog watch.", 
    image: "/images/watch.jpg"
  },
  { 
    id: 2, 
    name: "Running Shoes", 
    price: 59.99, 
    category: "Footwear", 
    description: "Comfortable running shoes.", 
    image: "/images/shoes.jpg"
  },
  { 
    id: 3, 
    name: "Bluetooth Headset", 
    price: 29.5, 
    category: "Electronics", 
    description: "Lightweight wireless headset.", 
    image: "/images/headset.jpg"
  },
  { 
    id: 4, 
    name: "Denim Jacket", 
    price: 79.99, 
    category: "Clothing", 
    description: "Stylish blue denim jacket for all seasons.", 
    image: "/images/jacket.jpg"
  },
  { 
    id: 5, 
    name: "Microwave Oven", 
    price: 199.99, 
    category: "Home Appliances", 
    description: "Compact microwave oven with smart settings.", 
    image: "/images/oven.jpg"
  },
  { 
    id: 6, 
    name: "The Great Gatsby", 
    price: 14.99, 
    category: "Books", 
    description: "Classic novel by F. Scott Fitzgerald.", 
    image: "/images/book.jpg"
  },
  { 
    id: 7, 
    name: "Face Cream", 
    price: 19.99, 
    category: "Beauty", 
    description: "Hydrating face cream for glowing skin.", 
    image: "/images/cream.jpg"
  },
  { 
    id: 8, 
    name: "Football", 
    price: 24.99, 
    category: "Sports", 
    description: "Durable football suitable for outdoor play.", 
    image: "/images/football.jpg"
  }
];

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [sortOrder, setSortOrder] = useState("none");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (e) {
      console.warn("Fetch failed, using sample data", e);
      setProducts(sampleProducts);
      setErr("Using sample data (start backend later for real data).");
    } finally {
      setLoading(false);
    }
  }

  function showToastMsg(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleAdd(product) {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Add failed");
      const saved = await res.json();
      const id = saved.id || saved._id || Math.random();
      const newProduct = { ...saved, id };
      setProducts((prev) => [newProduct, ...prev]);
      showToastMsg("Product added");
      setShowAdd(false);
    } catch (e) {
      console.error(e);
      const local = { ...product, id: Date.now() };
      setProducts((prev) => [local, ...prev]);
      showToastMsg("Product added locally (no backend)");
      setShowAdd(false);
    }
  }

  async function handleDelete(product) {
    const id = product.id || product._id;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
      showToastMsg("Product deleted");
    } catch (e) {
      console.warn("Delete failed, removing locally", e);
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
      showToastMsg("Product removed locally");
    } finally {
      setConfirmDelete(null);
    }
  }

  const visibleProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "none") return 0;
      const pa = Number(a.price || 0);
      const pb = Number(b.price || 0);
      return sortOrder === "asc" ? pa - pb : pb - pa;
    });

  return (
    <div className={dark ? "app dark" : "app"}>
      <header className="header">
        <h1>Product Manager</h1>
        <div className="controls">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="none">Sort by price</option>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </select>
          <button onClick={() => setShowAdd(true)}>+ Add Product</button>
          <button className="toggle" onClick={() => setDark((d) => !d)}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <main className="container">
        {loading && <p>Loading products...</p>}
        {err && <p className="error">{err}</p>}
        {!loading && visibleProducts.length === 0 && <p>No products found.</p>}
        <div className="grid">
          {visibleProducts.map((p) => (
            <ProductCard
              key={p.id || p._id}
              product={p}
              onDelete={() => setConfirmDelete(p)}
            />
          ))}
        </div>
      </main>

      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <AddProductForm onCancel={() => setShowAdd(false)} onSave={handleAdd} />
        </Modal>
      )}

      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(null)}>
          <ConfirmModal
            product={confirmDelete}
            onCancel={() => setConfirmDelete(null)}
            onConfirm={() => handleDelete(confirmDelete)}
          />
        </Modal>
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

/* Helper components */

function Modal({ children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

function ProductCard({ product, onDelete }) {
  const { name, price, description, category, image } = product;
  return (
    <div className="card">
      <img
        src={image || "/images/no-image.png"}
        alt={name}
        className="product-img"
      />
      <div className="card-body">
        <h3>{name}</h3>
        <p className="cat">{category}</p>
        <p className="desc">{description}</p>
      </div>
      <div className="card-footer">
        <strong>₹{Number(price).toFixed(2)}</strong>
        <div>
          <button className="btn small danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AddProductForm({ onSave, onCancel }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Name required";
    const p = parseFloat(price);
    if (isNaN(p) || p <= 0) e.price = "Price must be > 0";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    onSave({
      name: name.trim(),
      price: Number(price),
      category,
      description,
      image: image || "/images/no-image.png", // fallback image
    });
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Add Product</h2>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <small className="err">{errors.name}</small>}
      </label>
      <label>
        Price
        <input value={price} onChange={(e) => setPrice(e.target.value)} />
        {errors.price && <small className="err">{errors.price}</small>}
      </label>
      <label>
        Image (local: /images/... OR full URL)
        <input
          placeholder="/images/watch.jpg OR https://example.com/image.jpg"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </label>
      <label>
        Category
        <input value={category} onChange={(e) => setCategory(e.target.value)} />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className="form-actions">
        <button type="button" className="btn ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn primary">
          Save
        </button>
      </div>
    </form>
  );
}

function ConfirmModal({ product, onCancel, onConfirm }) {
  return (
    <div>
      <h3>Delete product?</h3>
      <p>
        Are you sure you want to delete <strong>{product.name}</strong>?
      </p>
      <div className="form-actions">
        <button className="btn ghost" onClick={onCancel}>
          No
        </button>
        <button className="btn danger" onClick={onConfirm}>
          Yes, delete
        </button>
      </div>
    </div>
  );
}

function Toast({ message }) {
  return <div className="toast">{message}</div>;
}

export default App;
