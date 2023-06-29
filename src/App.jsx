import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import axios from "axios";

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
const Header = () => (
  <header>
    <h1>AI art Gallery</h1>
  </header>
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

  return (
    <div className="App">
      <nav class="navbar navbar-dark bg-dark">
        <div className="m-auto text-light">Art Gallery Portfolio</div>
      </nav>
      <div className="row">
        {galleryArray.map((galleryArrayItem, index) => {
          console.log(galleryArrayItem.url, index);
          return (
            <div key={index} className="col-sm-4 col-md-4 col-4 p-1">
              <img
                src={galleryArrayItem.download_url}
                alt={`image_${galleryArrayItem.id}`}
                height="300"
                width="600"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
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
