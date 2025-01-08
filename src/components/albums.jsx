import React, { useState, useEffect } from "react";

const Albums = () => {
  const [albums, setAlbums] = useState([]); // כל האלבומים
  const [searchTerm, setSearchTerm] = useState(""); // ערך החיפוש
  const [selectedAlbum, setSelectedAlbum] = useState(null); // האלבום שנבחר
  const [photos, setPhotos] = useState([]); // רשימת תמונות באלבום שנבחר
  const [photosPage, setPhotosPage] = useState(1); // עמוד התמונות הנוכחי
  
  // משתמש פעיל
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = Array.isArray(storedUser) && storedUser.length > 0 ? storedUser[0].id : null;

  // טוען את האלבומים מהשרת
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

  // סינון האלבומים לפי ערך החיפוש
  const filteredAlbums = searchTerm
    ? albums.filter(
        (album) =>
          album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          album.id.toString().includes(searchTerm)
      )
    : albums;

  // בחירת אלבום להצגת התמונות
  const handleAlbumClick = (albumId) => {
    setSelectedAlbum(albumId);
    setPhotos([]);
    setPhotosPage(1);
    fetchPhotos(albumId, 1);
  };

  // הבאת תמונות של האלבום שנבחר לפי עמוד
  const fetchPhotos = (albumId, page) => {
    fetch(`http://localhost:3001/photos?albumId=${albumId}&_page=${page}&_limit=10`)
      .then((res) => res.json())
      .then((data) => setPhotos((prev) => [...prev, ...data]))
      .catch((err) => console.error("Error fetching photos:", err));
  };

  // טעינת עמוד תמונות נוסף
  const loadMorePhotos = () => {
    const nextPage = photosPage + 1;
    setPhotosPage(nextPage);
    fetchPhotos(selectedAlbum, nextPage);
  };

  return (
    <div>
      <h1>אלבומים</h1>
      
      {/* הצגת תיבת החיפוש אם לא נבחר אלבום */}
      {!selectedAlbum && (
        <input
          type="text"
          placeholder="חפש לפי שם אלבום או מזהה"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}

      {/* רשימת האלבומים */}
      {!selectedAlbum && (
        <ul>
          {filteredAlbums.map((album) => (
            <li key={album.id} onClick={() => handleAlbumClick(album.id)}>
              <strong>#{album.id}</strong> - {album.title}
            </li>
          ))}
        </ul>
      )}

      {/* הצגת פרטי אלבום שנבחר */}
      {selectedAlbum && (
        <div>
          <button onClick={() => setSelectedAlbum(null)}>חזור</button>
          <h2>תמונות באלבום #{selectedAlbum}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {photos.map((photo) => (
              <div key={photo.id} style={{ textAlign: "center" }}>
                <img src={photo.thumbnailUrl} alt={photo.title} />
                <p>{photo.title}</p>
              </div>
            ))}
          </div>
          <button onClick={loadMorePhotos}>טען עוד</button>
        </div>
      )}
    </div>
  );
};

export default Albums;
