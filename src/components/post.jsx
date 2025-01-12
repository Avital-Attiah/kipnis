import React, { useState } from "react";
import Comments from "./comments";

const Post = ({ post, selectedPost, setSelectedPost, posts, setPosts, currentUser }) => {
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", body: "" });
  
    const handleEditPost = () => {
      const updatedPost = { ...selectedPost, title: newPost.title, body: newPost.body };
      fetch(`http://localhost:3001/posts/${selectedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      })
        .then((res) => (res.ok ? res.json() : Promise.reject("Failed to update post")))
        .then((updatedPostData) => {
          setPosts(posts.map((p) => (p.id === updatedPostData.id ? updatedPostData : p)));
          setSelectedPost(updatedPostData);
          setIsEditingPost(false);
        })
        .catch((err) => console.error("Error editing post", err));
    };
  
    const handleDeletePost = () => {
      fetch(`http://localhost:3001/posts/${post.id}`, { method: "DELETE" })
        .then(() => {
          setPosts(posts.filter((p) => p.id !== post.id));
          setSelectedPost(null);
        })
        .catch((err) => console.error("Error deleting post", err));
    };
  
    return (
      <li>
        <button onClick={() => setSelectedPost(post)}>
          {post.id}: {post.title}
        </button>
        {post.id === selectedPost?.id && (
          <div>
            <button onClick={() => setIsEditingPost(true)}>ערוך</button>
            <button onClick={handleDeletePost}>מחק</button>
            {isEditingPost ? (
              <>
                <input
                  type="text"
                  value={newPost.title || post.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
                <textarea
                  value={newPost.body || post.body}
                  onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                />
                <button onClick={handleEditPost}>שמור שינויים</button>
                <button onClick={() => setIsEditingPost(false)}>בטל עריכה</button>
              </>
            ) : (
              <div className="selected-post">
                <p>
                  <strong>כותרת:</strong> {post.title}
                </p>
                <p>
                  <strong>תוכן:</strong> {post.body}
                </p>
                <Comments postId={post.id} currentUser={currentUser} />
              </div>
            )}
          </div>
        )}
      </li>
    );
  };
  
  export default Post;
  
