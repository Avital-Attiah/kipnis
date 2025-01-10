import React, { useState, useEffect } from "react";
import Comments from './comments';  // Import the Comments component
import '../style/otherPostStyle.css';

const OtherPosts = () => {
  const [otherUsersPosts, setOtherUsersPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // שדה חיפוש

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser)?.[0] : null;

  useEffect(() => {
    if (!currentUser?.id) {
      console.error("User not logged in or missing ID");
      return;
    }

    fetch(`http://localhost:3001/posts?userId_ne=${currentUser.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch other users' posts");
        return res.json();
      })
      .then((data) => {
        setOtherUsersPosts(data);
        setFilteredPosts(data);  // initialize filtered posts
      })
      .catch((err) => {
        console.error("Error fetching other users' posts", err);
        setOtherUsersPosts([]); // ריקון נתונים במקרה של כשל
        setFilteredPosts([]);  // ריקון filtered posts במקרה של כשל
      });
  }, [currentUser]);

  // סינון הפוסטים לפי חיפוש
  useEffect(() => {
    const filtered = otherUsersPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, otherUsersPosts]);

  const handleSelectPost = (post) => {
    setSelectedPost(post); // לבחור פוסט
  };

  return (
    <div className="container">
      <div>
      <h2 >פוסטים של משתמשים אחרים</h2>

        
        {/* שדה חיפוש */}
        <input 
          type="text" 
          placeholder="חפש פוסט..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        
        {filteredPosts.length === 0 ? (
          <p>לא נמצאו פוסטים התואמים לחיפוש</p>
        ) : (
          <ul>
            {filteredPosts.map((post) => (
              <li key={post.id}>
                <button onClick={() => handleSelectPost(post)}>
                  {post.id}: {post.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* הצגת פרטי הפוסט הנבחר בצד ימין */}
      {selectedPost && (
        <div className={`otherPost-details ${selectedPost ? "open" : ""}`}>
          <h3>{selectedPost.title}</h3>
          <p>{selectedPost.body}</p>
          {/* הצגת התגובות */}
          <Comments
            postId={selectedPost.id}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
};

export default OtherPosts;
