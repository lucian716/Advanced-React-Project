import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import Calendar from "react-calendar";

const Header = () => (
  <header>
    <h1>Photography Art Gallery</h1>
  </header>
);

const App = () => {
  const [galleryArray, updateGalleryArray] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    axios
      .get("https://picsum.photos/v2/list")
      .then(function (response) {
        updateGalleryArray(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const addToCart = (image) => {
    setCartItems((prevItems) => [...prevItems, image]);
  };

  const removeFromCart = (item) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
  };

  return (
    <Router>
      <div className="app-container">
        <Header />
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/portfolio"
            element={<Portfolio galleryArray={galleryArray} addToCart={addToCart} />}
          />
          <Route
            path="/artist"
            element={<Artist galleryArray={galleryArray} />}
          />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/cart"
            element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

const Menu = () => (
  <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/portfolio">Portfolio</Link>
      </li>
      <li>
        <Link to="/artist">Artist</Link>
      </li>
      <li>
        <Link to="/events">Events</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/cart">Cart</Link>
      </li>
    </ul>
  </nav>
);

const Home = () => (
  <main>
    <h2>AI art Gallery</h2>
    <p>
      The images were created by DALL-E following instructions from the Artist
      Master, me.
    </p>
  </main>
);

const Portfolio = ({ galleryArray, addToCart }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  Modal.setAppElement("#root");

  return (
    <div className="App">
      <div className="row">
        {galleryArray.map((galleryArrayItem, index) => (
          <div key={index} className="col-sm-4 col-md-4 col-4 p-3">
            <div className="portfolio-item">
              <img
                src={galleryArrayItem.download_url}
                alt={`image_${galleryArrayItem.id}`}
                height="300"
                width="600"
                onClick={() => setSelectedImage(galleryArrayItem)}
              />
              <div className="portfolio-item-info">
                <p className="portfolio-item-price">Price: $100</p>
                <button
                  className="portfolio-item-add-button"
                  onClick={() => addToCart(galleryArrayItem)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={selectedImage !== null}
        onRequestClose={() => setSelectedImage(null)}
        style={{
          content: {
            width: "600px",
            height: "800px",
            margin: "auto",
          },
        }}
      >
        {selectedImage && (
          <div>
            <img
              src={selectedImage.download_url}
              alt={`image_${selectedImage.id}`}
              width="100%"
              height="100%"
              style={{
                objectFit: "contain",
                textAlign: "center",
                justifyContent: "center",
              }}
            />
            <button
              className="modal-close-button"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

const Artist = () => (
  <main>
    <h2>About the Artist</h2>
    <p>The artist is a master in AI-generated art.</p>
  </main>
);

const Events = () => (
  <main>
    <h2>Upcoming Events</h2>
    <p>Stay tuned for exciting events!</p>
    <Calendar />
  </main>
);

const About = () => (
  <main>
    <h2>About the Gallery</h2>
    <p>
      The Photography Art Gallery showcases a collection of AI-generated images
      created by the artist master using the DALL-E model.
    </p>
  </main>
);

const Cart = ({ cartItems, removeFromCart }) => {
  const [quantities, setQuantities] = useState({});
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    calculateTotalCost();
  }, [cartItems, quantities]);

  const calculateTotalCost = () => {
    let total = 0;
    cartItems.forEach((item) => {
      const quantity = quantities[item.id] || 1;
      total += 100 * quantity;
    });
    setTotalCost(total);
  };

  const incrementQuantity = (itemId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: (prevQuantities[itemId] || 0) + 1,
    }));
  };

  const decrementQuantity = (itemId) => {
    if (quantities[itemId] > 1) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: prevQuantities[itemId] - 1,
      }));
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: quantity,
    }));
  };

  const handleCheckout = () => {
    // Implement the checkout logic here
    console.log("Checkout");
  };

  return (
    <main>
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                <img
                  src={item.download_url}
                  alt={`image_${item.id}`}
                  height="100"
                  width="200"
                />
                <p>Price: $100</p>
                <div>
                  Quantity:
                  <button onClick={() => decrementQuantity(item.id)}>-</button>
                  <input
                    type="number"
                    min="1"
                    value={quantities[item.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                  />
                  <button onClick={() => incrementQuantity(item.id)}>+</button>
                </div>
                <button onClick={() => removeFromCart(item)}>Remove</button>
              </li>
            ))}
          </ul>
          <div>
            <p>Total Cost: ${totalCost}</p>
            <button onClick={handleCheckout}>Checkout</button>
          </div>
        </>
      )}
    </main>
  );
};

const Footer = () => (
  <footer>
    <p>&copy; 2023 Photography Art Gallery. All rights reserved.</p>
  </footer>
);

export default App;
