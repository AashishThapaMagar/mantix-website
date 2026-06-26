"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const products = [
  {
    id: "01",
    name: "The Phantom",
    sub: "Black Oversized",
    price: "Rs. 1,499",
    fit: "Oversized Fit",
    accent: "#c8f059",
    color: "black",
    description: "Premium everyday streetwear essential. Oversized silhouette with MANTIX signature graphics.",
    imagePrompt: "black oversized streetwear t-shirt with minimal graphic design, flat lay product shot"
  },
  {
    id: "02",
    name: "The Ghost",
    sub: "White Essential",
    price: "Rs. 1,399",
    fit: "Regular / Oversized",
    accent: "#f0f0f0",
    color: "white",
    description: "Clean minimal design for daily wear. Pure white with subtle MANTIX identity.",
    imagePrompt: "white essential t-shirt with minimal clean design, flat lay product shot"
  },
  {
    id: "03",
    name: "The Venom",
    sub: "Dark Green Signature",
    price: "Rs. 1,499",
    fit: "Oversized Fit",
    accent: "#22c55e",
    color: "dark green",
    description: "Core MANTIX identity colorway. Deep forest green with bold MANTIX signature.",
    imagePrompt: "dark green oversized signature t-shirt with bold graphic design, flat lay product shot"
  },
];

interface Profile {
  name: string;
  height: string;
  weight: string;
  bodyType: string;
  skinTone: string;
  photo: string;
}

