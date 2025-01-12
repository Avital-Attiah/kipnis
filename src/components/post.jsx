import React, { useState } from "react";
import Comments from "./comments";

import "../style/postStyle.css";

const Post = (data) => {
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "" });

  // טיפול בעריכת פוסט
  const handleEditPost = () => {
    const updatedPost = { ...data.selectedPost, title: newPost.title, body: newPost.body };
    fetch(`http://localhost:3001/posts/${data.selectedPost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to update post")))
      .then((updatedPostData) => {
        data.setPosts(data.posts.map((p) => (p.id === updatedPostData.id ? updatedPostData : p)));
        data.setSelectedPost(updatedPostData);
        setIsEditingPost(false);
      })
      .catch((err) => console.error("Error editing post", err));
  };

  // טיפול במחק פוסט
  const handleDeletePost = () => {
    fetch(`http://localhost:3001/posts/${data.selectedPost.id}`, { method: "DELETE" })
      .then(() => {
        data.setPosts(data.posts.filter((p) => p.id !== data.selectedPost.id));
        data.setSelectedPost(null);
      })
      .catch((err) => console.error("Error deleting post", err));
  };

  // טיפול בלחיצה על פוסט
  const handlePostClick = () => {
    if (data.selectedPost?.id === data.post.id) {
      data.setSelectedPost(null); // אם הפוסט שנבחר הוא הפוסט הנוכחי, נסגור אותו
    } else {
      data.setSelectedPost(data.post); // אחרת נבחר את הפוסט הנוכחי
    }
  };

  return (
    <li>
      <button onClick={handlePostClick}>
        {data.post.id}: {data.post.title}
      </button>
      {data.selectedPost?.id === data.post.id && (
        <div>
          {data.allowEditDelete && (
            <>
              <button className="deleteEditBtn" onClick={() => setIsEditingPost(true)}>ערוך</button>
              <button className="deleteEditBtn" onClick={handleDeletePost}>מחק</button>
            </>
          )}
          {isEditingPost ? (
            <>
              <input
                type="text"
                value={newPost.title || data.post.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <textarea
                value={newPost.body || data.post.body}
                onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              />
              <button onClick={handleEditPost}>שמור שינויים</button>
              <button onClick={() => setIsEditingPost(false)}>בטל עריכה</button>
            </>
          ) : (
            <div className="selected-post">
              <p>
                <strong>כותרת:</strong> {data.post.title}
              </p>
              <p>
                <strong>תוכן:</strong> {data.post.body}
              </p>
              <Comments postId={data.post.id} currentUser={data.currentUser} />
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default Post;
