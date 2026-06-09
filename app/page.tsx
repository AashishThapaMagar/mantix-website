"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [activeProduct, setActiveProduct] = useState(0);
  const [formStatus, setFormStatus] = useState("idle");
  const [vibe, setVibe] = useState("");
  const [matchResult, setMatchResult] = useState("");
  const [matchStatus, setMatchStatus] = useState("idle");
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });

    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const products = [
    {
      id: "01",
      name: "Black Oversized",
      sub: "The Phantom",
      price: "Rs. 1,499",
      fit: "Oversized Fit",
      detail: "Premium everyday streetwear essential",
      bgColor: "#0a0a0a",
      accent: "#c8f059",
    },
    {
      id: "02",
      name: "White Essential",
      sub: "The Ghost",
      price: "Rs. 1,399",
      fit: "Regular / Oversized",
      detail: "Clean minimal design for daily wear",
      bgColor: "#1a1a1a",
      accent: "#f0f0f0",
    },
    {
      id: "03",
      name: "Dark Green Signature",
      sub: "The Venom",
      price: "Rs. 1,499",
      fit: "Oversized Fit",
      detail: "Core MANTIX identity colorway",
      bgColor: "#0d2b1a",
      accent: "#22c55e",
    },
  ];

  const faqs = [
    {
      q: "When does the first MANTIX drop launch?",
      a: "MANTIX launches its first limited drop in 2026. Join the early-access waitlist to be notified first and lock in early pricing before we go public.",
    },
    {
      q: "How do I know my size?",
      a: "All three pieces come in S, M, L, XL, and XXL. The Phantom and The Venom are oversized fits; The Ghost can be worn regular or oversized. Between sizes and want a relaxed look? Size up.",
    },
    {
      q: "Where do you deliver?",
      a: "We deliver across Nepal, including Kathmandu, Pokhara, and other major cities. Tell us your city when you reserve and we'll confirm delivery details as the drop gets closer.",
    },
    {
      q: "How can I pay?",
      a: "For the first drop we plan to support cash on delivery alongside popular digital wallets used in Nepal. Final options are confirmed with early-access members before launch.",
    },
    {
      q: "What makes MANTIX different?",
      a: "Every MANTIX piece is an original, intentional design — not a generic print. We start precise with a small limited drop, keep premium quality affordable, and let customer feedback shape future collections.",
    },
    {
      q: "Is this a limited release?",
      a: "Yes. The first collection is a limited test drop of three signature pieces. Early-access members get first pick of designs and sizes.",
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setFormStatus("sending");

    const formData = new FormData(form);
    formData.append("access_key", "5b5e889c-93c0-41d7-9e0a-279f4a738398");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setFormStatus("done");
        form.reset();
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  }

  async function handleStyleMatch() {
    if (!vibe.trim() || matchStatus === "loading") return;
    setMatchStatus("loading");
    setMatchResult("");
    try {
      const res = await fetch("/api/style-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMatchStatus("error");
        setMatchResult(data.error || "Something went wrong. Please try again.");
        return;
      }
      setMatchStatus("done");
      setMatchResult(data.recommendation);
    } catch {
      setMatchStatus("error");
      setMatchResult("Could not reach the AI. Please try again.");
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Syncopate:wght@400;700&family=Jost:wght@200;300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; cursor: none; }
        body { cursor: none; background: #060606; overflow-x: hidden; }
        a, button { cursor: none; }

        :root {
          --gold: #c9a84c;
          --gold-light: #e8c96a;
          --gold-dim: rgba(201,168,76,0.15);
          --green: #22c55e;
          --white: #f5f3ef;
          --off: #1a1a1a;
          --muted: #4a4a4a;
          --bg: #060606;
        }

        .cursor-ring {
          position: fixed; top: 0; left: 0;
          width: 40px; height: 40px;
          border: 1px solid var(--gold);
          border-radius: 50%;
          pointer-events: none; z-index: 9999;
          transition: transform 0.12s ease;
          mix-blend-mode: difference;
        }
        .cursor-dot {
          position: fixed; top: 0; left: 0;
          width: 6px; height: 6px;
          background: var(--gold);
          border-radius: 50%;
          pointer-events: none; z-index: 9999;
          transition: transform 0.04s linear;
        }

        .cormorant { font-family: 'Cormorant Garamond', Georgia, serif; }
        .syncopate { font-family: 'Syncopate', sans-serif; }
        .jost { font-family: 'Jost', sans-serif; }

        .intro {
          position: fixed; inset: 0; z-index: 1000;
          background: #060606;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 20px;
          transition: opacity 0.9s ease 1.8s, visibility 0.9s ease 1.8s;
        }
        .intro.hide { opacity: 0; visibility: hidden; pointer-events: none; }
        .intro-line {
          width: 0; height: 1px; background: var(--gold);
          animation: introExpand 1.2s cubic-bezier(0.76,0,0.24,1) 0.3s forwards;
        }
        @keyframes introExpand { to { width: 200px; } }
        .intro-label {
          font-family: 'Syncopate', sans-serif;
          font-size: 0.5rem; letter-spacing: 0.55em;
          color: var(--gold); text-transform: uppercase;
          opacity: 0; animation: fadeUp 0.7s ease 1s forwards;
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        .reveal {
          opacity: 0; transform: translateY(28px);
          transition: opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal.in { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.1s; }
        .d2 { transition-delay: 0.25s; }
        .d3 { transition-delay: 0.42s; }
        .d4 { transition-delay: 0.6s; }

        .nav-link {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem; font-weight: 300;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: #505050; text-decoration: none;
          position: relative; padding-bottom: 3px;
          transition: color 0.3s;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 1px; background: var(--gold);
          transition: width 0.35s ease;
        }
        .nav-link:hover { color: var(--gold); }
        .nav-link:hover::after { width: 100%; }

        .gold-hr {
          width: 40px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          border: none;
        }

        .eyebrow {
          display: flex; align-items: center; gap: 16px;
          font-family: 'Syncopate', sans-serif;
          font-size: 0.48rem; letter-spacing: 0.42em;
          text-transform: uppercase; color: var(--gold);
        }
        .eyebrow::before {
          content: ''; display: block;
          width: 28px; height: 1px;
          background: var(--gold); flex-shrink: 0;
        }

        .cta-gold {
          display: inline-flex; align-items: center; gap: 14px;
          background: var(--gold); color: #060606;
          font-family: 'Syncopate', sans-serif;
          font-size: 0.48rem; font-weight: 700; letter-spacing: 0.34em;
          text-transform: uppercase; text-decoration: none;
          padding: 18px 38px; border: none;
          position: relative; overflow: hidden;
          transition: background 0.3s, transform 0.2s;
        }
        .cta-gold::after {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.5s;
        }
        .cta-gold:hover::after { left: 100%; }
        .cta-gold:hover { background: var(--gold-light); transform: scale(1.01); }

        .cta-outline {
          display: inline-flex; align-items: center; gap: 14px;
          background: transparent; color: var(--white);
          font-family: 'Syncopate', sans-serif;
          font-size: 0.48rem; font-weight: 400; letter-spacing: 0.34em;
          text-transform: uppercase; text-decoration: none;
          padding: 17px 38px;
          border: 1px solid rgba(255,255,255,0.12);
          transition: border-color 0.3s, color 0.3s;
        }
        .cta-outline:hover { border-color: var(--gold); color: var(--gold); }

        .product-tab {
          border: none; background: none;
          font-family: 'Syncopate', sans-serif;
          font-size: 0.42rem; letter-spacing: 0.36em; text-transform: uppercase;
          color: #2e2e2e; padding: 12px 0;
          border-bottom: 1px solid transparent;
          transition: color 0.3s, border-color 0.3s;
          cursor: none;
        }
        .product-tab.active { color: var(--gold); border-bottom-color: var(--gold); }
        .product-tab:hover:not(.active) { color: #6a6a6a; }

        .marquee-outer { overflow: hidden; }
        .marquee-track {
          display: flex; width: max-content;
          animation: marqueeAnim 32s linear infinite;
        }
        @keyframes marqueeAnim { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .feature-row {
          display: grid; grid-template-columns: 56px 1fr;
          gap: 32px; align-items: start;
          padding: 40px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .feature-row:last-child { border-bottom: none; }

        .form-field {
          width: 100%; background: transparent; border: none;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 14px 0; color: var(--white);
          font-family: 'Jost', sans-serif; font-size: 0.88rem; font-weight: 300;
          letter-spacing: 0.05em; outline: none;
          transition: border-color 0.3s;
        }
        .form-field:focus { border-bottom-color: var(--gold); }
        .form-field::placeholder { color: #282828; }
        .form-field option { background: #0a0a0a; color: var(--white); }

        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 900; opacity: 0.032;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          animation: grainDrift 0.5s steps(1) infinite;
        }
        @keyframes grainDrift {
          0%   { background-position: 0px 0px; }
          25%  { background-position: -50px 30px; }
          50%  { background-position: 70px -40px; }
          75%  { background-position: -20px 60px; }
          100% { background-position: 0px 0px; }
        }

        @media (max-width: 900px) {
          .hide-sm { display: none !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          html, body { cursor: auto !important; }
        }
      `}</style>

      {/* Film grain */}
      <div className="grain" />

      {/* Custom cursor */}
      <div ref={cursorRef} className="cursor-ring hide-sm" />
      <div ref={cursorDotRef} className="cursor-dot hide-sm" />

      {/* Intro loader */}
      <div className={`intro ${loaded ? "hide" : ""}`}>
        <div className="intro-line" />
        <div className="intro-label">MANTIX — 2026</div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━ HEADER */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 64px", height: "76px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrollY > 60 ? "rgba(6,6,6,0.93)" : "transparent",
        borderBottom: scrollY > 60 ? "1px solid rgba(201,168,76,0.1)" : "1px solid transparent",
        backdropFilter: scrollY > 60 ? "blur(28px)" : "none",
        transition: "all 0.55s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", inset: "-6px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(201,168,76,0.22), transparent 70%)",
            }} />
            <Image src="/MANTIX_LOGO.png" alt="MANTIX" width={42} height={42}
              style={{ borderRadius: "50%", position: "relative", filter: "drop-shadow(0 0 14px rgba(201,168,76,0.55))" }}
            />
          </div>
          <div>
            <div className="syncopate" style={{ fontSize: "0.88rem", color: "#c9a84c", letterSpacing: "0.34em", lineHeight: 1 }}>MANTIX</div>
            <div className="jost" style={{ fontSize: "0.46rem", letterSpacing: "0.42em", color: "#2e2e2e", textTransform: "uppercase", marginTop: "3px" }}>Designed T-Shirts · Nepal</div>
          </div>
        </a>

        <nav className="hide-sm" style={{ display: "flex", gap: "44px" }}>
          {[["Collection", "#collection"], ["Vision", "#why"], ["Early Access", "#early-access"], ["Contact", "#contact"]].map(([label, href]) => (
            <a key={label} href={href} className="nav-link">{label}</a>
          ))}
        </nav>

        <a href="#early-access" className="cta-gold hide-sm" style={{ padding: "13px 26px", fontSize: "0.44rem" }}>
          Early Access →
        </a>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━ HERO */}
      <section style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden", background: "#060606" }}>

        {/* Ambient glow top-right */}
        <div style={{
          position: "absolute", top: "8%", right: "-8%",
          width: "65vw", height: "65vw", maxWidth: "900px", maxHeight: "900px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(201,168,76,0.065) 0%, transparent 65%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        {/* Green accent bottom-left */}
        <div style={{
          position: "absolute", bottom: "5%", left: "5%",
          width: "40vw", height: "40vw", maxWidth: "500px", maxHeight: "500px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(34,197,94,0.04) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />

        {/* Vertical rule */}
        <div className="hide-sm" style={{
          position: "absolute", top: 0, left: "64px", bottom: 0,
          width: "1px",
          background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.12) 25%, rgba(201,168,76,0.12) 75%, transparent)",
        }} />

        {/* Main grid */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "120px 100px 80px", maxWidth: "1480px", margin: "0 auto", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "80px", alignItems: "center", width: "100%" }} className="two-col">

            {/* COPY */}
            <div>
              <div className={`eyebrow reveal ${loaded ? "in" : ""} d1`} style={{ marginBottom: "44px" }}>
                First Collection · Nepal · 2026
              </div>

              {/* Hero headline */}
              <div className={`reveal ${loaded ? "in" : ""} d2`}>
                <div className="cormorant" style={{ fontSize: "clamp(66px, 10.5vw, 152px)", fontWeight: 300, fontStyle: "italic", lineHeight: 0.88, color: "#f5f3ef", letterSpacing: "-0.02em" }}>
                  Wear
                </div>
                <div className="cormorant" style={{
                  fontSize: "clamp(66px, 10.5vw, 152px)", fontWeight: 700, fontStyle: "normal",
                  lineHeight: 0.88,
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(255,255,255,0.28)",
                  letterSpacing: "-0.01em",
                }}>
                  YOUR
                </div>
                <div className="cormorant" style={{
                  fontSize: "clamp(66px, 10.5vw, 152px)", fontWeight: 300, fontStyle: "italic",
                  lineHeight: 0.92,
                  color: "#c9a84c",
                  textShadow: "0 0 80px rgba(201,168,76,0.3)",
                  letterSpacing: "-0.02em",
                }}>
                  Identity.
                </div>
              </div>

              <p className={`jost reveal ${loaded ? "in" : ""} d3`} style={{
                fontSize: "1rem", fontWeight: 300, lineHeight: 1.9,
                color: "#484848", maxWidth: "440px",
                marginTop: "44px", marginBottom: "52px",
                letterSpacing: "0.04em",
              }}>
                Not just a T-shirt. A declaration. MANTIX launches with three precision-crafted pieces built for Nepal&apos;s next generation — where streetwear meets sharp identity.
              </p>

              <div className={`reveal ${loaded ? "in" : ""} d3`} style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "72px" }}>
                <a href="#collection" className="cta-gold">Explore Designs ↓</a>
                <a href="#early-access" className="cta-outline">Reserve Now</a>
              </div>

              {/* Micro stats */}
              <div className={`reveal ${loaded ? "in" : ""} d4`} style={{ display: "flex", gap: "0", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "32px" }}>
                {[["3", "Signature pieces"], ["Limited", "Test drop only"], ["Rs.1,399", "Starting price"]].map(([val, label], i) => (
                  <div key={label} style={{ flex: 1, paddingLeft: i === 0 ? 0 : "32px", borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="cormorant" style={{ fontSize: "1.9rem", fontWeight: 600, color: "#c9a84c", lineHeight: 1 }}>{val}</div>
                    <div className="jost" style={{ fontSize: "0.58rem", color: "#2e2e2e", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "5px" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* LOGO DISPLAY */}
            <div className={`reveal ${loaded ? "in" : ""} d2`} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ position: "relative", width: "420px", height: "520px", display: "flex", alignItems: "center", justifyContent: "center" }}>

                {/* Orbiting rings */}
                <div style={{
                  position: "absolute", inset: "20px",
                  border: "1px solid rgba(201,168,76,0.08)", borderRadius: "50%",
                  animation: "orbit1 45s linear infinite",
                }} />
                <div style={{
                  position: "absolute", inset: "60px",
                  border: "1px dashed rgba(201,168,76,0.05)", borderRadius: "50%",
                  animation: "orbit1 30s linear infinite reverse",
                }} />
                <style>{`
                  @keyframes orbit1 { to { transform: rotate(360deg); } }
                  @keyframes breathe { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.04) translateY(-8px)} }
                `}</style>

                {/* Orbital dots */}
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <div key={i} style={{
                    position: "absolute", top: "50%", left: "50%",
                    width: i % 2 === 0 ? "5px" : "3px",
                    height: i % 2 === 0 ? "5px" : "3px",
                    borderRadius: "50%",
                    background: `rgba(201,168,76,${i % 2 === 0 ? 0.35 : 0.15})`,
                    transform: `rotate(${deg}deg) translateX(190px) translate(-50%,-50%)`,
                  }} />
                ))}

                {/* Center glow */}
                <div style={{
                  position: "absolute", inset: "80px", borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 70%)",
                  filter: "blur(30px)",
                }} />

                {/* Logo */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <Image
                    src="/MANTIX_LOGO.png"
                    alt="MANTIX"
                    width={260}
                    height={260}
                    priority
                    style={{
                      filter: "drop-shadow(0 0 60px rgba(201,168,76,0.65)) drop-shadow(0 4px 30px rgba(0,0,0,0.8))",
                      animation: "breathe 8s ease-in-out infinite",
                    }}
                  />
                </div>

                {/* Monogram label */}
                <div className="syncopate" style={{
                  position: "absolute", bottom: "24px",
                  fontSize: "0.38rem", letterSpacing: "0.55em", color: "rgba(201,168,76,0.28)",
                  textTransform: "uppercase",
                }}>
                  SS — 2026 — NEPAL
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Ghost marquee */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.035)", overflow: "hidden" }}>
          <div className="marquee-track" style={{ padding: "16px 0" }}>
            {Array(2).fill(null).map((_, k) => (
              <div key={k} style={{ display: "flex", alignItems: "center" }}>
                {["MANTIX", "·", "DESIGNED T-SHIRTS", "·", "NEPAL", "·", "SMART FASHION", "·", "SHARP IDENTITY", "·", "LIMITED DROP", "·", "2026", "·"].map((w, i) => (
                  <span key={i} className="cormorant" style={{
                    fontSize: "clamp(60px, 9vw, 120px)", fontWeight: 300,
                    fontStyle: i % 4 === 0 ? "italic" : "normal",
                    color: w === "·" ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.03)",
                    padding: "0 18px", lineHeight: 1, whiteSpace: "nowrap",
                  }}>{w}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━ COLLECTION */}
      <section id="collection" style={{ background: "#060606", padding: "140px 100px" }}>
        <div style={{ maxWidth: "1480px", margin: "0 auto" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "80px", flexWrap: "wrap", gap: "32px" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: "28px" }}>The Collection · First Drop</div>
              <h2 className="cormorant" style={{ fontSize: "clamp(48px, 6vw, 88px)", fontWeight: 300, fontStyle: "italic", color: "#f5f3ef", lineHeight: 0.94 }}>
                Three pieces.<br /><em style={{ color: "#c9a84c" }}>One vision.</em>
              </h2>
            </div>
            <p className="jost" style={{ maxWidth: "320px", color: "#303030", fontSize: "0.84rem", lineHeight: 1.95, fontWeight: 300, letterSpacing: "0.04em" }}>
              Each design carries a name, a character, a statement. These aren&apos;t just shirts — they&apos;re the first chapter of something much larger.
            </p>
          </div>

          {/* Tab selector */}
          <div style={{ display: "flex", gap: "48px", borderBottom: "1px solid rgba(255,255,255,0.04)", marginBottom: "0" }}>
            {products.map((p, i) => (
              <button key={p.id} className={`product-tab ${activeProduct === i ? "active" : ""}`} onClick={() => setActiveProduct(i)}>
                {p.id} — {p.name}
              </button>
            ))}
          </div>

          {/* Product showcase */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            border: "1px solid rgba(201,168,76,0.07)", borderTop: "none",
            minHeight: "560px", transition: "all 0.4s ease",
          }} className="two-col">

            {/* Visual panel */}
            <div style={{
              background: `radial-gradient(ellipse at 50% 55%, ${products[activeProduct].bgColor} 0%, #060606 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
              borderRight: "1px solid rgba(201,168,76,0.06)",
              minHeight: "500px",
            }}>
              {/* Grid overlay */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }} />
              {/* Ghost number */}
              <div className="cormorant" style={{
                position: "absolute", right: "-1vw", bottom: "-4vw",
                fontSize: "20vw", fontWeight: 700,
                color: "transparent", WebkitTextStroke: "1px rgba(201,168,76,0.05)",
                lineHeight: 1, pointerEvents: "none", userSelect: "none",
              }}>
                {products[activeProduct].id}
              </div>
              {/* Logo */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{
                  position: "absolute", inset: "-60px", borderRadius: "50%",
                  background: `radial-gradient(circle, ${products[activeProduct].accent}1a 0%, transparent 70%)`,
                  filter: "blur(16px)",
                }} />
                <Image
                  src="/MANTIX_LOGO.png"
                  alt={products[activeProduct].name}
                  width={230}
                  height={230}
                  style={{
                    filter: `drop-shadow(0 0 50px ${products[activeProduct].accent}55)`,
                    position: "relative", transition: "filter 0.5s",
                  }}
                />
              </div>
            </div>

            {/* Info panel */}
            <div style={{ padding: "64px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div className="syncopate" style={{ fontSize: "0.38rem", letterSpacing: "0.52em", color: "rgba(201,168,76,0.35)", marginBottom: "22px" }}>
                  {products[activeProduct].id} / 03 — Limited Edition
                </div>
                <div className="cormorant" style={{ fontSize: "1rem", fontStyle: "italic", color: "#c9a84c", marginBottom: "10px", letterSpacing: "0.1em" }}>
                  &ldquo;{products[activeProduct].sub}&rdquo;
                </div>
                <h3 className="cormorant" style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 600, color: "#f5f3ef", lineHeight: 1.05, marginBottom: "28px" }}>
                  {products[activeProduct].name}
                </h3>
                <hr className="gold-hr" style={{ marginBottom: "28px" }} />
                <p className="jost" style={{ color: "#383838", fontSize: "0.85rem", lineHeight: 1.9, fontWeight: 300, marginBottom: "8px" }}>
                  {products[activeProduct].detail}
                </p>
                <p className="jost" style={{ color: "#282828", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {products[activeProduct].fit}
                </p>
              </div>

              <div>
                <div style={{ marginBottom: "32px" }}>
                  <div className="jost" style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: "#282828", textTransform: "uppercase", marginBottom: "10px" }}>Starting at</div>
                  <div className="cormorant" style={{ fontSize: "3.4rem", fontWeight: 600, color: "#c9a84c", lineHeight: 1 }}>{products[activeProduct].price}</div>
                </div>
                <a href="#early-access" className="cta-gold" style={{ width: "100%", justifyContent: "center" }}>
                  Reserve This Piece →
                </a>
                {/* Sizes */}
                <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                  {["S", "M", "L", "XL", "XXL"].map(s => (
                    <div key={s} className="jost" style={{
                      width: "38px", height: "38px",
                      border: "1px solid rgba(255,255,255,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.6rem", color: "#282828", letterSpacing: "0.08em",
                    }}>{s}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━ AI STYLE MATCH */}
      <section id="style-match" style={{ background: "#06080a", padding: "140px 100px", borderTop: "1px solid rgba(201,168,76,0.07)", borderBottom: "1px solid rgba(201,168,76,0.07)" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <div className="eyebrow" style={{ justifyContent: "center", marginBottom: "28px" }}>AI Style Match</div>
          <h2 className="cormorant" style={{ fontSize: "clamp(40px, 6vw, 76px)", fontWeight: 300, fontStyle: "italic", color: "#f5f3ef", lineHeight: 0.95, marginBottom: "24px" }}>
            Find your<br /><em style={{ color: "#c9a84c" }}>piece.</em>
          </h2>
          <p className="jost" style={{ color: "#8a8a8a", fontSize: "0.9rem", lineHeight: 1.9, fontWeight: 300, maxWidth: "440px", margin: "0 auto 48px" }}>
            Describe your style or mood, and our AI matches you with the MANTIX piece that fits you best.
          </p>

          <div style={{ marginBottom: "24px" }}>
            <input
              className="form-field"
              style={{ textAlign: "center", borderBottom: "1px solid rgba(201,168,76,0.25)" }}
              placeholder="e.g. minimal, all-black, low-key..."
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleStyleMatch(); }}
            />
          </div>

          <button
            type="button"
            className="cta-gold"
            onClick={handleStyleMatch}
            disabled={matchStatus === "loading"}
            style={{ justifyContent: "center", fontSize: "0.5rem" }}
          >
            {matchStatus === "loading" ? "Matching..." : "Find My Piece →"}
          </button>

          {matchStatus === "done" && (
            <div style={{ marginTop: "48px", padding: "40px", border: "1px solid rgba(201,168,76,0.18)", background: "rgba(201,168,76,0.02)" }}>
              <div className="syncopate" style={{ fontSize: "0.4rem", letterSpacing: "0.5em", color: "rgba(201,168,76,0.5)", textTransform: "uppercase", marginBottom: "18px" }}>Your Match</div>
              <p className="cormorant" style={{ fontSize: "clamp(18px, 2.4vw, 26px)", fontStyle: "italic", color: "#f5f3ef", lineHeight: 1.5 }}>
                {matchResult}
              </p>
            </div>
          )}
          {matchStatus === "error" && (
            <div className="jost" style={{ marginTop: "32px", color: "#d98a6a", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
              {matchResult}
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━ QUOTE INTERLUDE */}
      <section style={{
        background: "#06080a",
        borderTop: "1px solid rgba(201,168,76,0.08)",
        borderBottom: "1px solid rgba(201,168,76,0.08)",
        padding: "120px 100px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "70vw", height: "70vw", maxWidth: "800px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.038) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div className="cormorant" style={{ fontSize: "clamp(13px, 1.8vw, 20px)", fontStyle: "italic", color: "rgba(201,168,76,0.4)", marginBottom: "36px", letterSpacing: "0.1em" }}>
            — A word from MANTIX —
          </div>
          <blockquote className="cormorant" style={{
            fontSize: "clamp(30px, 5vw, 64px)", fontWeight: 300, fontStyle: "italic",
            color: "#f5f3ef", lineHeight: 1.22, letterSpacing: "-0.01em",
          }}>
            &ldquo;We don&apos;t make T-shirts.<br />We make&nbsp;<em style={{ color: "#c9a84c" }}>statements</em>&nbsp;you wear.&rdquo;
          </blockquote>
          <hr className="gold-hr" style={{ margin: "44px auto", width: "60px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }} />
          <div className="jost" style={{ fontSize: "0.6rem", letterSpacing: "0.36em", color: "#282828", textTransform: "uppercase" }}>
            MANTIX — Nepal — 2026
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━ WHY MANTIX */}
      <section id="why" style={{ background: "#060606", padding: "140px 100px" }}>
        <div style={{ maxWidth: "1480px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.75fr 1.25fr", gap: "100px", alignItems: "start" }} className="two-col">

            <div style={{ position: "sticky", top: "100px" }}>
              <div className="eyebrow" style={{ marginBottom: "28px" }}>The Vision</div>
              <h2 className="cormorant" style={{ fontSize: "clamp(42px, 5vw, 72px)", fontWeight: 300, fontStyle: "italic", color: "#f5f3ef", lineHeight: 0.95, marginBottom: "32px" }}>
                Built different.<br /><span style={{ color: "#c9a84c" }}>By design.</span>
              </h2>
              <hr className="gold-hr" style={{ marginBottom: "32px" }} />
              <p className="jost" style={{ color: "#303030", fontSize: "0.84rem", lineHeight: 1.95, fontWeight: 300 }}>
                MANTIX is Nepal&apos;s next streetwear identity. We start precise, scale with purpose, and let intelligence — artificial and human — guide every future collection.
              </p>
              <div style={{ marginTop: "48px" }}>
                <Image src="/MANTIX_LOGO.png" alt="MANTIX" width={140} height={140}
                  style={{ filter: "drop-shadow(0 0 28px rgba(201,168,76,0.45)) grayscale(10%)", opacity: 0.75 }}
                />
              </div>
            </div>

            <div>
              {[
                { n: "I", title: "Designed T-Shirts", body: "Original MANTIX graphics crafted for everyday style and identity. Every line, every placement — intentional." },
                { n: "II", title: "Modern Streetwear", body: "Minimal, bold, and youth-focused fashion for Nepal's new generation. No compromise on vision." },
                { n: "III", title: "Affordable Premium", body: "We believe exceptional design shouldn't demand exceptional prices. Early customers always get the best." },
                { n: "IV", title: "AI-Powered Future", body: "Your choices and feedback directly shape our next collections. Fashion that listens, learns, and evolves." },
              ].map(item => (
                <div key={item.n} className="feature-row">
                  <div className="cormorant" style={{ fontSize: "2.8rem", fontWeight: 300, fontStyle: "italic", color: "rgba(201,168,76,0.18)", lineHeight: 1, paddingTop: "4px" }}>
                    {item.n}
                  </div>
                  <div>
                    <h3 className="cormorant" style={{ fontSize: "1.45rem", fontWeight: 600, color: "#d8d5d0", marginBottom: "10px" }}>{item.title}</h3>
                    <p className="jost" style={{ color: "#303030", fontSize: "0.84rem", lineHeight: 1.9, fontWeight: 300 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━ FAQ */}
      <section id="faq" style={{ background: "#060606", padding: "140px 100px" }}>
        <div style={{ maxWidth: "1480px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: "80px", alignItems: "start" }} className="two-col">

            <div style={{ position: "sticky", top: "100px" }}>
              <div className="eyebrow" style={{ marginBottom: "28px" }}>Questions</div>
              <h2 className="cormorant" style={{ fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 300, fontStyle: "italic", color: "#f5f3ef", lineHeight: 0.95 }}>
                Good to<br /><span style={{ color: "#c9a84c" }}>know.</span>
              </h2>
            </div>

            <div>
              {faqs.map((f, i) => (
                <details key={i} className="feature-row" style={{ display: "block", padding: "28px 0" }}>
                  <summary className="cormorant" style={{ fontSize: "1.35rem", fontWeight: 600, color: "#d8d5d0", cursor: "pointer", listStyle: "none" }}>
                    {f.q}
                  </summary>
                  <p className="jost" style={{ color: "#8a8a8a", fontSize: "0.86rem", lineHeight: 1.9, fontWeight: 300, marginTop: "14px" }}>
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ structured data — read by Google + AI assistants */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━ EARLY ACCESS */}
      <section id="early-access" style={{ background: "#05080a", padding: "140px 100px", borderTop: "1px solid rgba(201,168,76,0.07)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "88px" }}>
            <Image src="/MANTIX_LOGO.png" alt="MANTIX" width={60} height={60}
              style={{ filter: "drop-shadow(0 0 22px rgba(201,168,76,0.55))", marginBottom: "36px" }}
            />
            <div className="eyebrow" style={{ justifyContent: "center", marginBottom: "28px" }}>Early Access — Limited Spots</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(44px, 6.5vw, 84px)", fontWeight: 300, fontStyle: "italic", color: "#f5f3ef", lineHeight: 0.94, marginBottom: "24px" }}>
              Claim your<br /><em style={{ color: "#c9a84c" }}>place.</em>
            </h2>
            <p className="jost" style={{ color: "#303030", fontSize: "0.86rem", lineHeight: 1.9, fontWeight: 300, maxWidth: "400px", margin: "0 auto" }}>
              Vote on which designs we produce first and lock in early-access pricing before we go public.
            </p>
          </div>

          {/* Form card */}
          <div style={{
            border: "1px solid rgba(201,168,76,0.1)",
            background: "rgba(201,168,76,0.015)",
            padding: "64px",
            position: "relative",
          }}>
            {/* Corner accents */}
            {[
              { top: 0, left: 0, borderWidth: "1px 0 0 1px" },
              { top: 0, right: 0, borderWidth: "1px 1px 0 0" },
              { bottom: 0, left: 0, borderWidth: "0 0 1px 1px" },
              { bottom: 0, right: 0, borderWidth: "0 1px 1px 0" },
            ].map((s, i) => (
              <div key={i} style={{
                position: "absolute", width: "22px", height: "22px",
                borderColor: "rgba(201,168,76,0.35)", borderStyle: "solid", ...s,
              }} />
            ))}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "36px" }}>
              {/* Honeypot — hidden field that blocks spam bots */}
              <input type="checkbox" name="botcheck" style={{ display: "none" }} tabIndex={-1} aria-hidden="true" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }} className="two-col">
                <div>
                  <label className="jost" style={{ fontSize: "0.5rem", letterSpacing: "0.3em", color: "#282828", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Full Name</label>
                  <input name="name" required className="form-field" placeholder="Your name" />
                </div>
                <div>
                  <label className="jost" style={{ fontSize: "0.5rem", letterSpacing: "0.3em", color: "#282828", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Phone</label>
                  <input name="phone" required className="form-field" placeholder="+977 ···" />
                </div>
              </div>

              <div>
                <label className="jost" style={{ fontSize: "0.5rem", letterSpacing: "0.3em", color: "#282828", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>City / District</label>
                <input name="city" className="form-field" placeholder="Kathmandu, Pokhara..." />
              </div>

              <div>
                <label className="jost" style={{ fontSize: "0.5rem", letterSpacing: "0.3em", color: "#282828", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Your Design</label>
                <select name="design" required className="form-field" style={{ appearance: "none" }}>
                  <option value="">Select a design</option>
                  <option>01 — The Phantom (Black Oversized) · Rs. 1,499</option>
                  <option>02 — The Ghost (White Essential) · Rs. 1,399</option>
                  <option>03 — The Venom (Dark Green Signature) · Rs. 1,499</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }} className="two-col">
                <div>
                  <label className="jost" style={{ fontSize: "0.5rem", letterSpacing: "0.3em", color: "#282828", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Size</label>
                  <select name="size" required className="form-field" style={{ appearance: "none" }}>
                    <option value="">Select size</option>
                    {["S", "M", "L", "XL", "XXL"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div />
              </div>

              <div>
                <label className="jost" style={{ fontSize: "0.5rem", letterSpacing: "0.3em", color: "#282828", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Your Vision (optional)</label>
                <textarea name="vision" className="form-field" placeholder="Design, color, or delivery suggestion..." style={{ minHeight: "80px", resize: "none" }} />
              </div>

              <div style={{ paddingTop: "12px" }}>
                <button type="submit" disabled={formStatus === "sending"} className="cta-gold" style={{ width: "100%", justifyContent: "center", fontSize: "0.5rem" }}>
                  {formStatus === "sending" ? "Sending..." : "Submit My Early Access Interest →"}
                </button>
              </div>

              {formStatus === "done" && (
                <div className="jost" style={{ textAlign: "center", color: "#c9a84c", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
                  You&apos;re on the list. We&apos;ll be in touch as the drop gets closer.
                </div>
              )}
              {formStatus === "error" && (
                <div className="jost" style={{ textAlign: "center", color: "#d98a6a", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
                  Something went wrong — please try again.
                </div>
              )}

              <div className="jost" style={{ fontSize: "0.48rem", color: "#1e1e1e", letterSpacing: "0.2em", textAlign: "center", textTransform: "uppercase" }}>
                Your information is private and protected · MANTIX · Nepal
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━ FOOTER */}
      <footer id="contact" style={{ background: "#040404", borderTop: "1px solid rgba(201,168,76,0.07)", padding: "88px 100px 52px" }}>
        <div style={{ maxWidth: "1480px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "60px", marginBottom: "80px" }} className="three-col">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
                <Image src="/MANTIX_LOGO.png" alt="MANTIX" width={40} height={40}
                  style={{ borderRadius: "50%", filter: "drop-shadow(0 0 12px rgba(201,168,76,0.5))" }}
                />
                <div className="syncopate" style={{ fontSize: "0.85rem", color: "#c9a84c", letterSpacing: "0.34em" }}>MANTIX</div>
              </div>
              <p className="cormorant" style={{ fontSize: "1.05rem", fontStyle: "italic", color: "#282828", lineHeight: 1.8, maxWidth: "260px" }}>
                Smart Fashion. Sharp Identity.<br />Nepal&apos;s next streetwear story — starting now.
              </p>
            </div>
            {[
              { title: "Navigate", links: ["Collection", "Vision", "Early Access", "Contact"] },
              { title: "Follow", links: ["Instagram", "TikTok", "Facebook"] },
              { title: "Contact", links: ["mantix@nepal.com", "Kathmandu, NP"] },
            ].map(col => (
              <div key={col.title}>
                <div className="syncopate" style={{ fontSize: "0.38rem", letterSpacing: "0.44em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "24px" }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={{ marginBottom: "16px" }}>
                    <a href="#" className="jost" style={{ color: "#6a6a6a", textDecoration: "none", fontSize: "0.8rem", fontWeight: 300, letterSpacing: "0.06em" }}>{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "28px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <span className="jost" style={{ fontSize: "0.58rem", color: "#5a5a5a", letterSpacing: "0.2em" }}>© 2026 MANTIX. All rights reserved.</span>
            <span className="jost" style={{ fontSize: "0.58rem", color: "#5a5a5a", letterSpacing: "0.2em" }}>Building smart fashion — step by step.</span>
          </div>
        </div>
      </footer>
    </>
  );
}