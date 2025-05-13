"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SignInOptions from "./components/SignInOptions";

const styles = {
  container: {
    backgroundColor: "#10202d",
    height: "200vh",
    margin: 0,
    padding: 0,
  },
  cardContainer: {
    position: "sticky",
    top: 0,
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  whiteCard: {
    position: "absolute",
    top: "10vh",
    left: "10vw",
    height: "75vh",
    width: "80vw",
    backgroundColor: "#aec5ca",
    borderRadius: "22px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
    zIndex: 0,
    overflow: "hidden",
  },
  darkCard: {
    position: "absolute",
    top: "10vh",
    left: "10vw",
    height: "75vh",
    backgroundColor: "#000d18",
    borderRadius: "20px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "width 0.08s linear",
    zIndex: 1,
  },
  logo: {
    width: "85%",
    height: "auto",
  },
  logInContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "32vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};


export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const onValidEmail = (email) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("intrnr_email_hint", email);
    }
    router.replace("/login");
  };

  useEffect(() => {
    document.title = "Welcome to Intrnr";

    setShowPopup(true);
    Object.assign(document.body.style, {
      margin: "0",
      padding: "0",
      border: "none",
    });
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const maxScroll = 200;
  const initialWidth = 80;
  const finalWidth = 48;
  const computedWidthVW =
    scrollY < maxScroll
      ? initialWidth - ((initialWidth - finalWidth) * (scrollY / maxScroll))
      : finalWidth;

  return (
      <div style={styles.container}>
        <div style={styles.cardContainer}>
          <div style={styles.whiteCard}>
            <div style={styles.logInContainer}>
              <SignInOptions onValidEmail={onValidEmail} />
            </div>
          </div>
          <div style={{ ...styles.darkCard, width: `${computedWidthVW}vw` }}>
            /* eslint-disable @next/next/no-img-element */
            <img src="/logo.png" alt="Logo" style={styles.logo} />
          </div>
        </div>
        {showPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
            onClick={() => setShowPopup(false)}
          >
            <div
              style={{
                width: "85%",
                maxWidth: "400px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "30px",
                fontFamily: "'Arial', sans-serif",
                backgroundColor: "#aec5ca",
                borderRadius: "12px",
                overflow: "auto",
                maxHeight: "90vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                style={{
                  width: "100%",
                  margin: "0 0 2px 0",
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  color: "#000d18",
                  textAlign: "left",
                }}
              >
                Welcome to Intrnr!
              </h2>
              <p
                style={{
                  color: "#000d18",
                  width: "100%",
                  fontSize: "1rem",
                  marginBottom: "25px",
                }}
              >{/* eslint-disable react/no-unescaped-entities */}
                <b>This is a Mockup for the Frontend of the Intrnr app. </b><br /><br />
                The app is currently in development and not yet available for use. The purpose of this mock is to develop and test User Interfaces for the app.<br /><br />
                <b>Note:</b> This is not currently tailored for vertical screens, we're working on those currently. The app is not yet available for use. Please do not share any personal information.
              </p>
              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  backgroundColor: "#172a3a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
  );
}
