import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

const Header = () => (
  <header>
    <h1>AI art Gallery</h1>
  </header>
);

const App = () => (
  <Router>
    <div className="app-container">
      <Header />
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/artist" element={<Artist />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  </Router>
);

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

const Portfolio = () => {
  const [galleryArray, updateGalleryArray] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

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

  Modal.setAppElement("#root");

  return (
    <div className="App">
      <div className="row">
        {galleryArray.map((galleryArrayItem, index) => {
          console.log(galleryArrayItem.url, index);
          return (
            <div key={index} className="col-sm-4 col-md-4 col-4 p-3">
              <img
                src={galleryArrayItem.download_url}
                alt={`image_${galleryArrayItem.id}`}
                height="300"
                width="600"
                onClick={() => setSelectedImage(galleryArrayItem)}
              />
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={selectedImage !== null}
        onRequestClose={() => setSelectedImage(null)}
        style={{
          content: {
            width: "600", 
            height: "300", 
            margin: "auto", 
          },
        }}
      >
        {selectedImage && (
          <div>
            <img
              src={selectedImage.download_url}
              alt={`image_${selectedImage.id}`}
              height="50%"
              width="100%"
              text-align="center"
              justify-content= "center"
            />
          </div>
        )}
      </Modal>
    </div>
  )
}






const Artist = () => {
  const [artistData, setArtistData] = useState([]);

  useEffect(() => {
    // Fetch artist data from the local API
    const fetchArtistData = async () => {
      try {
        // Simulating API response delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Fake artist data
        const artistResponse = [
          {
            id: 1,
            name: "Artist 1",
            price: 100,
            image: "/images/artist1.jpg",
          },
          {
            id: 2,
            name: "Artist 2",
            price: 200,
            image: "/images/A2.jpg",
          },
        ];

        setArtistData(artistResponse);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };

    fetchArtistData();
  }, []);

  // Log the value of the artistData array
  console.log(artistData);

  return (
    <main style={{ display: "flex" }}>
      {artistData.map((artist) => (
        <div key={artist.id} style={{ margin: "0 10px" }}>
          <img className="artist-image" src={artist.image} alt={artist.name} />
          <h3>{artist.name}</h3>
          <p>Price: ${artist.price}</p>
        </div>
      ))}
    </main>
  );
};

const Events = () => <main>{/* Calendar component with some artists */}</main>;

const About = () => (
  <main>
    <p>YCIT 030 project by Lucian Aidan and Jorge Macana</p>
  </main>
);

const Footer = () => (
  <footer>
    <p>Copyright 2023</p>
  </footer>
);

export default App;