"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const styles = {
  container: {
    backgroundColor: "#0a1a2f",
    height: "100vh",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "row",
    fontFamily: "'Arial', sans-serif",
    overflow: "hidden",
  },
  navigationPane: {
    width: "200px",
    backgroundColor: "#000d18",
    color: "#ffffff",
    borderRight: "1px solid #001a2e",
    display: "flex",
    flexDirection: "column",
    padding: "20px 10px",
    gap: "15px",
    height: "100vh",
    alignItems: "center",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#ffffff",
  },
  navItem: {
    color: "#aec5ca",
    cursor: "pointer",
    fontSize: "1rem",
    padding: "10px",
    borderRadius: "4px",
    transition: "background 0.2s",
    textAlign: "center",
    width: "100%",
  },
  contentWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflowY: "auto",
  },
  searchBarWrapper: {
    padding: "20px",
    backgroundColor: "#0f243c",
    borderBottom: "1px solid #001a2e",
    display: "flex",
    justifyContent: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  searchBar: {
    width: "90%",
    backgroundColor: "#1c334d",
    border: "none",
    borderRadius: "10px",
    padding: "12px 20px",
    color: "#cde3e7",
    fontSize: "1rem",
  },
  contentArea: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#10202d",
  },
  contentItem: {
    backgroundColor: "#001a2e",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
    border: "1px solid #001a2e",
    color: "#cde3e7",
  },
  contentItemTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  actionButton: {
    padding: "0.6rem 1rem",
    backgroundColor: "#000d18",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: "#aec5ca",
    width: "70%",
    maxWidth: "700px",
    borderRadius: "12px",
    padding: "20px",
    position: "relative",
  },
  modalClose: {
    position: "absolute",
    top: "15px",
    right: "15px",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#000d18",
  },
  modalPostTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#000d18",
  },
  modalPostContent: {
    color: "#000d18",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  modalLeftActions: {
    display: "flex",
    gap: "10px",
  },
  modalActionButton: {
    padding: "0.6rem 1rem",
    backgroundColor: "#000d18",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  modalCommentInput: {
    flex: 1,
    padding: "0.6rem",
    borderRadius: "8px",
    border: "2px solid #000d18",
    marginRight: "10px",
    outline: "none",
  },
};

export default function FeedPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [content, setContent] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  //posts data
  const mockPosts = [
    { id: 1, title: "First Post", content: "This is the first mock post." },
    { id: 2, title: "Second Post", content: "This is the second mock post." },
    { id: 3, title: "Another Post", content: "More content here." },
  ];

  useEffect(() => {
    document.title = "Feed | Intrnr";
    Object.assign(document.body.style, {
      margin: "0",
      padding: "0",
      border: "none",
    });

    //auth check
    const ok = localStorage.getItem("intrnr_auth") === "true";
    if (!ok) router.push("/");
    else setUser({ name: "User", role: "Intrnr" });

    setContent(mockPosts);
  }, []);

  const filtered = content.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    setCommentText("");
  };

  const handleLike = () => alert("You liked this post!");
  const handleDislike = () => alert("You disliked this post!");
  const handleSendComment = () => {
    alert(`Comment sent: ${commentText}`);
    setCommentText("");
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navigationPane}>
        <div style={styles.logo}>Logo</div>
        {["Home", "Profile", "Messages", "Settings"].map((item, idx) => (
          <div
            key={idx}
            style={styles.navItem}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1c334d")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {item}
          </div>
        ))}
      </nav>
      <div style={styles.contentWrapper}>
        <div style={styles.searchBarWrapper}>
          <input
            type="text"
            placeholder="Search communities or topics..."
            style={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={styles.contentArea}>
          {filtered.length === 0 ? (
            <p style={{ color: "#ccc" }}>No posts to show.</p>
          ) : (
            filtered.map((item) => (
              <div key={item.id} style={styles.contentItem}>
                <h3 style={styles.contentItemTitle}>{item.title}</h3>
                <p>{item.content}</p>
                <button style={styles.actionButton} onClick={() => handleViewPost(item)}>
                  View Post
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {showModal && selectedPost && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalClose} onClick={handleCloseModal}>×</div>
            <h3 style={styles.modalPostTitle}>{selectedPost.title}</h3>
            <p style={styles.modalPostContent}>{selectedPost.content}</p>
            <div style={styles.modalActions}>
              <div style={styles.modalLeftActions}>
                <button style={styles.modalActionButton} onClick={handleLike}>LIKE</button>
                <button style={styles.modalActionButton} onClick={handleDislike}>DISLIKE</button>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Comment..."
                  style={styles.modalCommentInput}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button style={styles.modalActionButton} onClick={handleSendComment}>SEND</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
