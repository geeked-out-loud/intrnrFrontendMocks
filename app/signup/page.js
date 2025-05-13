"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Receptionist from "../components/receptionist";

const styles = {
  container: {
    backgroundColor: "#10202d",
    height: "100vh",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Arial', sans-serif",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    height: "80%",
    backgroundColor: "#10202d",
    borderRadius: "2%",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    margin: "0 auto",
  },
  darkCard: {
    width: "40%",
    height: "100%",
    backgroundColor: "#000d18",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "2% 0 0 2%",
    position: "relative",
  },
  whiteCard: {
    width: "60%",
    height: "100%",
    backgroundColor: "#aec5ca",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "5%",
    borderRadius: "0 2% 2% 0",
    boxSizing: "border-box",
  },
  formWrapper: {
    width: "90%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    textAlign: "left",
  },
  formHeading: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textAlign: "left",
    color: "#000d18",
  },
  inputField: {
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "2px solid #000d18",
    width: "100%",
    boxSizing: "border-box",
  },
  formNote: {
    fontSize: "0.9rem",
    color: "#333",
    textAlign: "left",
    lineHeight: "1.4",
  },
  signUpButton: {
    padding: "0.8rem",
    fontSize: "1rem",
    backgroundColor: "#000d18",
    color: "#ffffff",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: "2%",
    left: "2%",
    padding: "0.5rem 1rem",
    backgroundColor: "#aec5ca",
    color: "#000d18",
    border: "none",
    borderRadius: "0.3rem",
    fontWeight: "bold",
    fontSize: "0.7rem",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    zIndex: 2,
  },
  verificationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, auto)",
    gap: "1rem",
    justifyContent: "center",
    margin: "1.5rem 0",
  },
  verificationInput: {
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    borderRadius: "9999px",
    border: "2px solid #000d18",
    backgroundColor: "#ffffff",
    width: "100px",
    textAlign: "center",
    boxSizing: "border-box",
    outline: "none",
  },
};

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [mnemonic, setMnemonic] = useState("");
  const [verificationStep, setVerificationStep] = useState(false);
  const [blankIndices, setBlankIndices] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  useEffect(() => {
    document.title = "Intrnr | Sign Up",

    Object.assign(document.body.style, { margin: "0", padding: "0", border: "none" });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setMessage({ type: "error", text: "All fields are required." });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return false;
    }
    if (formData.password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return false;
    }
    setMessage({ type: "", text: "" });
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    //fixed mnemonic 
    setMnemonic("young bike rocket banner impulse duck carbon mesh sphere eyebrow letter grain");
    setIsLoading(false);
  };

  const handleDownload = () => {
    const blob = new Blob([mnemonic], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "intrnr_recovery_phrase.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleContinue = () => {
    const indices = new Set();
    while (indices.size < 5) indices.add(Math.floor(Math.random() * 12));
    setBlankIndices([...indices]);
    setVerificationStep(true);
    setUserInputs({});
    setMessage({ type: "", text: "" });
  };

  const handleVerificationChange = (e, idx) => {
    const { value } = e.target;
    setUserInputs((p) => ({ ...p, [idx]: value.trim() }));
  };

  const handleVerificationSubmit = () => {
    const words = mnemonic.split(" ");
    let correct = true;
    blankIndices.forEach((i) => {
      if ((userInputs[i] || "").toLowerCase() !== words[i].toLowerCase()) {
        correct = false;
      }
    });
    if (correct) {
      router.push("/feed");
    } else {
      const remaining = attemptsLeft - 1;
      if (remaining <= 0) {
        setMessage({ type: "error", text: "No attempts left. Please sign up again." });
        setMnemonic("");
        setVerificationStep(false);
        setAttemptsLeft(3);
      } else {
        setMessage({ type: "error", text: `Incorrect. You have ${remaining} attempts left.` });
        setAttemptsLeft(remaining);
      }
    }
  };

  return (
      <div style={styles.container}>
        <div style={styles.cardContainer}>
          <div style={styles.darkCard}>
            <button style={styles.backButton} onClick={() => router.push("/")}>BACK</button>
            <Receptionist />
          </div>

          <div style={styles.whiteCard}>
            {!mnemonic && (
              <form style={styles.formWrapper} onSubmit={handleSubmit}>
                <h2 style={styles.formHeading}>Sign Up.<br/>Be An Intrnr Today</h2>
                {message.text && (
                  <div
                    style={{
                      padding: "0.5rem",
                      borderRadius: "0.3rem",
                      backgroundColor: message.type === "error" ? "#ffdddd" : "#ddffdd",
                      color: message.type === "error" ? "#ff0000" : "#008800",
                      marginBottom: "1rem",
                    }}
                  >
                    {message.text}
                  </div>
                )}
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={styles.inputField}
                  disabled={isLoading}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.inputField}
                  disabled={isLoading}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={styles.inputField}
                  disabled={isLoading}
                />
                <p style={styles.formNote}>
                  This password will get you to Intrnr only on this device. We cannot recover this password.
                </p>
                <button
                  type="submit"
                  style={{
                    ...styles.signUpButton,
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "SIGNING UP..." : "SIGN UP"}
                </button>
              </form>
            )}

            {mnemonic && !verificationStep && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                padding: "2rem",
                boxSizing: "border-box",
              }}>
                <h2 style={{ ...styles.formHeading, textAlign: "center", color: "#000d18" }}>
                  Secure Your Recovery Phrase
                </h2>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "0.5rem",
                  backgroundColor: "#fff",
                  padding: "1rem",
                  borderRadius: "1rem",
                  margin: "1rem 0",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                }}>
                  {mnemonic.split(" ").map((word, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "0.5rem 1rem",
                        border: "1px solid #000d18",
                        borderRadius: "1rem",
                        backgroundColor: "#f4f4f4",
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                    >
                      {i + 1}. {word}
                    </div>
                  ))}
                </div>
                <p style={{
                  ...styles.formNote,
                  textAlign: "center",
                  maxWidth: "400px",
                  marginBottom: "1rem",
                  fontSize: "1rem",
                }}>
                  Please write down or securely store this 12-word phrase. It is your only way to recover your identity on the blockchain. We cannot help retrieve it.
                </p>
                <div style={{ display: "flex", gap: "1rem", width: "90%" }}>
                  <button onClick={handleDownload} style={{ ...styles.signUpButton, padding: "0.8rem 2rem", flex: 1 }}>
                    Download Phrase
                  </button>
                  <button onClick={handleContinue} style={{ ...styles.signUpButton, padding: "0.8rem 2rem", flex: 1 }}>
                    Continue
                  </button>
                </div>
              </div>
            )}

            {verificationStep && (
              <div style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}>
                <h2 style={{ ...styles.formHeading, textAlign: "center", marginBottom: "0.5rem" }}>
                  Verify Your Recovery Phrase
                </h2>
                <p style={{ ...styles.formNote, textAlign: "center", marginBottom: "1.5rem" }}>
                  Fill in the missing words to continue. You have {attemptsLeft} attempt(s) left.
                </p>
                <div style={styles.verificationGrid}>
                  {mnemonic.split(" ").map((word, i) =>
                    blankIndices.includes(i) ? (
                      <input
                        key={i}
                        placeholder={`Word ${i + 1}`}
                        value={userInputs[i] || ""}
                        onChange={(e) => handleVerificationChange(e, i)}
                        style={styles.verificationInput}
                      />
                    ) : (
                      <div
                        key={i}
                        style={{
                          padding: "0.5rem 1rem",
                          border: "1px solid #000d18",
                          borderRadius: "1rem",
                          backgroundColor: "#f4f4f4",
                          fontWeight: "bold",
                          fontSize: "1rem",
                        }}
                      >
                        {i + 1}. {word}
                      </div>
                    )
                  )}
                </div>
                <button
                  onClick={handleVerificationSubmit}
                  style={{ ...styles.signUpButton, maxWidth: "200px", margin: "1rem auto 0" }}
                >
                  Submit
                </button>
                {message.text && (
                  <p style={{
                    color: message.type === "error" ? "#ff0000" : "#008800",
                    marginTop: "1rem",
                  }}>
                    {message.text}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
