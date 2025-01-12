import React, { useState } from "react";

const Photo = ({ photo, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(photo.title);

  const handleDelete = () => {
    onDelete(photo.id);
  };

  const handleUpdate = () => {
    const updatedPhoto = { ...photo, title: newTitle };
    fetch(`http://localhost:3001/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPhoto),
    })
      .then((res) => res.json())
      .then((data) => {
        onUpdate(data);
        setIsEditing(false);
      })
      .catch((err) => console.error("Error updating photo:", err));
  };

  return (
    <div className="photo-container">
      <img src={photo.thumbnailUrl} alt={photo.title} className="photo-thumbnail" />
      {!isEditing ? (
        <>
          <p>
            <strong>ID:</strong> {photo.id}
          </p>
          <p>{photo.title}</p>
          <button onClick={() => setIsEditing(true)}>ערוך</button>
          <button onClick={handleDelete}>מחק</button>
        </>
      ) : (
        <div className="edit-photo">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={handleUpdate}>שמור</button>
          <button onClick={() => setIsEditing(false)}>בטל</button>
        </div>
      )}
    </div>
  );
};

export default Photo;
