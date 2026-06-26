"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: "", height: "", weight: "" });
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name || !form.height || !form.weight) {
      setError("Please fill in all fields."); return;
    }
    if (!photo) {
      setError("Please upload your photo."); return;
    }
    sessionStorage.setItem("mantix_profile", JSON.stringify({ ...form, photo }));
    router.push("/tryon");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Syncopate:wght@400;700&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020705; color: #eef6ee; overflow-x: hidden; }
        .cormorant { font-family: 'Cormorant Garamond', Georgia, serif; }
        .syncopate { font-family: 'Syncopate', sans-serif; }
        .jost { font-family: 'Jost', sans-serif; }
        .form-field {
          width: 100%; background: transparent; border: none;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 14px 0; color: #eef6ee;
          font-family: 'Jost', sans-serif; font-size: 0.95rem; font-weight: 300;
          letter-spacing: 0.05em; outline: none; transition: border-color 0.3s;
        }
        .form-field:focus { border-bottom-color: #4ade80; }
        .form-field::placeholder { color: #5f7268; }
        .cta-gold {
          display: inline-flex; align-items: center; gap: 14px;
          background: #4ade80; color: #020705;
          font-family: 'Syncopate', sans-serif;
          font-size: 0.48rem; font-weight: 700; letter-spacing: 0.34em;
          text-transform: uppercase; padding: 18px 38px; border: none;
          cursor: pointer; transition: background 0.3s, transform 0.2s;
        }
        .cta-gold:hover { background: #86efac; transform: scale(1.01); }
        .upload-zone {
          border: 1px dashed rgba(74,222,128,0.3);
          background: rgba(74,222,128,0.02);
          padding: 48px; text-align: center; cursor: pointer;
          transition: border-color 0.3s, background 0.3s;
          border-radius: 2px;
        }
        .upload-zone:hover { border-color: rgba(74,222,128,0.6); background: rgba(74,222,128,0.04); }
      `}</style>

      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 64px", height: "76px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(2,7,5,0.93)", borderBottom: "1px solid rgba(74,222,128,0.1)",
        backdropFilter: "blur(28px)",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <Image src="/mantix-logo.png" alt="MANTIX" width={42} height={42}
            style={{ filter: "drop-shadow(0 0 14px rgba(74,222,128,0.55))" }} />
          <div className="syncopate" style={{ fontSize: "0.88rem", color: "#4ade80", letterSpacing: "0.34em" }}>MANTIX</div>
        </a>
        <div className="jost" style={{ fontSize: "0.62rem", color: "#7e9085", letterSpacing: "0.3em", textTransform: "uppercase" }}>
          Virtual Try-On
        </div>
      </header>

      <main style={{ minHeight: "100vh", padding: "140px 64px 80px", maxWidth: "680px", margin: "0 auto" }}>

        <div style={{ marginBottom: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
            <div style={{ width: "28px", height: "1px", background: "#4ade80" }} />
            <span className="syncopate" style={{ fontSize: "0.48rem", letterSpacing: "0.42em", color: "#4ade80", textTransform: "uppercase" }}>
              Step 1 of 2
            </span>
          </div>
          <h1 className="cormorant" style={{ fontSize: "clamp(44px, 7vw, 84px)", fontWeight: 300, fontStyle: "italic", color: "#eef6ee", lineHeight: 0.92, marginBottom: "20px" }}>
            Your<br /><em style={{ color: "#4ade80" }}>profile.</em>
          </h1>
          <p className="jost" style={{ color: "#8da195", fontSize: "0.95rem", lineHeight: 1.9, fontWeight: 300 }}>
            Upload your photo and tell us your measurements — our AI will show you exactly how the shirt fits on you.
          </p>
        </div>

        <div style={{ display: "grid", gap: "44px" }}>

          {/* Photo Upload — MOST IMPORTANT */}
          <div>
            <label className="jost" style={{ fontSize: "0.56rem", letterSpacing: "0.3em", color: "#7e9085", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>
              Your Photo <span style={{ color: "#4ade80" }}>*</span>
            </label>
            <div className="upload-zone" onClick={() => fileRef.current?.click()}>
              {photo ? (
                <div style={{ display: "flex", alignItems: "center", gap: "28px", justifyContent: "center" }}>
                  <img
                    src={photo}
                    alt="Your photo"
                    style={{
                      width: "100px", height: "120px",
                      objectFit: "cover", objectPosition: "top",
                      border: "2px solid rgba(74,222,128,0.5)",
                      borderRadius: "2px"
                    }}
                  />
                  <div style={{ textAlign: "left" }}>
                    <p className="cormorant" style={{ color: "#4ade80", fontSize: "1.2rem", fontStyle: "italic", marginBottom: "6px" }}>Photo uploaded ✓</p>
                    <p className="jost" style={{ color: "#7e9085", fontSize: "0.78rem", lineHeight: 1.6 }}>
                      This is the face that will<br />appear in your try-on image.
                    </p>
                    <p className="jost" style={{ color: "#5f7268", fontSize: "0.68rem", marginTop: "8px" }}>Click to change</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "40px", marginBottom: "16px" }}>📷</div>
                  <p className="cormorant" style={{ color: "#8da195", fontSize: "1.2rem", fontStyle: "italic", marginBottom: "8px" }}>Upload your photo</p>
                  <p className="jost" style={{ color: "#5f7268", fontSize: "0.75rem", lineHeight: 1.7 }}>
                    Use a full body front-facing photo
Stand straight, arms slightly away from body
Plain background works best<br />
                
                  </p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
          </div>

          {/* Name */}
          <div>
            <label className="jost" style={{ fontSize: "0.56rem", letterSpacing: "0.3em", color: "#7e9085", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Your Name</label>
            <input name="name" className="form-field" placeholder="e.g. Aashish" value={form.name} onChange={handleChange} />
          </div>

          {/* Height + Weight */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
            <div>
              <label className="jost" style={{ fontSize: "0.56rem", letterSpacing: "0.3em", color: "#7e9085", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Height (cm)</label>
              <input name="height" type="number" className="form-field" placeholder="e.g. 175" value={form.height} onChange={handleChange} />
            </div>
            <div>
              <label className="jost" style={{ fontSize: "0.56rem", letterSpacing: "0.3em", color: "#7e9085", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Weight (kg)</label>
              <input name="weight" type="number" className="form-field" placeholder="e.g. 70" value={form.weight} onChange={handleChange} />
            </div>
          </div>

          {error && (
            <p className="jost" style={{ color: "#d98a6a", fontSize: "0.82rem", letterSpacing: "0.05em" }}>{error}</p>
          )}

          <div style={{ paddingTop: "8px" }}>
            <button className="cta-gold" style={{ width: "100%", justifyContent: "center" }} onClick={handleSubmit}>
              Continue to Try-On →
            </button>
          </div>

          <p className="jost" style={{ fontSize: "0.48rem", color: "#6f8276", letterSpacing: "0.2em", textAlign: "center", textTransform: "uppercase" }}>
            Your photo is never stored · Used only for AI generation · MANTIX
          </p>
        </div>
      </main>
    </>
  );
}
