import React, { useState, useEffect } from "react";
import Photo from "./photo";

const Album = ({ albumId, onBack }) => {
  const [photos, setPhotos] = useState([]);
  const [start, setStart] = useState(0);
  const [newPhoto, setNewPhoto] = useState({ title: "", url: "", thumbnailUrl: "" });

  
  useEffect(() => {
    
    setPhotos([]); 
    setStart(0);
    fetchPhotos(albumId, 0);
  }, [albumId]);

  const fetchPhotos = (albumId, start) => {
    fetch(`http://localhost:3001/photos?albumId=${albumId}&_start=${start}&_limit=5`)
      .then((res) => res.json())
      .then((data) => {
        // Add photos only if they are not already in the array
        setPhotos((prev) => {
          const newPhotos = data.filter(
            (photo) => !prev.some((p) => p.id === photo.id)
          );
          return [...prev, ...newPhotos];
        });
      })
      .catch((err) => console.error("Error fetching photos:", err));
  };

  const loadMorePhotos = () => {
    const nextStart = start + 5; // Calculate the next start index
    setStart(nextStart);
    fetchPhotos(albumId, nextStart);
  };

  const handleAddPhoto = () => {
    const photo = { ...newPhoto, albumId };
    fetch("http://localhost:3001/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(photo),
    })
      .then((res) => res.json())
      .then((data) => setPhotos((prev) => [...prev, data]))
      .catch((err) => console.error("Error adding photo:", err));
    setNewPhoto({ title: "", url: "", thumbnailUrl: "" });
  };

  const handleDeletePhoto = (photoId) => {
    fetch(`http://localhost:3001/photos/${photoId}`, { method: "DELETE" })
      .then(() => setPhotos((prev) => prev.filter((photo) => photo.id !== photoId)))
      .catch((err) => console.error("Error deleting photo:", err));
  };

  const handleUpdatePhoto = (updatedPhoto) => {
    setPhotos((prev) =>
      prev.map((photo) => (photo.id === updatedPhoto.id ? updatedPhoto : photo))
    );
  };

  return (
    <div className="album-details">
      <button className="back-button" onClick={onBack}>
        חזור
      </button>
      <h2>תמונות באלבום #{albumId}</h2>
      <div className="album-images">
        {photos.map((photo) => (
          <Photo
            key={photo.id}
            photo={photo}
            onDelete={handleDeletePhoto}
            onUpdate={handleUpdatePhoto}
          />
        ))}
      </div>
      <button className="load-more-button" onClick={loadMorePhotos}>
        טען עוד
      </button>
      <div className="add-photo">
        <h3>הוסף תמונה חדשה</h3>
        <input
          type="text"
          placeholder="כותרת"
          value={newPhoto.title}
          onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL של התמונה"
          value={newPhoto.url}
          onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL של התמונה המוקטנת"
          value={newPhoto.thumbnailUrl}
          onChange={(e) => setNewPhoto({ ...newPhoto, thumbnailUrl: e.target.value })}
        />
        <button onClick={handleAddPhoto}>הוסף תמונה</button>
      </div>
    </div>
  );
};

export default Album;
