import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/postStyle.css";
import Comments from "./comments";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const navigate = useNavigate();

  // שליפת המשתמש הנוכחי מ-localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!currentUser) {
      console.error("No user found in localStorage. Redirecting to login.");
      navigate("/login");
      return;
    }

    // טעינת פוסטים בהתאם ל-userId
    if (searchTerm === "") {
      if (currentUser.id) {
        fetch(`http://localhost:3001/posts?userId=${currentUser.id}`)
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch posts");
            return res.json();
          })
          .then((data) => setPosts(data))
          .catch((err) => console.error("Error fetching posts", err));
      }
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.includes(searchTerm) || post.id.toString().includes(searchTerm)
      );
      setPosts(filtered);
    }
  }, [searchTerm]);

  const handleAddPost = () => {
    const post = { ...newPost, userId: currentUser.id };
    fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to add post")))
      .then((data) => setPosts([...posts, data]))
      .catch((err) => console.error("Error adding post", err));
    setNewPost({ title: "", body: "" });
  };

  const handleEditPost = () => {
    const updatedPost = { ...selectedPost, title: newPost.title, body: newPost.body };
    fetch(`http://localhost:3001/posts/${selectedPost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to update post")))
      .then((updatedPostData) => {
        setPosts(posts.map((post) => (post.id === updatedPostData.id ? updatedPostData : post)));
        setSelectedPost(updatedPostData);
        setIsEditingPost(false);
      })
      .catch((err) => console.error("Error editing post", err));
  };

  const handleDeletePost = () => {
    fetch(`http://localhost:3001/posts/${selectedPost.id}`, { method: "DELETE" })
      .then(() => {
        setPosts(posts.filter((post) => post.id !== selectedPost.id));
        setSelectedPost(null);
      })
      .catch((err) => console.error("Error deleting post", err));
  };

  const handleSelectPost = (post) => {
    setSelectedPost(post);
  };

  const goToOtherPosts = () => {
    navigate("./otherPosts");
  };

  return (
    <div className="container">
      {/* כפתור להוספת פוסט */}
      <div className="add-post">
        <h2>הוסף פוסט חדש</h2>
        <input
          type="text"
          placeholder="כותרת"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="תוכן"
          value={newPost.body}
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
        />
        <button onClick={handleAddPost}>הוסף פוסט</button>
      </div>
      <button className="otherBtn" onClick={goToOtherPosts}>
        פוסטים אחרים
      </button>

      {/* תיבת חיפוש */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="חפש פוסט לפי כותרת או מזהה"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* רשימת הפוסטים שלי */}
      <div className="my-posts">
        <h2>הפוסטים שלי</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <button onClick={() => handleSelectPost(post)}>
                {post.id}: {post.title}
              </button>
              {post.id === selectedPost?.id && (
                <div>
                  <button onClick={() => setIsEditingPost(true)}>ערוך</button>
                  <button onClick={handleDeletePost}>מחק</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* פרטי פוסט */}
      {selectedPost && (
        <div className="post-details">
          <h2>פרטי פוסט</h2>
          {isEditingPost ? (
            <>
              <input
                type="text"
                value={newPost.title || selectedPost?.title || ""}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <textarea
                value={newPost.body || selectedPost?.body || ""}
                onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              />
              <button onClick={handleEditPost}>שמור שינויים</button>
              <button onClick={() => setIsEditingPost(false)}>בטל עריכה</button>
            </>
          ) : (
            <>
              <p>
                <strong>כותרת:</strong> {selectedPost.title}
              </p>
              <p>
                <strong>תוכן:</strong> {selectedPost.body}
              </p>
              <Comments postId={selectedPost.id} currentUser={currentUser} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;