export default function TryOnPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selected, setSelected] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [stage, setStage] = useState(0);

  const stages = [
    "Reading your profile…",
    "Analyzing your style…",
    "Fitting the shirt on you…",
    "Almost done…",
  ];

  useEffect(() => {
    const saved = sessionStorage.getItem("mantix_profile");
    if (!saved) { router.push("/profile"); return; }
    setProfile(JSON.parse(saved));
  }, [router]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (generating) {
      interval = setInterval(() => {
        setStage(s => Math.min(s + 1, stages.length - 1));
      }, 8000);
    } else {
      setStage(0);
    }
    return () => clearInterval(interval);
  }, [generating]);

  const handleTryOn = async () => {
    if (!profile) return;
    setGenerating(true);
    setResult(null);
    setError("");

    const product = products[selected];

    try {
      const res = await fetch("/api/kling-tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          product: {
            name: product.name,
            color: product.color,
            fit: product.fit,
            imagePrompt: product.imagePrompt,
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.imageUrl);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `mantix-tryon-${products[selected].id}.png`;
    a.click();
  };

  if (!profile) return null;

  const product = products[selected];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Syncopate:wght@400;700&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020705; color: #eef6ee; overflow-x: hidden; }
        .cormorant { font-family: 'Cormorant Garamond', Georgia, serif; }
        .syncopate { font-family: 'Syncopate', sans-serif; }
        .jost { font-family: 'Jost', sans-serif; }
        .cta-gold {
          display: inline-flex; align-items: center; gap: 14px;
          background: #4ade80; color: #020705;
          font-family: 'Syncopate', sans-serif;
          font-size: 0.48rem; font-weight: 700; letter-spacing: 0.34em;
          text-transform: uppercase; padding: 18px 38px; border: none;
          cursor: pointer; transition: background 0.3s, transform 0.2s;
        }
        .cta-gold:hover { background: #86efac; transform: scale(1.01); }
        .cta-gold:disabled { opacity: 0.5; cursor: default; transform: none; }
        .cta-outline {
          display: inline-flex; align-items: center; gap: 14px;
          background: transparent; color: #eef6ee;
          font-family: 'Syncopate', sans-serif;
          font-size: 0.48rem; font-weight: 400; letter-spacing: 0.34em;
          text-transform: uppercase; padding: 17px 38px;
          border: 1px solid rgba(255,255,255,0.12);
          cursor: pointer; transition: border-color 0.3s, color 0.3s;
        }
        .cta-outline:hover { border-color: #4ade80; color: #4ade80; }
        .product-card {
          border: 1px solid rgba(74,222,128,0.08);
          padding: 24px; cursor: pointer;
          transition: border-color 0.3s, background 0.3s;
        }
        .product-card:hover { border-color: rgba(74,222,128,0.3); }
        .product-card.active { border-color: rgba(74,222,128,0.6); background: rgba(74,222,128,0.04); }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Header */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img src={profile.photo} alt="You" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(74,222,128,0.4)" }} />
          <span className="jost" style={{ fontSize: "0.75rem", color: "#8da195" }}>{profile.name}</span>
        </div>
      </header>

      <main style={{ minHeight: "100vh", padding: "100px 64px 80px", maxWidth: "1200px", margin: "0 auto" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>

          {/* LEFT — Product Selection */}
          <div>
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <div style={{ width: "28px", height: "1px", background: "#4ade80" }} />
                <span className="syncopate" style={{ fontSize: "0.48rem", letterSpacing: "0.42em", color: "#4ade80", textTransform: "uppercase" }}>Step 2 of 2</span>
              </div>
              <h1 className="cormorant" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, fontStyle: "italic", color: "#eef6ee", lineHeight: 0.95, marginBottom: "16px" }}>
                Pick your<br /><em style={{ color: "#4ade80" }}>piece.</em>
              </h1>
              <p className="jost" style={{ color: "#8da195", fontSize: "0.9rem", lineHeight: 1.8, fontWeight: 300 }}>
                Select a MANTIX design and see exactly how it looks on you.
              </p>
            </div>

            {/* Product Cards */}
            <div style={{ display: "grid", gap: "16px", marginBottom: "40px" }}>
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className={`product-card ${selected === i ? "active" : ""}`}
                  onClick={() => { setSelected(i); setResult(null); }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div className="syncopate" style={{ fontSize: "0.38rem", letterSpacing: "0.4em", color: selected === i ? p.accent : "#7e9085", marginBottom: "6px" }}>
                        {p.id}
                      </div>
                      <div className="cormorant" style={{ fontSize: "1.3rem", fontWeight: 600, color: "#eef6ee", marginBottom: "4px" }}>{p.name}</div>
                      <div className="jost" style={{ fontSize: "0.8rem", color: "#8da195", fontWeight: 300 }}>{p.sub} · {p.fit}</div>
                    </div>
                    <div>
                      <div className="cormorant" style={{ fontSize: "1.1rem", color: selected === i ? p.accent : "#7e9085", fontWeight: 600 }}>{p.price}</div>
                    </div>
                  </div>
                  {selected === i && (
                    <p className="jost" style={{ fontSize: "0.8rem", color: "#7e9085", lineHeight: 1.7, marginTop: "12px", fontWeight: 300 }}>
                      {p.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Profile Summary */}
            <div style={{ border: "1px solid rgba(74,222,128,0.08)", padding: "20px", marginBottom: "32px" }}>
              <div className="syncopate" style={{ fontSize: "0.38rem", letterSpacing: "0.4em", color: "#4ade80", marginBottom: "14px" }}>YOUR PROFILE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  ["Height", `${profile.height} cm`],
                  ["Weight", `${profile.weight} kg`],
                  ["Build", profile.bodyType],
                  ["Skin Tone", profile.skinTone],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="jost" style={{ fontSize: "0.52rem", color: "#5f7268", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "2px" }}>{label}</div>
                    <div className="jost" style={{ fontSize: "0.85rem", color: "#a3b8aa", textTransform: "capitalize" }}>{value}</div>
                  </div>
                ))}
              </div>
              <a href="/profile" style={{ display: "inline-block", marginTop: "16px", fontSize: "0.62rem", color: "#4ade80", fontFamily: "Jost, sans-serif", letterSpacing: "0.1em", textDecoration: "none" }}>
                Edit profile →
              </a>
            </div>

            <button className="cta-gold" style={{ width: "100%", justifyContent: "center" }} onClick={handleTryOn} disabled={generating}>
              {generating ? "Generating your look…" : `Try On ${product.name} →`}
            </button>

            {error && (
              <p className="jost" style={{ color: "#d98a6a", fontSize: "0.82rem", marginTop: "16px", letterSpacing: "0.05em" }}>{error}</p>
            )}
          </div>

          {/* RIGHT — Result */}
          <div style={{ position: "sticky", top: "100px" }}>
            {!generating && !result && (
              <div style={{
                border: "1px dashed rgba(74,222,128,0.15)",
                background: "rgba(74,222,128,0.01)",
                aspectRatio: "3/4",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "20px",
              }}>
                <img src={profile.photo} alt="You" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(74,222,128,0.3)", opacity: 0.6 }} />
                <div style={{ textAlign: "center" }}>
                  <p className="cormorant" style={{ fontSize: "1.4rem", fontStyle: "italic", color: "#4a5a50", marginBottom: "8px" }}>
                    Your look awaits
                  </p>
                  <p className="jost" style={{ fontSize: "0.72rem", color: "#3d4d43", letterSpacing: "0.1em" }}>
                    Select a design and click Try On
                  </p>
                </div>
              </div>
            )}

            {generating && (
              <div style={{
                border: "1px solid rgba(74,222,128,0.15)",
                background: "rgba(74,222,128,0.02)",
                aspectRatio: "3/4",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "24px",
              }}>
                <div style={{ fontSize: "36px", animation: "pulse 1.5s ease infinite" }}>✦</div>
                <div style={{ textAlign: "center" }}>
                  <p className="cormorant" style={{ fontSize: "1.4rem", fontStyle: "italic", color: "#4ade80", marginBottom: "12px", animation: "pulse 2s ease infinite" }}>
                    {stages[stage]}
                  </p>
                  <p className="jost" style={{ fontSize: "0.72rem", color: "#5f7268", letterSpacing: "0.1em" }}>
                    This takes 30–60 seconds
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {stages.map((_, i) => (
                    <div key={i} style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: i <= stage ? "#4ade80" : "#1a2a1a",
                      transition: "background 0.5s ease",
                      boxShadow: i <= stage ? "0 0 8px rgba(74,222,128,0.6)" : "none"
                    }} />
                  ))}
                </div>
              </div>
            )}

            {result && !generating && (
              <div style={{ animation: "fadeIn 0.6s ease" }}>
                <div style={{
                  border: "1px solid rgba(74,222,128,0.3)",
                  boxShadow: "0 0 40px rgba(74,222,128,0.08)",
                  overflow: "hidden", marginBottom: "20px"
                }}>
                  <img src={result} alt="Your try-on" style={{ width: "100%", display: "block" }} />
                </div>

                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div className="syncopate" style={{ fontSize: "0.38rem", letterSpacing: "0.4em", color: "#4ade80", marginBottom: "8px" }}>
                    {profile.name} IN {product.name.toUpperCase()}
                  </div>
                  <div className="cormorant" style={{ fontSize: "1.2rem", fontStyle: "italic", color: "#8da195" }}>
                    {product.sub} · {product.price}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <button className="cta-gold" style={{ justifyContent: "center", fontSize: "0.42rem", padding: "14px 20px" }} onClick={handleSave}>
                    ⬇ Save Look
                  </button>
                  <a href="#early-access" className="cta-outline" style={{ justifyContent: "center", fontSize: "0.42rem", padding: "14px 20px", textDecoration: "none" }}>
                    Reserve Now →
                  </a>
                </div>

                <button
                  className="jost"
                  onClick={() => setResult(null)}
                  style={{ background: "transparent", border: "none", color: "#5f7268", fontSize: "0.72rem", cursor: "pointer", marginTop: "16px", width: "100%", letterSpacing: "0.1em" }}
                >
                  Try another design →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
