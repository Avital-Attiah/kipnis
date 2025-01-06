import React, { useState, useEffect } from "react";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // פוסטים מסוננים
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [newComment, setNewComment] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // שדה לחיפוש

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser =
    Array.isArray(storedUser) && storedUser.length > 0 ? storedUser[0] : null;

  // הבאת פוסטים מהשרת
  useEffect(() => {
    if (currentUser && currentUser.id) {
      fetch(`http://localhost:3001/posts?userId=${currentUser.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch posts");
          return res.json();
        })
        .then((data) => {
          setPosts(data);
          setFilteredPosts(data); // עדכון הפוסטים המסוננים
        })
        .catch((err) => console.error("Error fetching posts", err));
    }
  }, [currentUser]);

  // סינון הפוסטים בהתבסס על חיפוש
  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.includes(searchTerm) || post.id.toString().includes(searchTerm)
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setEditMode(false);
    fetch(`http://localhost:3001/comments?postId=${post.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch comments");
        return res.json();
      })
      .then((data) => setComments(data))
      .catch((err) => console.error("Error fetching comments", err));
  };

  const handleAddPost = () => {
    const post = { ...newPost, userId: currentUser.id };
    fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add post");
        return res.json();
      })
      .then((data) => {
        setPosts([...posts, data]);
        setFilteredPosts([...posts, data]);
      })
      .catch((err) => console.error("Error adding post", err));
    setNewPost({ title: "", body: "" });
  };

  const handleUpdatePost = (postId) => {
    fetch(`http://localhost:3001/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedPost),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update post");
        return res.json();
      })
      .then((updatedPost) =>
        setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)))
      )
      .catch((err) => console.error("Error updating post", err));
    setEditMode(false);
  };

  const handleDeletePost = (postId) => {
    fetch(`http://localhost:3001/posts/${postId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete post");
        setPosts(posts.filter((post) => post.id !== postId));
        setFilteredPosts(posts.filter((post) => post.id !== postId));
        setSelectedPost(null);
      })
      .catch((err) => console.error("Error deleting post", err));
  };

  const handleAddComment = () => {
    const comment = {
      postId: selectedPost.id,
      name: currentUser.username,
      email: currentUser.email || "user@example.com",
      body: newComment,
    };
    fetch("http://localhost:3001/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add comment");
        return res.json();
      })
      .then((data) => setComments([...comments, data]))
      .catch((err) => console.error("Error adding comment", err));
    setNewComment("");
  };

  return (
    <div>
      <h1>פוסטים</h1>
      <div>
        <h2>חיפוש פוסטים</h2>
        <input
          type="text"
          placeholder="חפש לפי מזהה או כותרת"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        <h2>רשימת פוסטים</h2>
        <ul>
          {filteredPosts.map((post) => (
            <li key={post.id}>
              <button onClick={() => handleSelectPost(post)}>
                {post.id}: {post.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedPost && (
        <div>
          <h2>פרטי פוסט</h2>
          {editMode ? (
            <>
              <label>כותרת:</label>
              <input
                type="text"
                value={selectedPost.title}
                onChange={(e) =>
                  setSelectedPost({ ...selectedPost, title: e.target.value })
                }
              />
              <label>תוכן:</label>
              <textarea
                value={selectedPost.body}
                onChange={(e) =>
                  setSelectedPost({ ...selectedPost, body: e.target.value })
                }
              />
              <button onClick={() => handleUpdatePost(selectedPost.id)}>
                אישור
              </button>
              <button onClick={() => setEditMode(false)}>ביטול</button>
            </>
          ) : (
            <>
              <p>כותרת: {selectedPost.title}</p>
              <p>תוכן: {selectedPost.body}</p>
              <button onClick={() => setEditMode(true)}>שינוי</button>
            </>
          )}
          <button onClick={() => handleDeletePost(selectedPost.id)}>
            מחק פוסט
          </button>
          <h3>תגובות</h3>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.name}</strong>: {comment.body}
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="תגובה חדשה"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>הוסף תגובה</button>
        </div>
      )}
      <div>
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
    </div>
  );
};

export default Posts;
