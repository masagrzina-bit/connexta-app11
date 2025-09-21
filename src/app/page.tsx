"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const images = [
  "/images/couple1.jpg",
  "/images/couple2.jpg",
  "/images/couple3.jpg",
  "/images/couple4.jpg",
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Slide ${index + 1}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 1s ease-in-out",
            opacity: index === current ? 1 : 0,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            color: "#2563eb",
            textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
            fontWeight: "bold",
            letterSpacing: "2px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Connexta
        </h1>

        <p
          style={{
            fontSize: "1.5rem",
            color: "#fff",
            textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
          }}
        >
          Connect with friends and the world around you
        </p>

        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
          <Link href="/login">
            <button
              style={{
                padding: "0.75rem 2rem",
                backgroundColor: "#1877F2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </Link>

          <Link href="/register">
            <button
              style={{
                padding: "0.75rem 2rem",
                backgroundColor: "#42B72A",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
