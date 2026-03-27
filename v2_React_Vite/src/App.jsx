import { useState, useEffect, useRef } from "react";

/* ─── Google Fonts ─── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

/* ─── Global Styles ─── */
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --primary: #EC4899;
    --secondary: #F472B6;
    --cta: #06B6D4;
    --bg: #FDF2F8;
    --text: #831843;
    --text-muted: #BE185D;
    --white: #ffffff;
    --card-bg: #fff0f8;
    --border: rgba(236, 72, 153, 0.15);
    --font-head: 'Archivo', sans-serif;
    --font-body: 'Space Grotesk', sans-serif;
    --ease: cubic-bezier(0.4, 0, 0.2, 1);
    --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); overflow-x: hidden; }
  ::selection { background: var(--primary); color: white; }
  :focus-visible { outline: 2px solid var(--cta); outline-offset: 3px; border-radius: 2px; }
  * { cursor: none !important; }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-12px) rotate(1deg); }
    66% { transform: translateY(-6px) rotate(-0.5deg); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
  @keyframes slide-in-left {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slide-in-up {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes cursor-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes grain {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-2%, -3%); }
    30% { transform: translate(3%, 2%); }
    50% { transform: translate(-1%, 4%); }
    70% { transform: translate(2%, -2%); }
    90% { transform: translate(-3%, 1%); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes reveal-up {
    from { clip-path: inset(100% 0 0 0); opacity: 0; transform: translateY(20px); }
    to { clip-path: inset(0% 0 0 0); opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 2px; }
`;
document.head.appendChild(globalStyle);

/* ─── Custom Cursor ─── */
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHover, setIsHover] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const onOver = (e) => {
      if (e.target.closest('a, button, [data-hover]')) setIsHover(true);
    };
    const onOut = () => setIsHover(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, width: 8, height: 8,
        borderRadius: "50%", background: "var(--primary)", zIndex: 9999,
        pointerEvents: "none", transition: "transform 0.05s",
        mixBlendMode: "multiply",
      }} />
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0, width: 40, height: 40,
        borderRadius: "50%", border: `1.5px solid ${isHover ? "var(--cta)" : "var(--primary)"}`,
        zIndex: 9998, pointerEvents: "none",
        transition: "border-color 0.3s, transform 0.1s, width 0.3s var(--spring), height 0.3s var(--spring)",
        transform: isHover ? "scale(1.5)" : "scale(1)",
        opacity: 0.7,
      }} />
    </>
  );
}

/* ─── useInView hook ─── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─── Animated Text ─── */
function AnimText({ children, delay = 0, tag = "span", className, style }) {
  const Tag = tag;
  return (
    <Tag className={className} style={{
      display: "block",
      animation: `reveal-up 0.9s var(--ease) ${delay}s both`,
      ...style
    }}>
      {children}
    </Tag>
  );
}

/* ─── Nav ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "20px 48px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(253,242,248,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "none",
      transition: "all 0.4s var(--ease)",
      fontFamily: "var(--font-head)",
    }}>
      <span style={{
        fontWeight: 700, fontSize: 15, letterSpacing: "0.1em",
        color: "var(--text)", textTransform: "uppercase",
      }}>
        ZED<span style={{ color: "var(--primary)" }}>.</span>
      </span>
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        {["Work", "About", "Contact"].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} style={{
            fontSize: 13, fontWeight: 500, color: "var(--text-muted)",
            textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase",
            transition: "color 0.25s",
            position: "relative",
          }}
            onMouseEnter={e => e.target.style.color = "var(--primary)"}
            onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
          >
            {item}
          </a>
        ))}
        <a href="#contact" style={{
          fontSize: 12, fontWeight: 600, color: "white",
          background: "var(--cta)", padding: "8px 20px",
          borderRadius: 100, textDecoration: "none",
          letterSpacing: "0.06em", textTransform: "uppercase",
          transition: "transform 0.25s var(--spring), box-shadow 0.25s",
        }}
          onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 8px 30px rgba(6,182,212,0.4)"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
        >
          Hire me
        </a>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const blobs = [
    { size: 500, x: "10%", y: "20%", color: "#EC489940", delay: 0 },
    { size: 350, x: "70%", y: "10%", color: "#06B6D440", delay: 2 },
    { size: 300, x: "60%", y: "60%", color: "#F472B630", delay: 4 },
  ];

  return (
    <section ref={heroRef} id="hero" style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "0 48px", paddingTop: 100,
    }}>
      {/* Noise overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
        backgroundSize: "200px", animation: "grain 8s steps(10) infinite",
        opacity: 0.6, pointerEvents: "none",
      }} />

      {/* Parallax blobs */}
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          width: b.size, height: b.size,
          left: b.x, top: b.y,
          background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
          filter: "blur(60px)",
          transform: `translate(${mousePos.x * (20 + i * 10)}px, ${mousePos.y * (15 + i * 8)}px)`,
          transition: "transform 0.8s var(--ease)",
          animation: `float ${6 + i * 2}s ease-in-out ${b.delay}s infinite`,
          pointerEvents: "none", zIndex: 0,
        }} />
      ))}

      {/* Grid lines */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      {/* Floating badge */}
      <div style={{
        position: "absolute", right: "8%", top: "25%",
        animation: "float 5s ease-in-out infinite",
        zIndex: 2,
      }}>
        <div style={{
          width: 140, height: 140, borderRadius: "50%",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(253,242,248,0.8)", backdropFilter: "blur(10px)",
          position: "relative",
        }}>
          <svg viewBox="0 0 140 140" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            animation: "spin-slow 20s linear infinite",
          }}>
            <path id="circle-path" d="M70,70 m-55,0 a55,55 0 1,1 110,0 a55,55 0 1,1 -110,0" fill="none" />
            <text style={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-body)", letterSpacing: 4 }}>
              <textPath href="#circle-path">WEB3 DESIGNER · AVAILABLE FOR WORK ·</textPath>
            </text>
          </svg>
          <div style={{
            width: 50, height: 50,
            background: "linear-gradient(135deg, var(--primary), var(--cta))",
            borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 900 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(236,72,153,0.08)", border: "1px solid var(--border)",
          borderRadius: 100, padding: "6px 16px", marginBottom: 32,
          animation: "fade-in 0.6s var(--ease) 0.2s both",
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--cta)", position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "var(--cta)", animation: "pulse-ring 1.5s ease-out infinite",
            }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Web3 · Product · Interface Designer
          </span>
        </div>

        <div style={{ overflow: "hidden", marginBottom: 8 }}>
          <AnimText tag="h1" delay={0.3} style={{
            fontFamily: "var(--font-head)", fontSize: "clamp(60px, 9vw, 130px)",
            fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.03em",
            color: "var(--text)",
          }}>
            DESIGNING
          </AnimText>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 8 }}>
          <AnimText tag="h1" delay={0.45} style={{
            fontFamily: "var(--font-head)", fontSize: "clamp(60px, 9vw, 130px)",
            fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, var(--primary) 30%, var(--cta))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            THE FUTURE
          </AnimText>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 40 }}>
          <AnimText tag="h1" delay={0.6} style={{
            fontFamily: "var(--font-head)", fontSize: "clamp(60px, 9vw, 130px)",
            fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.03em",
            color: "var(--text)", WebkitTextFillColor: "unset",
          }}>
            OF WEB3
          </AnimText>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "center", animation: "slide-in-up 0.8s var(--ease) 0.9s both" }}>
          <a href="#work" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "var(--text)", color: "white",
            padding: "16px 32px", borderRadius: 100,
            textDecoration: "none", fontSize: 13, fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase",
            transition: "transform 0.3s var(--spring), box-shadow 0.3s",
            fontFamily: "var(--font-head)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(131,24,67,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            View Work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#about" style={{
            fontSize: 13, fontWeight: 500, color: "var(--text-muted)",
            textDecoration: "none", letterSpacing: "0.06em",
            display: "flex", alignItems: "center", gap: 8,
            transition: "color 0.25s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            About me
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 48, marginTop: 72,
          animation: "fade-in 0.8s var(--ease) 1.1s both",
          paddingTop: 32, borderTop: "1px solid var(--border)",
        }}>
          {[["5+", "Years"], ["30+", "Projects"], ["12", "Web3 Clients"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 32, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, letterSpacing: "0.06em" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        animation: "fade-in 1s ease 1.4s both",
      }}>
        <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase" }}>Scroll</span>
        <div style={{
          width: 1, height: 40, background: "linear-gradient(to bottom, var(--primary), transparent)",
          animation: "float 2s ease-in-out infinite",
        }} />
      </div>
    </section>
  );
}

/* ─── Marquee ─── */
function Marquee() {
  const items = ["Wallet Design", "DeFi Dashboards", "NFT Platforms", "DAO Interfaces", "Web3 Onboarding", "Token Launchpads", "Cross-chain UX", "Product Strategy"];
  const doubled = [...items, ...items];
  return (
    <div style={{
      overflow: "hidden", padding: "20px 0",
      borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
      background: "rgba(236,72,153,0.04)",
    }}>
      <div style={{ display: "flex", gap: 48, animation: "marquee 20s linear infinite", width: "max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 48, whiteSpace: "nowrap",
          }}>
            <span style={{
              fontSize: 12, fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "var(--text-muted)",
              fontFamily: "var(--font-head)",
            }}>
              {item}
            </span>
            <span style={{ color: "var(--primary)", fontSize: 8 }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Project Card ─── */
function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useInView();

  return (
    <div ref={ref} data-hover style={{
      position: "relative", overflow: "hidden", borderRadius: 16,
      background: project.bg, aspectRatio: project.tall ? "4/5" : "4/3",
      cursor: "pointer",
      transform: inView ? "translateY(0) scale(1)" : "translateY(50px) scale(0.97)",
      opacity: inView ? 1 : 0,
      transition: `transform 0.7s var(--ease) ${index * 0.1}s, opacity 0.7s var(--ease) ${index * 0.1}s`,
      boxShadow: hovered ? "0 30px 80px rgba(131,24,67,0.2)" : "0 4px 20px rgba(131,24,67,0.08)",
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Project image area */}
      <div style={{
        position: "absolute", inset: 0,
        transform: hovered ? "scale(1.06)" : "scale(1)",
        transition: "transform 0.6s var(--ease)",
      }}>
        {/* Decorative SVG illustration */}
        <svg viewBox="0 0 400 300" style={{ width: "100%", height: "100%", opacity: 0.6 }}>
          <defs>
            <linearGradient id={`g${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={project.color1} />
              <stop offset="100%" stopColor={project.color2} />
            </linearGradient>
          </defs>
          {project.shape === "hex" && (
            <g transform="translate(200,150)">
              {[0, 60, 120, 180, 240, 300].map((a, i) => (
                <polygon key={i} points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40"
                  fill="none" stroke={`url(#g${index})`} strokeWidth="1.5"
                  transform={`scale(${1 - i * 0.15}) rotate(${a})`} opacity={0.6 - i * 0.1} />
              ))}
              <circle cx="0" cy="0" r="30" fill={`url(#g${index})`} opacity="0.8" />
            </g>
          )}
          {project.shape === "grid" && (
            <g>
              {Array.from({ length: 6 }, (_, r) =>
                Array.from({ length: 8 }, (_, c) => (
                  <rect key={`${r}-${c}`} x={c * 55 - 10} y={r * 55 - 10}
                    width={40} height={40} rx={8}
                    fill={`url(#g${index})`} opacity={Math.random() * 0.4 + 0.1} />
                ))
              )}
            </g>
          )}
          {project.shape === "wave" && (
            <g>
              {[0, 1, 2, 3, 4].map(i => (
                <path key={i}
                  d={`M0 ${120 + i * 30} Q100 ${80 + i * 30} 200 ${120 + i * 30} T400 ${120 + i * 30}`}
                  fill="none" stroke={`url(#g${index})`} strokeWidth="2" opacity={0.5 - i * 0.08} />
              ))}
              <circle cx="200" cy="150" r="60" fill={`url(#g${index})`} opacity="0.15" />
            </g>
          )}
          {project.shape === "nodes" && (
            <g>
              {[[80, 80], [200, 60], [320, 100], [140, 180], [260, 200], [200, 150]].map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r={i === 5 ? 16 : 8} fill={`url(#g${index})`} opacity="0.9" />
                  {i < 5 && <line x1={x} y1={y} x2="200" y2="150" stroke={`url(#g${index})`} strokeWidth="1" opacity="0.4" />}
                </g>
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* Tag */}
      <div style={{
        position: "absolute", top: 20, left: 20,
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)",
        borderRadius: 100, padding: "5px 14px",
        fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: project.accentColor || "var(--primary)",
        fontFamily: "var(--font-head)",
      }}>
        {project.tag}
      </div>

      {/* Hover overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(131,24,67,0.95) 0%, rgba(131,24,67,0.4) 50%, transparent 100%)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.4s var(--ease)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: 28,
      }}>
        <div style={{
          transform: hovered ? "translateY(0)" : "translateY(20px)",
          transition: "transform 0.4s var(--ease)",
        }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>
            {project.year} · {project.role}
          </div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 8, lineHeight: 1.2 }}>
            {project.title}
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: 20 }}>
            {project.desc}
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--cta)", color: "white",
            padding: "10px 20px", borderRadius: 100,
            fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
          }}>
            View Case Study
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Projects Grid ─── */
const projects = [
  { title: "Nexus Wallet", tag: "DeFi · Mobile", year: "2024", role: "Lead Designer", desc: "Multi-chain wallet with intelligent portfolio management and gas optimization.", bg: "linear-gradient(135deg, #FFF0F8, #FCE7F3)", color1: "#EC4899", color2: "#F472B6", shape: "hex", tall: true },
  { title: "OpenDAO", tag: "DAO · Web App", year: "2024", role: "Product Design", desc: "Governance interface for a 40,000-member DAO. Simplified voting, treasury, and proposals.", bg: "linear-gradient(135deg, #F0FEFF, #ECFEFF)", color1: "#06B6D4", color2: "#0891B2", shape: "nodes", accentColor: "#06B6D4" },
  { title: "PixelVault", tag: "NFT · Platform", year: "2023", role: "UX/UI Design", desc: "Creator-first NFT marketplace. Reduced minting complexity from 12 steps to 3.", bg: "linear-gradient(135deg, #FDF4FF, #FAE8FF)", color1: "#A855F7", color2: "#EC4899", shape: "grid", accentColor: "#A855F7" },
  { title: "ChainScope", tag: "Analytics · Web3", year: "2023", role: "Product Designer", desc: "Real-time blockchain explorer with AI-powered on-chain intelligence dashboard.", bg: "linear-gradient(135deg, #FFF7ED, #FEF3C7)", color1: "#F97316", color2: "#EAB308", shape: "wave", accentColor: "#F97316", tall: true },
  { title: "BridgeFi", tag: "DeFi · Bridge", year: "2023", role: "Lead Designer", desc: "Cross-chain bridge with an elegant, step-by-step transfer flow. Zero failed transactions.", bg: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", color1: "#22C55E", color2: "#06B6D4", shape: "nodes", accentColor: "#22C55E" },
  { title: "MetaPass", tag: "Identity · Web3", year: "2022", role: "UI Designer", desc: "Decentralized identity and credential system for the open metaverse.", bg: "linear-gradient(135deg, #FFF1F2, #FFE4E6)", color1: "#F43F5E", color2: "#EC4899", shape: "hex", accentColor: "#F43F5E" },
];

function Projects() {
  const [titleRef, titleInView] = useInView();
  return (
    <section id="work" style={{ padding: "100px 48px" }}>
      <div ref={titleRef} style={{ marginBottom: 64 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 16, marginBottom: 20,
          opacity: titleInView ? 1 : 0, transform: titleInView ? "none" : "translateY(20px)",
          transition: "all 0.6s var(--ease)",
        }}>
          <div style={{ width: 40, height: 1, background: "var(--primary)" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", fontFamily: "var(--font-head)" }}>
            Selected Work
          </span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-head)", fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)",
          opacity: titleInView ? 1 : 0, transform: titleInView ? "none" : "translateY(30px)",
          transition: "all 0.7s var(--ease) 0.1s",
        }}>
          Projects that<br />
          <span style={{ background: "linear-gradient(135deg, var(--primary), var(--cta))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            push boundaries
          </span>
        </h2>
      </div>

      {/* Masonry-style grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "auto",
        gap: 20,
      }}>
        {projects.map((project, i) => (
          <ProjectCard key={i} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  const [ref, inView] = useInView();
  const skills = ["Figma", "Framer", "Protopie", "Cursor", "React", "Design Systems", "User Research", "Web3 UX"];

  return (
    <section id="about" ref={ref} style={{ padding: "100px 48px", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        {/* Left */}
        <div>
          <div style={{
            display: "flex", alignItems: "center", gap: 16, marginBottom: 24,
            opacity: inView ? 1 : 0, transition: "all 0.6s var(--ease)",
          }}>
            <div style={{ width: 40, height: 1, background: "var(--primary)" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", fontFamily: "var(--font-head)" }}>
              About
            </span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-head)", fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em",
            color: "var(--text)", marginBottom: 28,
            opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(30px)",
            transition: "all 0.7s var(--ease) 0.1s",
          }}>
            I design at the<br />intersection of<br />
            <span style={{ background: "linear-gradient(135deg, var(--primary), var(--cta))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              art & protocol
            </span>
          </h2>

          <p style={{
            fontSize: 15, lineHeight: 1.8, color: "var(--text-muted)", marginBottom: 20,
            opacity: inView ? 1 : 0, transition: "all 0.7s var(--ease) 0.2s",
          }}>
            I'm a product designer specializing in Web3 interfaces — wallets, DEXs, DAOs, and NFT platforms. My design philosophy is simple: decentralized technology should feel as intuitive as the apps people already love.
          </p>
          <p style={{
            fontSize: 15, lineHeight: 1.8, color: "var(--text-muted)", marginBottom: 40,
            opacity: inView ? 1 : 0, transition: "all 0.7s var(--ease) 0.25s",
          }}>
            I'm also a builder — I use Cursor and AI-assisted workflows to ship prototypes fast, and document the process publicly. I believe the best designers in 2025 write code.
          </p>

          {/* Skills */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 10,
            opacity: inView ? 1 : 0, transition: "all 0.7s var(--ease) 0.35s",
          }}>
            {skills.map((s) => (
              <span key={s} style={{
                padding: "7px 16px", borderRadius: 100,
                border: "1px solid var(--border)",
                fontSize: 12, fontWeight: 500, color: "var(--text-muted)",
                background: "var(--card-bg)",
                transition: "all 0.2s",
                fontFamily: "var(--font-head)",
              }}
                onMouseEnter={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.color = "var(--primary)"; e.target.style.background = "rgba(236,72,153,0.06)"; }}
                onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-muted)"; e.target.style.background = "var(--card-bg)"; }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Right – philosophy cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
          opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(40px)",
          transition: "all 0.8s var(--ease) 0.3s",
        }}>
          {[
            { icon: "◈", title: "User-First", desc: "Complexity belongs in the code, never in the UI.", color: "var(--primary)" },
            { icon: "⬡", title: "Motion-Driven", desc: "Animation isn't decoration — it's communication.", color: "var(--cta)" },
            { icon: "◎", title: "System Thinker", desc: "Every component is part of a larger living system.", color: "#A855F7" },
            { icon: "△", title: "Builder-Designer", desc: "I ship prototypes, not just static screens.", color: "#22C55E" },
          ].map((card) => (
            <div key={card.title} data-hover style={{
              padding: 24, borderRadius: 16,
              background: "var(--card-bg)", border: "1px solid var(--border)",
              transition: "transform 0.3s var(--spring), box-shadow 0.3s, border-color 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(131,24,67,0.12)"; e.currentTarget.style.borderColor = card.color; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <div style={{ fontSize: 24, color: card.color, marginBottom: 12 }}>{card.icon}</div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{card.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ─── */
function Contact() {
  const [ref, inView] = useInView();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" ref={ref} style={{
      padding: "100px 48px 80px",
      borderTop: "1px solid var(--border)",
      position: "relative", overflow: "hidden",
    }}>
      {/* BG blobs */}
      <div style={{
        position: "absolute", right: -100, top: -100,
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.08), transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: -80, bottom: -80,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.07), transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24,
          opacity: inView ? 1 : 0, transition: "all 0.6s var(--ease)",
        }}>
          <div style={{ width: 40, height: 1, background: "var(--primary)" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", fontFamily: "var(--font-head)" }}>
            Get In Touch
          </span>
          <div style={{ width: 40, height: 1, background: "var(--primary)" }} />
        </div>

        <h2 style={{
          fontFamily: "var(--font-head)", fontSize: "clamp(36px, 6vw, 72px)",
          fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em",
          color: "var(--text)", marginBottom: 16,
          opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(30px)",
          transition: "all 0.7s var(--ease) 0.1s",
        }}>
          Let's build<br />
          <span style={{ background: "linear-gradient(135deg, var(--primary), var(--cta))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            something together
          </span>
        </h2>

        <p style={{
          fontSize: 15, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 48,
          opacity: inView ? 1 : 0, transition: "all 0.7s var(--ease) 0.2s",
        }}>
          Available for freelance projects, full-time roles, and creative collaborations.
          Based in UAE · Remote-friendly worldwide.
        </p>

        {/* Email form */}
        <div style={{
          display: "flex", gap: 12, justifyContent: "center",
          opacity: inView ? 1 : 0, transition: "all 0.7s var(--ease) 0.3s",
          flexWrap: "wrap",
        }}>
          <input
            type="email" placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              padding: "14px 24px", borderRadius: 100,
              border: "1px solid var(--border)", background: "var(--card-bg)",
              fontSize: 14, color: "var(--text)", outline: "none",
              fontFamily: "var(--font-body)", width: 260,
              transition: "border-color 0.25s, box-shadow 0.25s",
            }}
            onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(236,72,153,0.12)"; }}
            onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
          />
          <button onClick={() => { if (email) setSent(true); }} style={{
            padding: "14px 32px", borderRadius: 100,
            background: sent ? "#22C55E" : "linear-gradient(135deg, var(--primary), #DB2777)",
            color: "white", border: "none", fontSize: 13, fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase",
            fontFamily: "var(--font-head)",
            transition: "transform 0.3s var(--spring), box-shadow 0.3s, background 0.4s",
          }}
            onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 12px 40px rgba(236,72,153,0.4)"; }}
            onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
          >
            {sent ? "✓ Sent!" : "Send message"}
          </button>
        </div>

        {/* Social links */}
        <div style={{
          display: "flex", gap: 24, justifyContent: "center", marginTop: 48,
          opacity: inView ? 1 : 0, transition: "all 0.7s var(--ease) 0.4s",
        }}>
          {[
            { label: "X (Twitter)", icon: "𝕏" },
            { label: "WeChat", icon: "◉" },
            { label: "LinkedIn", icon: "in" },
            { label: "Dribbble", icon: "◎" },
          ].map((s) => (
            <a key={s.label} href="#" style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 12, fontWeight: 600, color: "var(--text-muted)",
              textDecoration: "none", letterSpacing: "0.06em",
              transition: "color 0.25s, transform 0.25s var(--spring)",
              fontFamily: "var(--font-head)",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.transform = "none"; }}
            >
              <span style={{ fontSize: 16 }}>{s.icon}</span> {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 80, paddingTop: 32, borderTop: "1px solid var(--border)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        opacity: inView ? 1 : 0, transition: "all 0.7s var(--ease) 0.5s",
      }}>
        <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
          ZED<span style={{ color: "var(--primary)" }}>.</span>
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          © 2025 · Designed & Built with intention
        </span>
        <a href="#hero" style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 12, color: "var(--text-muted)", textDecoration: "none",
          transition: "color 0.25s",
        }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--primary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          Back to top
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}

/* ─── Root ─── */
export default function Portfolio() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Cursor />
      <Nav />
      <Hero />
      <Marquee />
      <Projects />
      <About />
      <Contact />
    </div>
  );
}
