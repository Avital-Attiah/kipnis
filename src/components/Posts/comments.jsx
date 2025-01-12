import React, { useState, useEffect } from "react";

const Comments = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ title: "", body: "" }); // עדכון למבנה חדש עם title ו-body

  // קריאת תגובות מהשרת
  useEffect(() => {
    fetch(`http://localhost:3001/comments?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Error fetching comments", err));
  }, [postId]);

  // הוספת תגובה
  const handleAddComment = () => {
    if (newComment.title.trim() && newComment.body.trim()) {
      const comment = {
        postId,
        name: newComment.title, // כותרת התגובה שמוכנסת לשדה name
        email: currentUser.email || "user@example.com", // נשתמש ב- email של המשתמש
        body: newComment.body, // גוף התגובה
      };
      fetch("http://localhost:3001/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      })
        .then((res) => res.json())
        .then((data) => setComments([...comments, data]))
        .catch((err) => console.error("Error adding comment", err));
      setNewComment({ title: "", body: "" }); // ריקון השדות אחרי ההוספה
    }
  };

  // מחיקת תגובה
  const handleDeleteComment = (commentId) => {
    fetch(`http://localhost:3001/comments/${commentId}`, { method: "DELETE" })
      .then(() => setComments(comments.filter((comment) => comment.id !== commentId)))
      .catch((err) => console.error("Error deleting comment", err));
  };

  // עריכת תגובה
  const handleEditComment = (comment) => {
    const updatedComment = { ...comment, body: prompt("ערוך את התגובה", comment.body) };
    fetch(`http://localhost:3001/comments/${updatedComment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedComment),
    })
      .then((res) => res.json())
      .then((updated) => setComments(comments.map((c) => (c.id === updated.id ? updated : c))))
      .catch((err) => console.error("Error editing comment", err));
  };

  return (
    <div>
      <h3>תגובות</h3>
      {/* הצגת התגובות */}
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.name}</strong>: {comment.body} {/* הצגת הכותרת של התגובה */}
            {/* הצגת כפתורי מחיקה ועריכה רק אם התגובה שייכת למשתמש הנוכחי */}
            {comment.email === currentUser.email && (
              <>
                <button onClick={() => handleDeleteComment(comment.id)}>מחק</button>
                <button onClick={() => handleEditComment(comment)}>ערוך</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {/* הוספת תגובה חדשה */}
      <input
        type="text"
        placeholder="כותרת התגובה"
        value={newComment.title}
        onChange={(e) => setNewComment({ ...newComment, title: e.target.value })}
      />
      <textarea
        placeholder="תוכן התגובה"
        value={newComment.body}
        onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
      />
      <button onClick={handleAddComment}>הוסף תגובה</button>
    </div>
  );
};

export default Comments;
