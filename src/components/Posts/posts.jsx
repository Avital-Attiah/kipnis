import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/postStyle.css";
import Post from "./post"

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!currentUser) {
      console.error("No user found in localStorage. Redirecting to login.");
      navigate("/login");
      return;
    }

    // Fetch posts from server
    fetch(`http://localhost:3001/posts?userId=${currentUser.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts", err));
  }, [navigate, currentUser]);

  const filteredPosts = searchTerm
    ? posts.filter(
        (post) =>
          post.title.includes(searchTerm) || post.id.toString().includes(searchTerm)
      )
    : posts;

  const handleAddPost = () => {
    // שלח בקשה לקבלת הפוסטים האחרונים כדי לדעת מה ה-ID האחרון
    fetch("http://localhost:3001/posts")
      .then((res) => res.json())
      .then((data) => {
        const lastPostId = data.length > 0 ? data[data.length - 1].id : 0;
        const post = {
          ...newPost,
          userId: currentUser.id,
          id: lastPostId + 1, // הגדר את ה-ID החדש כ-ID האחרון + 1
        };

        fetch("http://localhost:3001/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(post),
        })
          .then((res) => (res.ok ? res.json() : Promise.reject("Failed to add post")))
          .then((data) => setPosts([...posts, data]))
          .catch((err) => console.error("Error adding post", err));

        setNewPost({ title: "", body: "" }); // אתחל את השדות אחרי ההוספה
      })
      .catch((err) => console.error("Error fetching last post", err));
  };

  const goToOtherPosts = () => {
    navigate("./otherPosts");
  };


  return (
    <div className="container">
      {/* כפתור Home */}
      <button className="homeBtn" onClick={() =>navigate(`/${currentUser.username}/${currentUser.id}/home`)}>Home</button>


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
        <button onClick={handleAddPost} className="addPostBtn">הוסף פוסט</button>
      </div>

      <button className="otherBtn" onClick={() =>navigate(`/${currentUser.username}/${currentUser.id}/otherPosts`)}>
        פוסטים אחרים
      </button>

      <div className="search-bar">
        <input
          type="text"
          placeholder="חפש פוסט לפי כותרת או מזהה"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="my-posts">
        <h2>הפוסטים שלי</h2>
        <ul>
          {filteredPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
              posts={posts}
              setPosts={setPosts}
              currentUser={currentUser}
              allowEditDelete={true}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Posts;
