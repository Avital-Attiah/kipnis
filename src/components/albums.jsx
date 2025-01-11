import React, { useState, useEffect } from "react";
import '../style/albumStyle.css'; // Import the CSS file

const Albums = () => {
  const [albums, setAlbums] = useState([]); // All albums
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Selected album
  const [photos, setPhotos] = useState([]); // Photos in the selected album
  const [photosPage, setPhotosPage] = useState(1); // Current page of photos

  // Active user
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userId= currentUser.id;
  // Fetch albums from the server
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3001/albums?userId=${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch albums");
          return res.json();
        })
        .then((data) => setAlbums(data))
        .catch((err) => console.error("Error fetching albums:", err));
    }
  }, [userId]);

  // Filter albums based on the search term
  const filteredAlbums = searchTerm
    ? albums.filter(
        (album) =>
          album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          album.id.toString().includes(searchTerm)
      )
    : albums;

  // Handle album selection
  const handleAlbumClick = (albumId) => {
    setSelectedAlbum(albumId);
    setPhotos([]);
    setPhotosPage(1);
    fetchPhotos(albumId, 1);
  };

  // Fetch photos for the selected album and page
  const fetchPhotos = (albumId, page) => {
    fetch(`http://localhost:3001/photos?albumId=${albumId}&_page=${page}&_limit=10`)
      .then((res) => res.json())
      .then((data) => setPhotos((prev) => [...prev, ...data]))
      .catch((err) => console.error("Error fetching photos:", err));
  };

  // Load more photos
  const loadMorePhotos = () => {
    const nextPage = photosPage + 1;
    setPhotosPage(nextPage);
    fetchPhotos(selectedAlbum, nextPage);
  };

  return (
    <div className="albums-container">
      <h1 className="albums-title">אלבומים</h1>

      {/* Search input when no album is selected */}
      {!selectedAlbum && (
        <input
          type="text"
          placeholder="חפש לפי שם אלבום או מזהה"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="albums-search"
        />
      )}

      {/* List of albums */}
      {!selectedAlbum && (
        <ul className="albums-list">
          {filteredAlbums.map((album) => (
            <li key={album.id} className="album-item" onClick={() => handleAlbumClick(album.id)}>
              <strong>#{album.id}</strong> - {album.title}
            </li>
          ))}
        </ul>
      )}

      {/* Selected album details */}
      {selectedAlbum && (
        <div className="album-details">
          <button className="back-button" onClick={() => setSelectedAlbum(null)}>
            חזור
          </button>
          <h2>תמונות באלבום #{selectedAlbum}</h2>
          <div className="album-images">
            {photos.map((photo) => (
              <div key={photo.id} className="album-image-container">
                <img src={photo.thumbnailUrl} alt={photo.title} />
                <p>{photo.title}</p>
              </div>
            ))}
          </div>
          <button className="load-more-button" onClick={loadMorePhotos}>
            טען עוד
          </button>
        </div>
      )}
    </div>
  );
};

export default Albums;
