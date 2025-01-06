import { useState, useEffect } from "react";

const Albums = () => {
  const [albums, setAlbums] = useState([]); // רשימת כל האלבומים
  const [filteredAlbums, setFilteredAlbums] = useState([]); // רשימת האלבומים המסוננת
  const [search, setSearch] = useState(""); // ערך החיפוש
  const [selectedAlbum, setSelectedAlbum] = useState(null); // אלבום שנבחר
  const [photos, setPhotos] = useState([]); // רשימת התמונות באלבום שנבחר
  const [photosPage, setPhotosPage] = useState(1); // עמוד התמונות הנוכחי באלבום שנבחר

  // משתמש פעיל
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = Array.isArray(storedUser) && storedUser.length > 0 ? storedUser[0].id : null;
  

  // הבאת האלבומים של המשתמש הפעיל
  useEffect(() => {
    const fetchUserAlbums = async () => {
      try {
        const res = await fetch(`http://localhost:3001/albums?userId=${userId}`);
        const data = await res.json();
        setAlbums(data); // שמירת כל האלבומים
        setFilteredAlbums(data); // אתחול רשימת האלבומים המסוננת
      } catch (err) {
        console.error("Error fetching albums:", err);
      }
    };

    if (userId) {
      fetchUserAlbums();
    }
  }, [userId]);

  // חיפוש באלבומים
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setFilteredAlbums(
      albums.filter(
        (album) =>
          album.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
          album.id.toString().includes(e.target.value)
      )
    );
  };

  // הצגת פרטי אלבום עם רשימת תמונות
  const handleAlbumClick = async (albumId) => {
    setSelectedAlbum(albumId);
    setPhotos([]);
    setPhotosPage(1);
    await fetchPhotos(albumId, 1);
  };

  // הבאת תמונות לפי עמוד
  const fetchPhotos = async (albumId, page) => {
    try {
      const res = await fetch(`http://localhost:3001/photos?albumId=${albumId}&_page=${page}&_limit=10`);
      const data = await res.json();
      setPhotos((prevPhotos) => [...prevPhotos, ...data]);
    } catch (err) {
      console.error("Error fetching photos:", err);
    }
  };

  // טעינת תמונות נוספות
  const loadMorePhotos = () => {
    const nextPage = photosPage + 1;
    setPhotosPage(nextPage);
    fetchPhotos(selectedAlbum, nextPage);
  };

  return (
    <div>
      <h1>אלבומים</h1>

      {/* שדה חיפוש */}
      <input
        type="text"
        placeholder="חפש לפי מזהה או שם אלבום"
        value={search}
        onChange={handleSearch}
      />

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

      {/* פרטי האלבום הנבחר */}
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
