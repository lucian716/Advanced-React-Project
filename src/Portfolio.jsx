import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function Portfolio() {
  const [galleryArray, updateGalleryArray] = useState([]);
  useEffect(() => {
    axios
      .get("https://picsum.photos/id/27/")
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
export default Portfolio;