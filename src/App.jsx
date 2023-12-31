import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import Calendar from "react-calendar";
import { loadScript } from "@paypal/paypal-js";

const Header = ({ searchTerm, handleSearch }) => (
  <header>
    <h1>AI Art Gallery</h1>
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearch}
      placeholder="Search..."
    />
  </header>
);

const App = () => {
  const [galleryArray, setGalleryArray] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("https://picsum.photos/v2/list")
      .then(function (response) {
        setGalleryArray(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const addToCart = (image) => {
    const randomPrice = Math.floor(Math.random() * 901) + 100; // RANDOM PRICES
    setCartItems((prevItems) => [
      ...prevItems,
      { ...image, price: randomPrice },
    ]);
  };

  const removeFromCart = (item) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
  };

  const filteredGalleryArray = galleryArray.filter((item) =>
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <div className="app-container">
        <Header searchTerm={searchTerm} handleSearch={handleSearch} />
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/portfolio"
            element={
              <Portfolio
                galleryArray={filteredGalleryArray}
                addToCart={addToCart}
              />
            }
          />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/cart"
            element={
              <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-complete" element={<CheckoutComplete />} />
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
  <div className="home">
    <h2>Welcome to our AI-Generated Photography Website!</h2>
    <p>
      We are at the forefront of innovation in the world of art, using advanced
      AI algorithms to create stunning and unique photographic masterpieces.
    </p>
    <p>
      Explore our collection, meet the artists, and purchase your favorites!
    </p>
  </div>
);

const Portfolio = ({ galleryArray, addToCart }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  Modal.setAppElement("#root");

  return (
    <div className="main">
      <div className="App">
        <div className="row">
          {galleryArray.map((galleryArrayItem, index) => {
            const randomPrice = Math.floor(Math.random() * 901) + 100;
            return (
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
                    <p className="portfolio-item-price">
                      Price: ${randomPrice}
                    </p>{" "}
                    <button
                      className="portfolio-item-add-button"
                      onClick={() => addToCart(galleryArrayItem)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
    </div>
  );
};

const Events = () => (
  <main>
    <div className="main">
      <h2>Upcoming Events</h2>
      <p>Stay tuned for exciting events!</p>
    </div>
    <Calendar />
  </main>
);

const About = () => (
  <div className="about">
    <h2>About</h2>
    <p>Learn more about our mission and vision.</p>
  </div>
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
      total += item.price * quantity;
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
    setQuantities((prevQuantities) => {
      const quantity = prevQuantities[itemId] || 0;
      if (quantity > 0) {
        return {
          ...prevQuantities,
          [itemId]: quantity - 1,
        };
      }
      return prevQuantities;
    });
  };

  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="main">
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={item.download_url}
                alt={`image_${item.id}`}
                width="100"
                height="100"
              />
              <div className="cart-item-info">
                <p>Price: ${item.price}</p>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => decrementQuantity(item.id)}
                  >
                    -
                  </button>
                  <span className="quantity">{quantities[item.id] || 1}</span>
                  <button
                    className="quantity-button"
                    onClick={() => incrementQuantity(item.id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="cart-total">
        <p>Total: ${totalCost}</p>
        <Link
          to={{
            pathname: "/checkout",
            search: `?totalCost=${totalCost}`,
          }}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const totalCost = searchParams.get("totalCost") || 0;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { name, address, phoneNumber });
    setShowThankYouMessage(true);
  };

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
      {showThankYouMessage && (
        <>
          <p>{name}, Thank you for your order!</p>
          <p>Name: {name}</p>
          <p>Address: {address}</p>
          <p>Phone Number: {phoneNumber}</p>
          <p>Total Cost: ${totalCost}</p>
          <p>
            You will receive soon an email with the details of the purchase.
          </p>
        </>
      )}
    </div>
  );
};

const Footer = () => (
  <footer>
    <p>© 2023 AI Art Gallery. All rights reserved.</p>
  </footer>
);

const CheckoutComplete = () => (
  <div className="main">
    <h2>Checkout Complete</h2>
    <p>Your order has been placed successfully.</p>
  </div>
);

export default App;
