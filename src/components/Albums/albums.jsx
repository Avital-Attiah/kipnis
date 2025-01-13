import React, { useState, useEffect } from "react";
import Album from "./album";
import "../../style/albumStyle.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const navigate = useNavigate();

  const { user: currentUser } = useUser(); // קבלת המשתמש מה-Context
  const userId = currentUser.id;

  useEffect(() => {
    if (userId) {
      console.log("try")
      fetch(`http://localhost:3001/albums?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setAlbums(data))
        .catch((err) => console.error("Error fetching albums:", err));
    }
  }, [userId]);

  const filteredAlbums = searchTerm
    ? albums.filter(
        (album) =>
          album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          album.id.toString().includes(searchTerm)
      )
    : albums;

  // Add a new album
  const handleAddAlbum = () => {
    if (!newAlbumTitle.trim()) {
      alert("נא להזין כותרת לאלבום");
      return;
    }

    const newAlbum = {
      title: newAlbumTitle,
      userId: userId,
    };

    fetch("http://localhost:3001/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAlbum),
    })
      .then((res) => res.json())
      .then((data) => {
        setAlbums((prev) => [...prev, data]);
        setNewAlbumTitle(""); // Clear the input field
      })
      .catch((err) => console.error("Error adding album:", err));
  };

  return (
    <>
    <button className="homeBtn" onClick={() =>navigate(`/${currentUser.username}/${currentUser.id}/home`)}>Home</button>
    <div className="albums-container">
      {!selectedAlbum ? (
        <>
          <h1 className="albums-title">אלבומים</h1>
          <input
            type="text"
            placeholder="חפש לפי שם אלבום או מזהה"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="albums-search"
          />
          <ul className="albums-list">
            {filteredAlbums.map((album) => (
              <li
                key={album.id}
                className="album-item"
                onClick={() => setSelectedAlbum(album.id)}
              >
                <strong>#{album.id}</strong> - {album.title}
              </li>
            ))}
          </ul>
          <div className="add-album">
            <h3>הוסף אלבום חדש</h3>
            <input
              type="text"
              placeholder="כותרת האלבום"
              value={newAlbumTitle}
              onChange={(e) => setNewAlbumTitle(e.target.value)}
              className="new-album-input"
            />
            <button onClick={handleAddAlbum} className="add-album-button">
              הוסף אלבום
            </button>
          </div>
        </>
      ) : (
        <Album albumId={selectedAlbum} onBack={() => setSelectedAlbum(null)} />
      )}
    </div>
    </>
  );
};

export default Albums;
