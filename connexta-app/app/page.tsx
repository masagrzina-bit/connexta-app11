"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const images = [
    "/images/couple1.jpg",
    "/images/couple2.jpg",
    "/images/couple3.jpg",
    "/images/couple4.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // menja sliku svake 4 sekunde
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${images[currentImage]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          marginBottom: "1rem",
          color: "#2563eb", // plava boja
          textShadow: "2px 2px 6px rgba(0,0,0,0.5)", // senka
        }}
      >
        Connexta
      </h1>

      <p
        style={{
          fontSize: "1.5rem",
          color: "#fff", // bela boja
          textShadow: "1px 1px 4px rgba(0,0,0,0.5)", // senka
        }}
      >
        Connect with friends and the world around you
      </p>
    </div>
  );
}
