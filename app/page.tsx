"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const navItems = ["Work", "About", "Contact"] as const;

const projects = [
  {
    id: "01",
    slug: "noirhaus",
    name: "NoirHaus",
    image: "/projects/noirhaus.png",
    phoneMockup: "/mockups/phone/noirhaus-phone.png",
    tabletMockup: "/mockups/tablet/noirhaus-tablet.png",
    position: "center center",
    type: "Editorial Commerce",
    year: "2026",
    role: "UI / Art Direction",
    focus: "Luxury retail storytelling",
    headline:
      "A premium commerce concept built around atmosphere, visual pacing and high-intent browsing.",
    overview:
      "NoirHaus explores how an architecture and interiors brand could feel more like a cinematic editorial experience than a standard institutional website.",
  },
  {
    id: "02",
    slug: "velora",
    name: "Velora",
    image: "/projects/velora.png",
    phoneMockup: "/mockups/phone/velora-phone.png",
    tabletMockup: "/mockups/tablet/velora-tablet.png",
    position: "center 30%",
    type: "Mobility Interface",
    year: "2026",
    role: "Visual / UI Design",
    focus: "Electric mobility landing",
    headline:
      "A high-energy mobility landing page designed around speed, contrast and product desirability.",
    overview:
      "Velora translates an electric mobility concept into a premium dark interface with strong visual rhythm, motion-driven composition and conversion-focused hierarchy.",
  },
  {
    id: "03",
    slug: "novacare",
    name: "NovaCare",
    image: "/projects/novacare.png",
    phoneMockup: "/mockups/phone/novacare-phone.png",
    tabletMockup: "/mockups/tablet/novacare-tablet.png",
    position: "center 30%",
    type: "Health Platform",
    year: "2026",
    role: "Product UI",
    focus: "Trust and accessibility",
    headline:
      "A healthcare interface focused on softness, trust and calm decision-making.",
    overview:
      "NovaCare was designed as a premium medical care experience, balancing editorial typography, human imagery and accessible service presentation.",
  },
  {
    id: "04",
    slug: "fintrix",
    name: "Fintrix",
    image: "/projects/fintrix.png",
    phoneMockup: "/mockups/phone/fintrix-phone.png",
    tabletMockup: "/mockups/tablet/fintrix-tablet.png",
    position: "center 30%",
    type: "Fintech Platform",
    year: "2026",
    role: "Product Design",
    focus: "Data visibility",
    headline:
      "A private finance platform designed for clarity, confidence and high-value financial perception.",
    overview:
      "Fintrix combines premium fintech aesthetics with clear portfolio data, dark UI depth and interface elements built around trust and exclusivity.",
  },
  {
    id: "05",
    slug: "auralab",
    name: "AuraLab",
    image: "/projects/auralab.png",
    phoneMockup: "/mockups/phone/auralab-phone.png",
    tabletMockup: "/mockups/tablet/auralab-tablet.png",
    position: "center 18%",
    type: "AI Automation",
    year: "2026",
    role: "UI / Brand Direction",
    focus: "Immersive product story",
    headline:
      "An AI automation concept with atmospheric visuals, data cards and a futuristic product narrative.",
    overview:
      "AuraLab uses a cosmic visual system, glowing interface modules and strong contrast to communicate automation, intelligence and scale.",
  },
  {
    id: "06",
    slug: "motiongrid",
    name: "MotionGrid",
    image: "/projects/motiongrid.png",
    phoneMockup: "/mockups/phone/motiongrid-phone.png",
    tabletMockup: "/mockups/tablet/motiongrid-tablet.png",
    position: "center center",
    type: "Creative WebGL",
    year: "2026",
    role: "Product UI",
    focus: "Interactive storytelling",
    headline:
      "A creative WebGL concept built around movement, particles, shaders and immersive visual direction.",
    overview:
      "MotionGrid explores how a digital design lab could present experimental interactive work through high-impact graphics and motion-first composition.",
  },
];

type Project = (typeof projects)[number];
type AboutView = "story" | "contact";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("Unable to create shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(error || "Shader compilation failed.");
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Unable to create WebGL program.");
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(error || "Program link failed.");
  }

  return program;
}

function setCanvasLetterSpacing(ctx: CanvasRenderingContext2D, value: string) {
  const target = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
  target.letterSpacing = value;
}

function useHeroScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      setProgress(clamp(window.scrollY / 470));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return progress;
}

function useFixedSectionVisibility(ref: React.RefObject<HTMLElement | null>) {
  const [visibility, setVisibility] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const section = ref.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;

      const enter = clamp((viewport - rect.top) / (viewport * 0.46));
      const exit = clamp(rect.bottom / (viewport * 0.46));

      setVisibility(Math.min(enter, exit));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return visibility;
}

function Cursor({ dark = false }: { dark?: boolean }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      setMouse({ x: event.clientX, y: event.clientY });
      setVisible(true);
      setActive(Boolean(target?.closest("button, a, [data-cursor-nav]")));
    };

    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, []);

  const width = active ? 26 : 10;
  const height = active ? 2 : 10;

  return (
    <div
      className={`custom-cursor ${dark ? "is-dark" : ""}`}
      style={{
        width,
        height,
        opacity: visible ? 1 : 0,
        transform: `translate3d(${mouse.x - width / 2}px, ${
          mouse.y - height / 2
        }px, 0)`,
      }}
    />
  );
}

function PrismBackground({ progress }: { progress: number }) {
  return (
    <div
      className="site-background"
      style={
        {
          "--hero-bg-opacity": 1 - progress * 0.28,
        } as React.CSSProperties
      }
    >
      <div className="site-background-gradient" />
      <div className="site-background-grid" />

      {Array.from({ length: 28 }).map((_, index) => (
        <span
          key={index}
          className="site-star"
          style={
            {
              "--x": `${(index * 37) % 100}%`,
              "--y": `${(index * 53) % 100}%`,
              "--d": `${16 + (index % 9) * 2}s`,
              "--delay": `${index * -0.8}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Header({
  compact,
  tone,
  onNavigate,
}: {
  compact: boolean;
  tone: "dark" | "light";
  onNavigate: (item: string) => void;
}) {
  return (
    <header className={`header ${compact ? "is-compact" : ""}`}>
      <a
        href="#top"
        className={`logo logo-image-link ${tone === "light" ? "is-light" : ""}`}
        onClick={(event) => {
          event.preventDefault();
          onNavigate("top");
        }}
      >
        <img src="/brand/nero-wordmark.png" alt="Nero" />
      </a>

      <nav className="nav">
        {navItems.map((item) => (
          <button
            key={item}
            type="button"
            className={`nav-item ${tone === "light" ? "is-light" : ""}`}
            onClick={() => onNavigate(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}

function HeroLine() {
  return (
    <>
      <span data-hero-line="designing">
        <span data-canvas-text="DESIGNING">Designing</span>
      </span>

      <span data-hero-line="clear-useful">
        <em data-canvas-text="CLEAR,">clear,</em>
        <span data-canvas-text="USEFUL">useful</span>
      </span>

      <span data-hero-line="digital">
        <span data-canvas-text="DIGITAL">digital</span>
      </span>

      <span data-hero-line="experiences">
        <em data-canvas-text="EXPERIENCES.">experiences.</em>
      </span>
    </>
  );
}

function WebGLHeroText({
  textRef,
  progress,
}: {
  textRef: React.RefObject<HTMLHeadingElement | null>;
  progress: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollRef = useRef(progress);

  const mouse = useRef({
    x: 0.5,
    y: 0.5,
    tx: 0.5,
    ty: 0.5,
    vx: 0,
    vy: 0,
    tvx: 0,
    tvy: 0,
    strength: 0,
    targetStrength: 0,
    lastX: 0,
    lastY: 0,
    moved: false,
  });

  useEffect(() => {
    scrollRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!gl) return;

    const vertex = `
      attribute vec2 a_position;
      varying vec2 v_uv;

      void main() {
        vec2 uv = a_position * 0.5 + 0.5;
        v_uv = vec2(uv.x, 1.0 - uv.y);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragment = `
      precision highp float;

      uniform sampler2D u_texture;
      uniform vec2 u_mouse;
      uniform vec2 u_velocity;
      uniform float u_time;
      uniform float u_strength;
      uniform float u_scroll;

      varying vec2 v_uv;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);

        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
          (c - a) * u.y * (1.0 - u.x) +
          (d - b) * u.x * u.y;
      }

      float circle(vec2 uv, vec2 center, float radius) {
        return smoothstep(radius, 0.0, distance(uv, center));
      }

      void main() {
        vec2 uv = v_uv;

        float scroll = clamp(u_scroll, 0.0, 1.0);
        float local = circle(uv, u_mouse, 0.36);
        float strength = u_strength * local;

        vec2 velocity = u_velocity;
        vec2 dir = normalize(velocity + vec2(0.0001));

        float wave =
          sin(uv.y * 24.0 + u_time * 1.2) * 0.5 +
          cos(uv.x * 18.0 - u_time * 0.8) * 0.5;

        vec2 radial = normalize(uv - u_mouse + vec2(0.0001));

        vec2 distortion =
          radial * strength * 0.014 +
          dir * strength * 0.018 +
          vec2(wave * 0.004, -wave * 0.003) * strength;

        vec2 sampleUv = uv + distortion;

        float n =
          noise(uv * vec2(18.0, 8.0) + vec2(u_time * 0.18, -u_time * 0.12)) * 0.68 +
          noise(uv * vec2(46.0, 22.0) - vec2(u_time * 0.11, u_time * 0.2)) * 0.32;

        float dissolveThreshold = scroll * 1.08;
        float dissolveNoise = n * 0.76 + uv.y * 0.08;
        float remain = 1.0 - smoothstep(dissolveNoise - 0.12, dissolveNoise + 0.22, dissolveThreshold);

        vec2 chroma = dir * (0.003 + strength * 0.012 + scroll * 0.01);

        float r = texture2D(u_texture, sampleUv + chroma).a;
        float g = texture2D(u_texture, sampleUv).a;
        float b = texture2D(u_texture, sampleUv - chroma).a;
        float base = texture2D(u_texture, sampleUv).a;

        vec3 color = mix(
          vec3(base),
          vec3(r * 0.92, g * 0.96, b * 1.12),
          clamp(strength * 1.35 + scroll * 0.55, 0.0, 1.0)
        );

        color += vec3(0.35, 0.85, 1.0) * b * strength * 0.48;
        color += vec3(1.0, 0.28, 0.82) * r * strength * 0.42;
        color += vec3(1.0, 0.82, 0.35) * g * strength * 0.16;

        float alpha = max(max(r, g), b);
        alpha *= max(remain, 0.0);
        alpha *= 1.0 - smoothstep(0.72, 1.0, scroll);

        if (length(velocity) < 0.006 && strength < 0.03 && scroll < 0.015) {
          color = vec3(base);
          alpha = base;
        }

        if (alpha < 0.001) {
          gl_FragColor = vec4(0.0);
          return;
        }

        gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
      }
    `;

    const program = createProgram(gl, vertex, fragment);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const textureLocation = gl.getUniformLocation(program, "u_texture");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const velocityLocation = gl.getUniformLocation(program, "u_velocity");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const strengthLocation = gl.getUniformLocation(program, "u_strength");
    const scrollLocation = gl.getUniformLocation(program, "u_scroll");

    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    const textureCanvas = document.createElement("canvas");

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.uniform1i(textureLocation, 0);

    const drawTexture = () => {
      const text = textRef.current;
      if (!text) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      canvas.width = width;
      canvas.height = height;
      textureCanvas.width = width;
      textureCanvas.height = height;

      gl.viewport(0, 0, width, height);

      const ctx = textureCanvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;

      const canvasRect = canvas.getBoundingClientRect();
      const parts = Array.from(
        text.querySelectorAll<HTMLElement>("[data-canvas-text]")
      );

      parts.forEach((part) => {
        const computed = window.getComputedStyle(part);
        const partRect = part.getBoundingClientRect();

        const fontSize = parseFloat(computed.fontSize) * dpr;
        const fontWeight = computed.fontWeight || "400";
        const fontStyle = computed.fontStyle || "normal";
        const letterSpacingValue = parseFloat(computed.letterSpacing || "0");
        const letterSpacing = Number.isFinite(letterSpacingValue)
          ? `${letterSpacingValue * dpr}px`
          : "0px";

        const x = (partRect.left - canvasRect.left) * dpr;
        const y = (partRect.top + partRect.height / 2 - canvasRect.top) * dpr;
        const label = part.dataset.canvasText || part.textContent || "";

        setCanvasLetterSpacing(ctx, letterSpacing);

        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px Antipasto, system-ui, sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillText(label.toUpperCase(), x, y);
      });

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textureCanvas
      );
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      const localX = (event.clientX - rect.left) / rect.width;
      const localY = (event.clientY - rect.top) / rect.height;

      const inside =
        localX >= 0 && localX <= 1 && localY >= 0 && localY <= 1;

      const dx = mouse.current.moved ? event.clientX - mouse.current.lastX : 0;
      const dy = mouse.current.moved ? event.clientY - mouse.current.lastY : 0;

      mouse.current.moved = true;
      mouse.current.lastX = event.clientX;
      mouse.current.lastY = event.clientY;

      mouse.current.tx = localX;
      mouse.current.ty = localY;
      mouse.current.tvx = dx / 82;
      mouse.current.tvy = dy / 82;

      const speed = Math.min(Math.sqrt(dx * dx + dy * dy) / 74, 1);

      if (inside && speed > 0.01) {
        mouse.current.targetStrength = Math.max(
          mouse.current.targetStrength,
          0.5 + speed * 0.85
        );
      }
    };

    let frame = 0;

    const render = (time: number) => {
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.16;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.16;
      mouse.current.vx += (mouse.current.tvx - mouse.current.vx) * 0.12;
      mouse.current.vy += (mouse.current.tvy - mouse.current.vy) * 0.12;

      mouse.current.strength +=
        (mouse.current.targetStrength - mouse.current.strength) * 0.1;

      mouse.current.targetStrength *= 0.84;
      mouse.current.tvx *= 0.84;
      mouse.current.tvy *= 0.84;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(mouseLocation, mouse.current.x, mouse.current.y);
      gl.uniform2f(velocityLocation, mouse.current.vx, -mouse.current.vy);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform1f(strengthLocation, mouse.current.strength);
      gl.uniform1f(scrollLocation, scrollRef.current);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      frame = requestAnimationFrame(render);
    };

    const resize = () => {
      if ("fonts" in document) {
        document.fonts.ready.then(drawTexture);
      } else {
        drawTexture();
      }
    };

    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        drawTexture();
        render(0);
      });
    } else {
      drawTexture();
      render(0);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);

      gl.deleteProgram(program);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
    };
  }, [textRef]);

  return <canvas ref={canvasRef} className="hero-webgl-canvas" />;
}

function Hero({ progress }: { progress: number }) {
  const textRef = useRef<HTMLHeadingElement | null>(null);

  return (
    <section
      className="hero-section"
      style={{
        opacity: progress >= 0.99 ? 0 : 1,
      }}
    >
      <div className="hero-inner">
        <div className="hero-title-wrap">
          <h1
            ref={textRef}
            className="hero-title-source"
            aria-label="Designing clear, useful digital experiences."
          >
            <HeroLine />
          </h1>

          <WebGLHeroText textRef={textRef} progress={progress} />
        </div>
      </div>
    </section>
  );
}

function WorkStrips({ resetKey }: { resetKey: number }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const visibility = useFixedSectionVisibility(sectionRef);

  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [caseProject, setCaseProject] = useState<Project | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0 });
  const [sequenceElapsed, setSequenceElapsed] = useState(0);

  const sequenceStartRef = useRef<number | null>(null);

  const activeCaseIndex = caseProject
    ? projects.findIndex((project) => project.id === caseProject.id)
    : -1;

  const goToCase = (direction: "prev" | "next") => {
    if (!caseProject) return;

    const currentIndex = projects.findIndex(
      (project) => project.id === caseProject.id
    );

    if (currentIndex === -1) return;

    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % projects.length
        : (currentIndex - 1 + projects.length) % projects.length;

    setCaseProject(projects[nextIndex]);
    setExpandedIndex(nextIndex);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveIndex(null);
    setExpandedIndex(null);
    setCaseProject(null);
  }, [resetKey]);

  useEffect(() => {
    let frame = 0;

    const animate = (time: number) => {
      if (visibility > 0.12) {
        if (sequenceStartRef.current === null) {
          sequenceStartRef.current = time;
        }

        setSequenceElapsed((time - sequenceStartRef.current) / 1000);
      } else {
        sequenceStartRef.current = null;
        setSequenceElapsed(0);
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [visibility]);

  useEffect(() => {
    let frame = 0;

    const animate = () => {
      setSmoothMouse((current) => ({
        x: current.x + (mouse.x - current.x) * 0.16,
        y: current.y + (mouse.y - current.y) * 0.16,
      }));

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [mouse]);

  useEffect(() => {
    if (!caseProject) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCaseProject(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToCase("prev");
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToCase("next");
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [caseProject]);

  return (
    <section id="work" ref={sectionRef} className="work-section">
      {mounted && (
        <>
          <div
            className={`work-fixed ${caseProject ? "case-open" : ""}`}
            onPointerMove={(event) =>
              setMouse({ x: event.clientX, y: event.clientY })
            }
            style={{
              opacity: visibility,
              pointerEvents: visibility > 0.08 ? "auto" : "none",
              filter: `blur(${(1 - visibility) * 8}px)`,
            }}
          >
            <div className="work-kicker">Selected Projects</div>

            <div className="work-list">
              {projects.map((project, index) => {
                const rowProgress = clamp(
                  (sequenceElapsed - index * 0.16) / 0.82
                );

                const isExpanded = expandedIndex === index;

                return (
                  <div
                    key={project.id}
                    role="button"
                    tabIndex={0}
                    data-cursor-nav
                    className={`work-row ${isExpanded ? "is-expanded" : ""}`}
                    style={
                      {
                        "--row-progress": rowProgress,
                        "--row-y": `${(1 - rowProgress) * 18}px`,
                      } as React.CSSProperties
                    }
                    onPointerEnter={() => setActiveIndex(index)}
                    onPointerLeave={() => setActiveIndex(null)}
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setExpandedIndex(isExpanded ? null : index);
                      }
                    }}
                  >
                    <span className="work-row-line" />
                    <span className="work-row-name">{project.name}</span>
                    <span className="work-row-meta">{project.type}</span>

                    <div className="work-expanded">
                      <button
                        type="button"
                        className="work-expanded-image"
                        onClick={(event) => {
                          event.stopPropagation();
                          setCaseProject(project);
                        }}
                      >
                        <img
                          src={project.image}
                          alt={project.name}
                          style={{ objectPosition: project.position }}
                        />
                      </button>

                      <button
                        type="button"
                        className="work-expanded-open"
                        onClick={(event) => {
                          event.stopPropagation();
                          setCaseProject(project);
                        }}
                      >
                        Click to open
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className={`work-preview ${
                activeIndex !== null && expandedIndex === null
                  ? "is-visible"
                  : ""
              }`}
              style={{
                transform: `translate3d(${smoothMouse.x + 18}px, ${
                  smoothMouse.y - 112
                }px, 0)`,
              }}
            >
              {activeIndex !== null && expandedIndex === null && (
                <img
                  src={projects[activeIndex].image}
                  alt={projects[activeIndex].name}
                  style={{ objectPosition: projects[activeIndex].position }}
                />
              )}
            </div>
          </div>

          {caseProject && (
            <div className="case-overlay">
              <button
                type="button"
                className="case-backdrop"
                onClick={() => setCaseProject(null)}
              />

              <button
                type="button"
                className="case-arrow case-arrow-left"
                onClick={() => goToCase("prev")}
                aria-label="Previous project"
              >
                <span>←</span>
                <small>
                  {projects[
                    (activeCaseIndex - 1 + projects.length) % projects.length
                  ]?.name || "Previous"}
                </small>
              </button>

              <button
                type="button"
                className="case-arrow case-arrow-right"
                onClick={() => goToCase("next")}
                aria-label="Next project"
              >
                <small>
                  {projects[(activeCaseIndex + 1) % projects.length]?.name ||
                    "Next"}
                </small>
                <span>→</span>
              </button>

              <article className="case-panel">
                <button
                  type="button"
                  className="case-close"
                  onClick={() => setCaseProject(null)}
                >
                  Close
                </button>

                <div className="case-image">
                  <img src={caseProject.image} alt={caseProject.name} />
                </div>

                <div className="case-content">
                  <div className="case-meta">
                    <span>{caseProject.type}</span>
                    <span>{caseProject.year}</span>
                    <span>{caseProject.role}</span>
                  </div>

                  <p className="case-headline">{caseProject.headline}</p>

                  <div className="case-grid">
                    <div>
                      <span>Focus</span>
                      <strong>{caseProject.focus}</strong>
                    </div>

                    <div>
                      <span>Overview</span>
                      <p>{caseProject.overview}</p>
                    </div>
                  </div>

                  <div className="case-mockup-section">
                    <div className="case-section-heading">
                      <span>Presentation</span>
                      <strong>Responsive interface system</strong>
                    </div>

                    <div className="case-mockup-stage">
                      <div className="case-mockup-copy">
                        <span>Adaptive showcase</span>

                        <h3>
                          Designed to feel native across desktop, tablet and
                          mobile contexts.
                        </h3>

                        <p>
                          Each project uses a custom presentation system so the
                          interface feels connected to its own visual language
                          while still matching the portfolio atmosphere.
                        </p>
                      </div>

                      <div className="case-device-composition">
                        <div className="case-tablet-frame">
                          <img
                            src={caseProject.tabletMockup}
                            alt={`${caseProject.name} tablet mockup`}
                          />
                        </div>

                        <div className="case-phone-frame">
                          <img
                            src={caseProject.phoneMockup}
                            alt={`${caseProject.name} phone mockup`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function AboutWipe({ active }: { active: boolean }) {
  return (
    <div
      className={`about-global-wipe ${active ? "is-wiping" : ""}`}
      aria-hidden="true"
    >
      <span className="about-wipe-fill" />
      <span className="about-wipe-edge" />
      <span className="about-wipe-grain" />
    </div>
  );
}

function AboutExperience({
  active,
  progress,
  view,
}: {
  active: boolean;
  progress: number;
  view: AboutView;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [copiedEmail, setCopiedEmail] = useState(false);

  const isContact = view === "contact";

  const shiftProgress = isContact ? 1 : progress;
  const storyProgress = isContact ? 0 : clamp((progress - 0.08) / 0.72);
  const contactProgress = isContact ? 1 : 0;

  const textKicker = isContact ? 0 : clamp((progress - 0.08) / 0.32);
  const textTitle = isContact ? 0 : clamp((progress - 0.12) / 0.36);
  const textLead = isContact ? 0 : clamp((progress - 0.22) / 0.38);
  const textBlocks = isContact ? 0 : clamp((progress - 0.34) / 0.46);
  const glassProgress = clamp((progress - 0.02) / 0.36);

  const photoScale = 0.68;
  const photoX = lerp(0, 32, shiftProgress);
  const photoY = lerp(0, -0.2, shiftProgress);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("thenerocontent@gmail.com");
      setCopiedEmail(true);

      window.setTimeout(() => {
        setCopiedEmail(false);
      }, 1600);
    } catch {
      window.location.href = "mailto:thenerocontent@gmail.com";
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: clamp(y * -10, -8, 8),
      y: clamp(x * 12, -10, 10),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      className={`about-experience ${active ? "is-active" : ""} ${
        isContact ? "is-contact" : "is-story"
      }`}
      aria-hidden={!active}
      style={
        {
          "--about-progress": progress,
          "--photo-scale": photoScale,
          "--photo-x": `${photoX}vw`,
          "--photo-y": `${photoY}vh`,
          "--text-progress": storyProgress,
          "--text-kicker": textKicker,
          "--text-title": textTitle,
          "--text-lead": textLead,
          "--text-blocks": textBlocks,
          "--contact-progress": contactProgress,
          "--glass-progress": glassProgress,
          "--tilt-x": `${tilt.x}deg`,
          "--tilt-y": `${tilt.y}deg`,
          "--tilt-photo-x": `${tilt.y * -0.85}px`,
          "--tilt-photo-y": `${tilt.x * 0.85}px`,
          "--tilt-glare-x": `${50 + tilt.y * 2.6}%`,
          "--tilt-glare-y": `${50 + tilt.x * -2.4}%`,
        } as React.CSSProperties
      }
    >
      <div className="about-canvas">
        <div className="about-prism-stars">
          {Array.from({ length: 38 }).map((_, index) => (
            <span
              key={index}
              className="about-prism-star"
              style={
                {
                  "--x": `${(index * 29) % 100}%`,
                  "--y": `${(index * 47) % 100}%`,
                  "--d": `${18 + (index % 10) * 2}s`,
                  "--delay": `${index * -0.74}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <div className="about-text-panel">
        <span className="about-kicker">About / Story</span>

        <h2>Hi, I&apos;m Nero.</h2>

        <p className="about-lead">
          <em>
            I design interfaces that connect visual direction, product logic and
            front-end execution.
          </em>
        </p>

        <div className="about-copy-grid">
          <p>
            My process starts with structure: understanding the product goal,
            user flow, hierarchy and the reason behind each screen.
          </p>

          <p>
            Then I translate that logic into visual systems, interactions and
            interfaces that can evolve into real digital products.
          </p>
        </div>

        <div className="about-skill-grid">
          <div>
            <span>01</span>
            <strong>Product Thinking</strong>
          </div>

          <div>
            <span>02</span>
            <strong>Visual Systems</strong>
          </div>

          <div>
            <span>03</span>
            <strong>Front-end Execution</strong>
          </div>
        </div>
      </div>

      <div className="contact-panel">
        <div className="contact-shell">
          <div className="contact-intro">
            <span className="contact-kicker">Contact / Availability</span>

            <h2>
              Let&apos;s build
              <br />
              something useful.
            </h2>

            <p>
              <em>
                Available for UI design, product interfaces, portfolio
                experiences and front-end projects with strong visual direction.
              </em>
            </p>
          </div>

          <div className="contact-actions-grid">
            <button type="button" className="contact-action" onClick={copyEmail}>
              <span>Email</span>

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Zm2.75-1.25c-.69 0-1.25.56-1.25 1.25v.44l6.5 4.06 6.5-4.06v-.44c0-.69-.56-1.25-1.25-1.25H6.75Zm11.75 3.46-6.1 3.82a.75.75 0 0 1-.8 0L5.5 8.96v8.29c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V8.96Z" />
              </svg>

              <strong>{copiedEmail ? "Copied" : "Copy"}</strong>
            </button>

            <a
              className="contact-action"
              href="https://wa.me/5527996920157"
              target="_blank"
              rel="noreferrer"
            >
              <span>WhatsApp</span>

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.04 4A7.86 7.86 0 0 0 5.3 15.91L4.25 20l4.18-1.02A7.86 7.86 0 1 0 12.04 4Zm0 1.5a6.36 6.36 0 0 1 0 12.72 6.3 6.3 0 0 1-3.12-.82l-.27-.15-2.27.55.58-2.18-.18-.29A6.36 6.36 0 0 1 12.04 5.5Zm-2.35 3.18c-.14 0-.37.05-.57.27-.2.22-.75.73-.75 1.78s.77 2.07.88 2.21c.11.15 1.49 2.38 3.67 3.24 1.82.72 2.19.58 2.58.54.4-.04 1.28-.52 1.46-1.03.18-.5.18-.94.13-1.03-.05-.1-.2-.15-.42-.26-.22-.11-1.28-.64-1.48-.71-.2-.08-.35-.11-.5.11-.15.22-.57.71-.7.86-.13.15-.26.17-.48.06-.22-.11-.93-.34-1.78-1.09-.66-.59-1.1-1.31-1.23-1.53-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.2-.68-1.64-.18-.43-.36-.37-.5-.37h-.26Z" />
              </svg>

              <strong>Open</strong>
            </a>

            <a
              className="contact-action"
              href="https://www.instagram.com/arthurnero_"
              target="_blank"
              rel="noreferrer"
            >
              <span>Instagram</span>

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Zm0 1.5A2.5 2.5 0 0 0 5.5 8v8A2.5 2.5 0 0 0 8 18.5h8a2.5 2.5 0 0 0 2.5-2.5V8A2.5 2.5 0 0 0 16 5.5H8Zm4 3.25A3.25 3.25 0 1 1 8.75 12 3.25 3.25 0 0 1 12 8.75Zm0 1.5A1.75 1.75 0 1 0 13.75 12 1.75 1.75 0 0 0 12 10.25Zm4.05-2.6a.8.8 0 1 1-.8.8.8.8 0 0 1 .8-.8Z" />
              </svg>

              <strong>Open</strong>
            </a>

            <div className="contact-action is-disabled">
              <span>Behance</span>
              <strong>Soon</strong>
            </div>

            <div className="contact-action is-disabled">
              <span>Dribbble</span>
              <strong>Soon</strong>
            </div>

            <div className="contact-action is-disabled">
              <span>Wall</span>
              <strong>Soon</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="about-photo-scene">
        <div
          ref={frameRef}
          className="glass-specimen-frame"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <span className="glass-depth glass-depth-back" />
          <span className="glass-depth glass-depth-mid" />

          <span className="glass-orbit glass-orbit-a" />
          <span className="glass-orbit glass-orbit-b" />
          <span className="glass-cut glass-cut-a" />
          <span className="glass-cut glass-cut-b" />

          <span className="glass-corner glass-corner-tl" />
          <span className="glass-corner glass-corner-tr" />
          <span className="glass-corner glass-corner-bl" />
          <span className="glass-corner glass-corner-br" />

          <div className="glass-topbar">
            <span>NERO / SPECIMEN</span>
            <span>UI-01</span>
          </div>

          <div className="glass-side-label">PRODUCT DESIGN</div>

          <div className="glass-inner">
            <div className="glass-grid" />
            <div className="glass-light" />
            <div className="glass-prism" />

            <img
              className="about-photo"
              src="/about/nero-cutout.png"
              alt="Nero portrait"
            />
          </div>

          <div className="glass-bottom">
            <span>Brazil</span>
            <span>UI / Front-end</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function NeroPortfolio() {
  const heroProgress = useHeroScrollProgress();

  const [aboutMode, setAboutMode] = useState(false);
  const [aboutView, setAboutView] = useState<AboutView>("story");
  const [aboutWiping, setAboutWiping] = useState(false);
  const [aboutProgress, setAboutProgress] = useState(0);
  const [workResetKey, setWorkResetKey] = useState(0);

  const resetWorkInteractions = () => {
    setWorkResetKey((current) => current + 1);
  };

  const closeAboutWithWipe = (afterClose?: () => void) => {
    if (!aboutMode) {
      setAboutProgress(0);
      setAboutWiping(false);
      afterClose?.();
      return;
    }

    setAboutWiping(true);

    window.setTimeout(() => {
      setAboutMode(false);
      setAboutView("story");
      setAboutProgress(0);

      window.setTimeout(() => {
        afterClose?.();
      }, 42);
    }, 760);

    window.setTimeout(() => {
      setAboutWiping(false);
    }, 1680);
  };

  const openAboutWithWipe = (targetView: AboutView) => {
    setAboutProgress(targetView === "contact" ? 1 : 0);
    setAboutView(targetView);
    setAboutMode(false);
    setAboutWiping(true);

    window.setTimeout(() => {
      setAboutMode(true);
    }, 980);

    window.setTimeout(() => {
      setAboutWiping(false);
    }, 1780);
  };

  useEffect(() => {
    if (!aboutMode) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (Math.abs(event.deltaY) < 2) return;

      if (aboutView === "contact") {
        if (event.deltaY < 0) {
          setAboutView("story");
          setAboutProgress(1);
        }

        return;
      }

      if (event.deltaY > 0) {
        if (aboutProgress === 0) {
          setAboutProgress(1);
        } else {
          setAboutView("contact");
          setAboutProgress(1);
        }
      } else {
        setAboutProgress(0);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAboutWithWipe();
        return;
      }

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === "End"
      ) {
        event.preventDefault();

        if (aboutView === "contact") return;

        if (aboutProgress === 0) {
          setAboutProgress(1);
        } else {
          setAboutView("contact");
          setAboutProgress(1);
        }
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp" ||
        event.key === "Home"
      ) {
        event.preventDefault();

        if (aboutView === "contact") {
          setAboutView("story");
          setAboutProgress(1);
        } else {
          setAboutProgress(0);
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [aboutMode, aboutView, aboutProgress]);

  const navigate = (item: string) => {
    resetWorkInteractions();

    if (item === "top") {
      closeAboutWithWipe(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });

      return;
    }

    if (item === "Work") {
      const section = document.getElementById("work");
      if (!section) return;

      closeAboutWithWipe(() => {
        window.scrollTo({
          top: section.offsetTop + window.innerHeight * 0.15,
          behavior: "smooth",
        });
      });

      return;
    }

    if (item === "About") {
      if (aboutMode) {
        setAboutView("story");
        setAboutProgress(0);
      } else {
        openAboutWithWipe("story");
      }

      return;
    }

    if (item === "Contact") {
      if (aboutMode) {
        setAboutView("contact");
        setAboutProgress(1);
      } else {
        openAboutWithWipe("contact");
      }
    }
  };

  const css = useMemo(
    () => `
      :root {
        --about-surface: #d2ccc1;
        --about-surface-deep: #c4bdb2;
        --about-ink: #161412;
      }

      @font-face {
        font-family: "Antipasto";
        src: url("/fonts/Antipasto-Pro-ExtraLight-trial.ttf") format("truetype");
        font-weight: 200;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: "Antipasto";
        src: url("/fonts/Antipasto-Pro-Regular-trial.ttf") format("truetype");
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: "Antipasto";
        src: url("/fonts/Antipasto-Pro-ExtraBold-trial.ttf") format("truetype");
        font-weight: 800;
        font-style: normal;
        font-display: swap;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        background: #070708;
      }

      body {
        cursor: none;
        font-family: "Antipasto", system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: geometricPrecision;
      }

      main {
        overflow-x: hidden;
      }

      a,
      button {
        cursor: none;
      }

      button {
        border: 0;
        background: transparent;
        font: inherit;
      }

      .custom-cursor {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9999;
        pointer-events: none;
        display: none;
        border-radius: 999px;
        background: #fff;
        box-shadow: 0 0 10px rgba(255,255,255,0.16);
        transition:
          width 160ms ease,
          height 160ms ease,
          opacity 130ms ease,
          background 220ms ease,
          box-shadow 220ms ease,
          transform 18ms linear;
      }

      .custom-cursor.is-dark {
        background: #161412;
        box-shadow: 0 0 10px rgba(22, 20, 18, 0.22);
      }

      @media (min-width: 769px) {
        .custom-cursor {
          display: block;
        }
      }

      .site-background {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
        background: #070708;
      }

      .site-background-gradient {
        position: absolute;
        inset: 0;
        opacity: var(--hero-bg-opacity);
        background:
          radial-gradient(circle at 50% 42%, rgba(255,255,255,0.05), transparent 34%),
          linear-gradient(180deg, #101014 0%, #070708 42%, #030304 100%);
      }

      .site-background-grid {
        position: absolute;
        inset: 0;
        opacity: calc(0.075 * var(--hero-bg-opacity));
        background-image: radial-gradient(rgba(255,255,255,0.13) 1px, transparent 1px);
        background-size: 34px 34px;
      }

      .site-star {
        position: absolute;
        left: var(--x);
        top: var(--y);
        width: 2px;
        height: 2px;
        border-radius: 999px;
        background: rgba(255,255,255,0.76);
        opacity: calc(0.72 * var(--hero-bg-opacity));
        box-shadow: 0 0 12px rgba(130,220,255,0.8);
        animation: starFloat var(--d) ease-in-out infinite alternate;
        animation-delay: var(--delay);
      }

      @keyframes starFloat {
        from {
          transform: translate3d(-30px, 18px, 0) scale(0.62);
        }

        to {
          transform: translate3d(42px, -28px, 0) scale(1);
        }
      }

      .header {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 120;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 34px 40px;
        box-sizing: border-box;
        transition:
          padding 500ms ease,
          opacity 360ms ease;
      }

      .header.is-compact {
        padding-top: 24px;
        padding-bottom: 24px;
        opacity: 0.92;
      }

      .logo {
        color: #fff;
        text-decoration: none;
        font-family: "Antipasto", system-ui, sans-serif;
        font-size: 25px;
        font-weight: 400;
        line-height: 1;
        letter-spacing: 0.035em;
        transform: translateZ(0);
        font-synthesis: none;
        text-rendering: geometricPrecision;
        transition:
          color 420ms ease,
          font-size 500ms ease,
          letter-spacing 280ms ease,
          transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .header.is-compact .logo {
        font-size: 20px;
      }

      .logo.is-light {
        color: #161412;
      }

      .logo:hover {
        letter-spacing: 0.065em;
        transform: translateZ(0) scaleX(0.94);
      }

      .logo-image-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 82px;
        height: auto;
        opacity: 0.94;
        transform: translateZ(0);
      }

      .header.is-compact .logo-image-link {
        width: 74px;
      }

      .logo-image-link img {
        width: 100%;
        height: auto;
        display: block;
        object-fit: contain;
        user-select: none;
        pointer-events: none;
        filter:
          drop-shadow(0 0 8px rgba(255, 255, 255, 0.08))
          drop-shadow(0 0 16px rgba(90, 210, 255, 0.08));
        transition:
          opacity 260ms ease,
          filter 320ms ease,
          transform 360ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .logo-image-link:hover {
        letter-spacing: initial;
        transform: translateZ(0);
      }

      .logo-image-link:hover img {
        opacity: 1;
        transform: translateY(-1px) scale(1.025);
        filter:
          drop-shadow(0 0 10px rgba(255, 255, 255, 0.14))
          drop-shadow(0 0 22px rgba(90, 210, 255, 0.14));
      }

      .logo-image-link.is-light img {
        filter:
          invert(1)
          drop-shadow(0 0 8px rgba(22, 20, 18, 0.08));
      }

      .nav {
        position: absolute;
        left: 50%;
        top: 50%;
        display: flex;
        gap: 40px;
        transform: translate(-50%, -50%);
      }

      .nav-item {
        position: relative;
        color: #fff;
        font-family: "Antipasto", system-ui, sans-serif;
        font-size: 0.75rem;
        font-weight: 200;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        transition:
          color 360ms ease,
          opacity 220ms ease;
      }

      .nav-item.is-light {
        color: #161412;
      }

      .nav-item:hover {
        opacity: 0.58;
      }

      .nav-item::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -7px;
        width: 18px;
        height: 1px;
        background: currentColor;
        opacity: 0;
        transform: translateX(-50%) scaleX(0);
        transform-origin: center;
        transition:
          opacity 220ms ease,
          transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .nav-item:hover::after {
        opacity: 0.55;
        transform: translateX(-50%) scaleX(1);
      }

      .hero-section {
        position: fixed;
        inset: 0;
        z-index: 10;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 64px;
        box-sizing: border-box;
      }

      .hero-inner {
        width: 100%;
        max-width: 1120px;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hero-title-wrap {
        position: relative;
        width: 100%;
        height: clamp(360px, 48vw, 580px);
      }

      .hero-title-source {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0;
        color: #fff;
        opacity: 0;
        font-family: "Antipasto", system-ui, sans-serif;
        font-size: clamp(2.85rem, 6.8vw, 7.7rem);
        font-weight: 400;
        line-height: 0.9;
        letter-spacing: -0.04em;
        text-transform: uppercase;
      }

      .hero-title-source em {
        font-style: italic;
        font-weight: 200;
        letter-spacing: -0.04em;
      }

      .hero-title-source span {
        display: block;
      }

      .hero-title-source [data-hero-line="clear-useful"] {
        display: inline-flex;
        align-items: baseline;
        gap: 0.18em;
        margin-left: 1.38em;
      }

      .hero-title-source [data-hero-line="clear-useful"] span,
      .hero-title-source [data-hero-line="clear-useful"] em {
        display: inline-block;
      }

      .hero-title-source [data-hero-line="digital"] {
        margin-left: 2.28em;
      }

      .hero-title-source [data-hero-line="experiences"] {
        margin-left: 1.54em;
      }

      .hero-webgl-canvas {
        position: absolute;
        inset: 0;
        z-index: 3;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .work-section {
        position: relative;
        z-index: 20;
        height: 220vh;
      }

      .work-fixed {
        position: fixed;
        inset: 0;
        z-index: 22;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        padding-top: clamp(108px, 13vh, 136px);
        padding-bottom: clamp(54px, 9vh, 96px);
        box-sizing: border-box;
        transition:
          opacity 220ms linear,
          filter 220ms linear;
      }

      .work-fixed.case-open {
        pointer-events: none;
      }

      .work-fixed.case-open .work-kicker,
      .work-fixed.case-open .work-list {
        opacity: 0.1;
        filter: blur(9px);
        transform: scale(0.982);
      }

      .work-kicker {
        width: 100%;
        padding: 0 clamp(24px, 5vw, 72px);
        margin-bottom: clamp(14px, 2vh, 22px);
        box-sizing: border-box;
        color: rgba(255,255,255,0.34);
        font-size: 0.58rem;
        font-weight: 200;
        letter-spacing: 0.34em;
        text-transform: uppercase;
        transition:
          opacity 420ms ease,
          filter 420ms ease,
          transform 420ms ease;
      }

      .work-list {
        position: relative;
        width: 100%;
        max-height: min(70vh, 700px);
        overflow-y: auto;
        overflow-x: hidden;
        padding-top: clamp(18px, 3vh, 34px);
        padding-bottom: clamp(18px, 3vh, 34px);
        scrollbar-width: none;
        transition:
          opacity 420ms ease,
          filter 420ms ease,
          transform 420ms ease;

        -webkit-mask-image:
          linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%),
          linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        mask-image:
          linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%),
          linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        -webkit-mask-composite: source-in;
        mask-composite: intersect;
      }

      .work-list::-webkit-scrollbar {
        display: none;
      }

      .work-row {
        position: relative;
        width: 100%;
        height: clamp(42px, 5.3vh, 54px);
        display: flex;
        align-items: center;
        padding: 0 clamp(24px, 5vw, 72px);
        box-sizing: border-box;
        color: #fff;
        opacity: var(--row-progress);
        transform: translate3d(0, var(--row-y), 0);
        overflow: hidden;
        outline: none;
        transition:
          height 980ms cubic-bezier(0.19, 1, 0.22, 1),
          opacity 520ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 760ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .work-row-line {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255,255,255,0.02) 8%,
          rgba(255,255,255,0.13) 50%,
          rgba(255,255,255,0.02) 92%,
          transparent 100%
        );
        transform: scaleX(var(--row-progress));
        transform-origin: left center;
        opacity: calc(var(--row-progress) * 0.82);
      }

      .work-row::after {
        content: "";
        position: absolute;
        inset: auto 0 0 0;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255,255,255,0.015) 8%,
          rgba(255,255,255,0.055) 50%,
          rgba(255,255,255,0.015) 92%,
          transparent 100%
        );
      }

      .work-row-name {
        position: absolute;
        left: clamp(24px, 5vw, 72px);
        top: 50%;
        z-index: 4;
        color: rgba(255,255,255,0.7);
        font-size: clamp(0.86rem, 1.5vw, 1.52rem);
        font-weight: 200;
        line-height: 1;
        letter-spacing: 0.035em;
        text-transform: uppercase;
        white-space: nowrap;
        transform: translate3d(0, -50%, 0);
        transition:
          opacity 260ms ease,
          filter 280ms ease,
          left 760ms cubic-bezier(0.19, 1, 0.22, 1),
          transform 760ms cubic-bezier(0.19, 1, 0.22, 1),
          color 280ms ease,
          font-size 760ms cubic-bezier(0.19, 1, 0.22, 1);
      }

      .work-row-meta {
        position: absolute;
        right: clamp(24px, 5vw, 72px);
        top: 50%;
        color: rgba(255,255,255,0.28);
        font-size: 0.58rem;
        font-weight: 200;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        transform: translateY(-50%);
        opacity: 0;
        transition:
          opacity 260ms ease,
          transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .work-row:hover .work-row-name {
        color: rgba(255,255,255,0.96);
        transform: translate3d(10px, -50%, 0);
      }

      .work-row:hover .work-row-meta {
        opacity: 1;
        transform: translateY(-50%) translateX(-8px);
      }

      .work-row.is-expanded {
        height: min(50vh, 460px);
      }

      .work-row.is-expanded .work-row-name {
        color: rgba(255,255,255,0);
        opacity: 0;
        filter: blur(7px);
      }

      .work-row.is-expanded .work-row-meta {
        opacity: 0;
      }

      .work-expanded {
        position: absolute;
        inset: 0;
        z-index: 3;
        opacity: 0;
        pointer-events: none;
        transform: translate3d(0, 8px, 0);
        transition:
          opacity 420ms ease 90ms,
          transform 620ms cubic-bezier(0.19, 1, 0.22, 1) 90ms;
      }

      .work-row.is-expanded .work-expanded {
        opacity: 1;
        pointer-events: auto;
        transform: translate3d(0, 0, 0);
      }

      .work-expanded-image {
        position: absolute;
        left: 50%;
        top: 48%;
        width: min(1280px, 91vw);
        height: min(270px, 29vh);
        border-radius: 18px;
        overflow: hidden;
        background: #050507;
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow:
          0 30px 110px rgba(0,0,0,0.56),
          inset 0 1px 0 rgba(255,255,255,0.08);
        transform: translate3d(-50%, -30%, 0) scaleY(0.96);
        clip-path: inset(50% 0 50% 0 round 18px);
        transform-origin: center center;
        transition:
          clip-path 920ms cubic-bezier(0.19, 1, 0.22, 1) 120ms,
          transform 920ms cubic-bezier(0.19, 1, 0.22, 1) 120ms,
          opacity 520ms ease 120ms,
          border-color 220ms ease,
          box-shadow 220ms ease;
      }

      .work-row.is-expanded .work-expanded-image {
        clip-path: inset(0 0 0 0 round 18px);
        transform: translate3d(-50%, -30%, 0) scaleY(1);
      }

      .work-expanded-image:hover {
        border-color: rgba(255,255,255,0.22);
      }

      .work-expanded-image img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        background: #050507;
      }

      .work-expanded-open {
        position: absolute;
        left: 50%;
        bottom: 3.6%;
        color: rgba(255,255,255,0.68);
        font-size: 0.58rem;
        font-weight: 200;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        opacity: 0;
        transform: translateX(-50%) translateY(12px);
        transition:
          opacity 360ms ease 720ms,
          transform 540ms cubic-bezier(0.16, 1, 0.3, 1) 720ms,
          color 180ms ease;
      }

      .work-row.is-expanded .work-expanded-open {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      .work-expanded-open:hover {
        color: #fff;
      }

      .work-preview {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 40;
        width: min(280px, 20vw);
        aspect-ratio: 16 / 10;
        border-radius: 13px;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        background: #050507;
        box-shadow:
          0 24px 90px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.06);
        clip-path: inset(0 0 100% 0 round 13px);
        scale: 0.965;
        transition:
          opacity 170ms ease,
          clip-path 360ms cubic-bezier(0.16, 1, 0.3, 1),
          scale 420ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .work-preview.is-visible {
        opacity: 1;
        clip-path: inset(0 0 0 0 round 13px);
        scale: 1;
      }

      .work-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .case-overlay {
        position: fixed;
        inset: 0;
        z-index: 90;
        pointer-events: auto;
      }

      .case-backdrop {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 50% 22%, rgba(255,255,255,0.065), transparent 34%),
          rgba(3,3,4,0.84);
        backdrop-filter: blur(16px);
      }

      .case-arrow {
        position: fixed;
        top: 50%;
        z-index: 160;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 118px;
        color: rgba(255,255,255,0.68);
        font-size: 0.62rem;
        font-weight: 200;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        transform: translateY(-50%);
        transition:
          color 220ms ease,
          opacity 220ms ease,
          transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .case-arrow span {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.055);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.08),
          0 14px 42px rgba(0,0,0,0.36);
        backdrop-filter: blur(10px);
      }

      .case-arrow small {
        display: block;
        max-width: 92px;
        overflow: hidden;
        color: rgba(255,255,255,0.46);
        font-size: 0.52rem;
        font-weight: 200;
        letter-spacing: 0.14em;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .case-arrow:hover {
        color: #fff;
      }

      .case-arrow-left {
        left: clamp(16px, 2.2vw, 34px);
      }

      .case-arrow-left:hover {
        transform: translateY(-50%) translateX(-4px);
      }

      .case-arrow-right {
        right: clamp(16px, 2.2vw, 34px);
        justify-content: flex-end;
      }

      .case-arrow-right:hover {
        transform: translateY(-50%) translateX(4px);
      }

      .case-panel {
        position: absolute;
        left: 50%;
        top: 7vh;
        width: min(1360px, 88vw);
        max-height: 86vh;
        overflow-y: auto;
        scrollbar-width: none;
        border-radius: 24px;
        background: rgba(5,5,7,0.72);
        border: 1px solid rgba(255,255,255,0.09);
        box-shadow:
          0 44px 160px rgba(0,0,0,0.58),
          inset 0 1px 0 rgba(255,255,255,0.06);
        transform: translateX(-50%);
        animation: caseIn 720ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .case-panel::-webkit-scrollbar {
        display: none;
      }

      @keyframes caseIn {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(24px) scale(0.985);
          clip-path: inset(0 0 12% 0 round 24px);
        }

        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
          clip-path: inset(0 0 0 0 round 24px);
        }
      }

      .case-close {
        position: fixed;
        right: clamp(32px, 5vw, 74px);
        top: clamp(28px, 5vh, 54px);
        z-index: 3;
        color: rgba(255,255,255,0.62);
        font-size: 0.62rem;
        font-weight: 200;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .case-image {
        width: 100%;
        overflow: hidden;
        border-radius: 24px 24px 0 0;
        background: #050507;
      }

      .case-image img {
        width: 100%;
        height: auto;
        display: block;
      }

      .case-content {
        width: min(1120px, calc(100% - clamp(36px, 7vw, 96px)));
        margin: 0 auto;
        padding: clamp(34px, 6vh, 72px) 0 clamp(40px, 8vh, 88px);
      }

      .case-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 16px;
        color: rgba(255,255,255,0.42);
        font-size: 0.62rem;
        font-weight: 200;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .case-headline {
        max-width: 860px;
        margin: 28px 0 0;
        color: rgba(255,255,255,0.78);
        font-size: clamp(1.36rem, 2.6vw, 2.4rem);
        font-weight: 200;
        line-height: 1.1;
      }

      .case-grid {
        display: grid;
        grid-template-columns: 0.4fr 0.6fr;
        gap: clamp(24px, 5vw, 86px);
        margin-top: clamp(32px, 6vh, 68px);
        border-top: 1px solid rgba(255,255,255,0.09);
        padding-top: 24px;
      }

      .case-grid span {
        display: block;
        margin-bottom: 12px;
        color: rgba(255,255,255,0.36);
        font-size: 0.58rem;
        font-weight: 200;
        letter-spacing: 0.22em;
        text-transform: uppercase;
      }

      .case-grid strong,
      .case-grid p {
        margin: 0;
        color: rgba(255,255,255,0.68);
        font-size: clamp(1rem, 1.2vw, 1.12rem);
        font-weight: 200;
        line-height: 1.52;
      }

      .case-mockup-section {
        margin-top: clamp(52px, 9vh, 104px);
        border-top: 1px solid rgba(255,255,255,0.08);
        padding-top: clamp(36px, 6vh, 72px);
      }

      .case-section-heading {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: clamp(34px, 5vh, 58px);
      }

      .case-section-heading span {
        color: rgba(255,255,255,0.36);
        font-size: 0.58rem;
        font-weight: 200;
        letter-spacing: 0.22em;
        text-transform: uppercase;
      }

      .case-section-heading strong {
        max-width: 460px;
        color: rgba(255,255,255,0.72);
        font-size: clamp(1.3rem, 2.2vw, 2.1rem);
        font-weight: 200;
        line-height: 1.05;
      }

      .case-mockup-stage {
        position: relative;
        min-height: clamp(660px, 82vh, 920px);
        display: grid;
        grid-template-columns: minmax(260px, 0.52fr) minmax(0, 1fr);
        gap: clamp(28px, 5vw, 80px);
        align-items: center;
        overflow: hidden;
        border-radius: 34px;
        border: 1px solid rgba(255,255,255,0.08);
        background:
          radial-gradient(circle at 70% 42%, rgba(255,255,255,0.08), transparent 30%),
          radial-gradient(circle at 32% 74%, rgba(255,255,255,0.04), transparent 28%),
          linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.016));
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.06),
          0 34px 120px rgba(0,0,0,0.28);
        padding: clamp(30px, 5vw, 72px);
        box-sizing: border-box;
      }

      .case-mockup-stage::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(rgba(255,255,255,0.026) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
        background-size: 42px 42px;
        opacity: 0.32;
        pointer-events: none;
      }

      .case-mockup-stage::after {
        content: "";
        position: absolute;
        right: -18%;
        top: 10%;
        width: 52%;
        height: 82%;
        border-radius: 999px;
        background: radial-gradient(circle, rgba(255,255,255,0.1), transparent 62%);
        filter: blur(24px);
        opacity: 0.7;
        pointer-events: none;
      }

      .case-mockup-copy {
        position: relative;
        z-index: 3;
        max-width: 360px;
      }

      .case-mockup-copy span {
        display: inline-block;
        margin-bottom: 22px;
        color: rgba(255,255,255,0.36);
        font-size: 0.58rem;
        font-weight: 200;
        letter-spacing: 0.22em;
        text-transform: uppercase;
      }

      .case-mockup-copy h3 {
        margin: 0;
        color: rgba(255,255,255,0.78);
        font-size: clamp(1.8rem, 3.1vw, 3.3rem);
        font-weight: 200;
        line-height: 0.98;
        letter-spacing: -0.035em;
      }

      .case-mockup-copy p {
        margin: 24px 0 0;
        color: rgba(255,255,255,0.54);
        font-size: clamp(0.98rem, 1.08vw, 1.08rem);
        font-weight: 200;
        line-height: 1.52;
      }

      .case-device-composition {
        position: relative;
        z-index: 2;
        min-height: clamp(560px, 74vh, 820px);
      }

      .case-tablet-frame {
        position: absolute;
        right: clamp(18px, 4vw, 70px);
        top: 50%;
        width: min(760px, 64vw);
        transform:
          translateY(-50%)
          rotateZ(-4deg)
          perspective(1200px)
          rotateY(-9deg)
          rotateX(3deg);
        transform-origin: center;
        filter:
          drop-shadow(0 56px 90px rgba(0,0,0,0.52))
          drop-shadow(0 0 40px rgba(255,255,255,0.035));
        transition:
          transform 720ms cubic-bezier(0.16, 1, 0.3, 1),
          filter 420ms ease;
      }

      .case-phone-frame {
        position: absolute;
        left: clamp(-12px, 1vw, 26px);
        bottom: clamp(8px, 4vh, 48px);
        width: min(310px, 26vw);
        transform:
          rotateZ(5deg)
          perspective(1000px)
          rotateY(12deg)
          rotateX(2deg);
        transform-origin: center;
        filter:
          drop-shadow(0 42px 74px rgba(0,0,0,0.58))
          drop-shadow(0 0 30px rgba(255,255,255,0.035));
        transition:
          transform 720ms cubic-bezier(0.16, 1, 0.3, 1),
          filter 420ms ease;
      }

      .case-tablet-frame:hover {
        transform:
          translateY(-50%)
          rotateZ(-2deg)
          perspective(1200px)
          rotateY(-5deg)
          rotateX(2deg)
          translateY(-8px);
        filter:
          drop-shadow(0 64px 100px rgba(0,0,0,0.58))
          drop-shadow(0 0 52px rgba(255,255,255,0.055));
      }

      .case-phone-frame:hover {
        transform:
          rotateZ(2deg)
          perspective(1000px)
          rotateY(7deg)
          rotateX(1deg)
          translateY(-8px);
        filter:
          drop-shadow(0 52px 86px rgba(0,0,0,0.62))
          drop-shadow(0 0 42px rgba(255,255,255,0.055));
      }

      .case-tablet-frame img,
      .case-phone-frame img {
        width: 100%;
        height: auto;
        display: block;
        user-select: none;
        pointer-events: none;
      }

      .about-global-wipe {
        position: fixed;
        inset: 0;
        z-index: 115;
        pointer-events: none;
        opacity: 0;
        overflow: hidden;
      }

      .about-global-wipe.is-wiping {
        opacity: 1;
        animation: aboutWipeRoot 1560ms linear forwards;
      }

      .about-wipe-fill {
        position: absolute;
        inset: 0;
        background: var(--about-surface);
        clip-path: polygon(0 0, 0 0, 0 0);
        will-change: clip-path;
      }

      .about-global-wipe.is-wiping .about-wipe-fill {
        animation: aboutDiagonalFill 1560ms cubic-bezier(0.76, 0, 0.24, 1) forwards;
      }

      .about-wipe-edge {
        position: absolute;
        inset: -55%;
        background:
          linear-gradient(
            135deg,
            transparent 0%,
            transparent 41%,
            rgba(255,255,255,0.0) 42%,
            rgba(105, 220, 255, 0.38) 44%,
            rgba(255, 75, 220, 0.34) 46%,
            rgba(255, 235, 150, 0.32) 48%,
            rgba(255,255,255,0.72) 50%,
            rgba(22,20,18,0.08) 51%,
            transparent 54%,
            transparent 100%
          );
        opacity: 0;
        transform: translate3d(-58%, -58%, 0);
        mix-blend-mode: multiply;
        filter: contrast(1.08);
        will-change: transform, opacity;
      }

      .about-global-wipe.is-wiping .about-wipe-edge {
        animation: aboutDiagonalPrismEdge 1560ms cubic-bezier(0.76, 0, 0.24, 1) forwards;
      }

      .about-wipe-grain {
        position: absolute;
        inset: 0;
        background:
          repeating-linear-gradient(
            0deg,
            rgba(22, 20, 18, 0.06) 0px,
            rgba(22, 20, 18, 0.06) 1px,
            transparent 1px,
            transparent 8px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(22, 20, 18, 0.035) 0px,
            rgba(22, 20, 18, 0.035) 1px,
            transparent 1px,
            transparent 11px
          );
        opacity: 0;
        mix-blend-mode: multiply;
      }

      .about-global-wipe.is-wiping .about-wipe-grain {
        animation: aboutGrainPulse 1560ms ease forwards;
      }

      @keyframes aboutWipeRoot {
        0% {
          opacity: 1;
        }

        84% {
          opacity: 1;
        }

        100% {
          opacity: 0;
        }
      }

      @keyframes aboutDiagonalFill {
        0% {
          clip-path: polygon(0 0, 0 0, 0 0);
        }

        24% {
          clip-path: polygon(0 0, 64% 0, 0 64%);
        }

        48% {
          clip-path: polygon(0 0, 112% 0, 0 112%);
        }

        70% {
          clip-path: polygon(0 0, 100% 0, 100% 56%, 56% 100%, 0 100%);
        }

        86%,
        100% {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
      }

      @keyframes aboutDiagonalPrismEdge {
        0% {
          opacity: 0;
          transform: translate3d(-64%, -64%, 0);
        }

        14% {
          opacity: 0.95;
        }

        42% {
          opacity: 1;
          transform: translate3d(-16%, -16%, 0);
        }

        74% {
          opacity: 0.82;
          transform: translate3d(34%, 34%, 0);
        }

        100% {
          opacity: 0;
          transform: translate3d(64%, 64%, 0);
        }
      }

      @keyframes aboutGrainPulse {
        0% {
          opacity: 0;
        }

        18% {
          opacity: 0.18;
        }

        62% {
          opacity: 0.14;
        }

        100% {
          opacity: 0;
        }
      }

      .about-experience {
        position: fixed;
        inset: 0;
        z-index: 100;
        color: var(--about-ink);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        overflow: hidden;
        background: var(--about-surface);
        transform: scale(1.008);
        transition:
          opacity 640ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 860ms cubic-bezier(0.16, 1, 0.3, 1),
          visibility 0ms linear 700ms;
      }

      .about-experience.is-active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: scale(1);
        transition:
          opacity 640ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 860ms cubic-bezier(0.16, 1, 0.3, 1),
          visibility 0ms linear 0ms;
      }

      .about-canvas {
        position: absolute;
        inset: 0;
        z-index: 1;
        background:
          radial-gradient(circle at 72% 46%, rgba(255,255,255,0.28), transparent 34%),
          radial-gradient(circle at 14% 88%, rgba(22,20,18,0.16), transparent 32%),
          linear-gradient(180deg, var(--about-surface) 0%, var(--about-surface-deep) 100%);
        overflow: hidden;
      }

      .about-canvas::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 78% 48%, rgba(255,255,255,0.36), transparent 32%),
          radial-gradient(circle at 8% 86%, rgba(22,20,18,0.14), transparent 28%),
          linear-gradient(180deg, rgba(255,255,255,0.08), rgba(22,20,18,0.11));
        opacity: 0.95;
      }

      .about-canvas::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(rgba(22,20,18,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(22,20,18,0.045) 1px, transparent 1px);
        background-size: 42px 42px;
        opacity: 0.5;
        mix-blend-mode: multiply;
      }

      .about-prism-stars {
        position: absolute;
        inset: 0;
        z-index: 2;
        pointer-events: none;
      }

      .about-prism-star {
        position: absolute;
        left: var(--x);
        top: var(--y);
        width: 2px;
        height: 2px;
        border-radius: 999px;
        background: rgba(22,20,18,0.72);
        opacity: 0.7;
        box-shadow:
          0 0 10px rgba(22,20,18,0.28),
          0 0 22px rgba(22,20,18,0.12);
        animation: aboutStarFloat var(--d) ease-in-out infinite alternate;
        animation-delay: var(--delay);
      }

      @keyframes aboutStarFloat {
        from {
          transform: translate3d(-18px, 12px, 0) scale(0.72);
        }

        to {
          transform: translate3d(28px, -22px, 0) scale(1.08);
        }
      }

      .about-photo-scene {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 4;
        transform:
          translate3d(-50%, -50%, 0)
          translate3d(var(--photo-x), var(--photo-y), 0)
          scale(var(--photo-scale));
        transform-origin: center;
        will-change: transform;
        perspective: 1400px;
        transition:
          transform 980ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .glass-specimen-frame {
        position: relative;
        width: min(406px, 29vw);
        height: min(552px, 70vh);
        min-width: 308px;
        min-height: 440px;
        box-sizing: border-box;
        clip-path: polygon(
          7% 0,
          100% 0,
          100% 76%,
          91% 76%,
          91% 100%,
          14% 100%,
          14% 91%,
          0 91%,
          0 9%
        );
        background:
          linear-gradient(135deg, rgba(255,255,255,0.42), rgba(255,255,255,0.08) 36%, rgba(22,20,18,0.08)),
          rgba(210,204,193,0.24);
        border: 1px solid rgba(22,20,18,0.24);
        box-shadow:
          0 44px 128px rgba(22,20,18,0.26),
          inset 0 1px 0 rgba(255,255,255,0.58),
          inset 0 -1px 0 rgba(22,20,18,0.08);
        backdrop-filter: blur(20px) saturate(1.12);
        -webkit-backdrop-filter: blur(20px) saturate(1.12);
        overflow: hidden;
        transform:
          perspective(1200px)
          rotateX(var(--tilt-x))
          rotateY(var(--tilt-y))
          translateZ(0);
        transform-style: preserve-3d;
        transition:
          transform 680ms cubic-bezier(0.16, 1, 0.3, 1),
          box-shadow 420ms ease;
      }

      .glass-depth {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        clip-path: inherit;
      }

      .glass-depth-back {
        transform: translate3d(14px, 18px, -36px);
        background: rgba(22,20,18,0.12);
        filter: blur(10px);
        opacity: 0.5;
      }

      .glass-depth-mid {
        inset: 9px;
        transform: translateZ(-18px);
        border: 1px solid rgba(22,20,18,0.1);
        opacity: 0.56;
      }

      .glass-specimen-frame::before {
        content: "";
        position: absolute;
        inset: 14px;
        z-index: 7;
        pointer-events: none;
        clip-path: polygon(
          7% 0,
          100% 0,
          100% 70%,
          86% 70%,
          86% 100%,
          12% 100%,
          12% 91%,
          0 91%,
          0 8%
        );
        border: 1px solid rgba(22,20,18,0.16);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.38),
          0 0 0 1px rgba(255,255,255,0.12);
        opacity: calc(0.48 + var(--glass-progress) * 0.48);
      }

      .glass-specimen-frame::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 6;
        pointer-events: none;
        background:
          radial-gradient(
            circle at var(--tilt-glare-x) var(--tilt-glare-y),
            rgba(255,255,255,0.38),
            rgba(255,255,255,0.07) 28%,
            transparent 56%
          ),
          linear-gradient(
            115deg,
            transparent 0%,
            transparent 26%,
            rgba(255,255,255,0.28) 41%,
            rgba(255,255,255,0.06) 47%,
            transparent 63%,
            transparent 100%
          );
        opacity: 0.56;
        mix-blend-mode: screen;
        transform: translateZ(42px);
      }

      .glass-orbit {
        position: absolute;
        z-index: 2;
        border-radius: 999px;
        pointer-events: none;
        border: 1px solid rgba(22,20,18,0.1);
        opacity: calc(0.24 + var(--glass-progress) * 0.36);
      }

      .glass-orbit-a {
        width: 82%;
        height: 42%;
        left: -22%;
        bottom: 10%;
        transform: rotate(-18deg);
      }

      .glass-orbit-b {
        width: 58%;
        height: 31%;
        right: -22%;
        top: 17%;
        transform: rotate(18deg);
      }

      .glass-cut {
        position: absolute;
        z-index: 8;
        pointer-events: none;
        background: rgba(210,204,193,0.92);
        border: 1px solid rgba(22,20,18,0.16);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.42);
      }

      .glass-cut-a {
        left: -1px;
        bottom: 9%;
        width: 15%;
        height: 10%;
        clip-path: polygon(0 0, 100% 100%, 0 100%);
      }

      .glass-cut-b {
        right: -1px;
        bottom: 24%;
        width: 10%;
        height: 13%;
        clip-path: polygon(0 0, 100% 0, 100% 100%);
      }

      .glass-corner {
        position: absolute;
        z-index: 9;
        width: 34px;
        height: 34px;
        border-color: rgba(22,20,18,0.42);
        pointer-events: none;
        opacity: calc(0.38 + var(--glass-progress) * 0.52);
      }

      .glass-corner-tl {
        left: 16px;
        top: 13px;
        border-left: 1px solid;
        border-top: 1px solid;
      }

      .glass-corner-tr {
        right: 13px;
        top: 13px;
        border-right: 1px solid;
        border-top: 1px solid;
      }

      .glass-corner-bl {
        left: 58px;
        bottom: 13px;
        border-left: 1px solid;
        border-bottom: 1px solid;
      }

      .glass-corner-br {
        right: 13px;
        bottom: 13px;
        border-right: 1px solid;
        border-bottom: 1px solid;
      }

      .glass-topbar {
        position: absolute;
        left: 32px;
        right: 28px;
        top: 25px;
        z-index: 10;
        display: flex;
        justify-content: space-between;
        gap: 18px;
        color: rgba(22,20,18,0.56);
        font-size: 0.55rem;
        font-weight: 200;
        line-height: 1;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        opacity: calc(0.48 + var(--glass-progress) * 0.48);
        transform: translateZ(56px);
      }

      .glass-side-label {
        position: absolute;
        left: 22px;
        top: 50%;
        z-index: 10;
        color: rgba(22,20,18,0.38);
        font-size: 0.5rem;
        font-weight: 200;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        writing-mode: vertical-rl;
        transform: translateY(-50%) rotate(180deg) translateZ(56px);
        opacity: calc(0.24 + var(--glass-progress) * 0.54);
      }

      .glass-inner {
        position: absolute;
        inset: 46px 34px 34px;
        z-index: 3;
        overflow: visible;
        transform-style: preserve-3d;
      }

      .glass-grid {
        position: absolute;
        inset: -46px -34px -34px;
        z-index: 1;
        background:
          linear-gradient(rgba(22,20,18,0.052) 1px, transparent 1px),
          linear-gradient(90deg, rgba(22,20,18,0.046) 1px, transparent 1px);
        background-size: 30px 30px;
        opacity: 0.58;
        mix-blend-mode: multiply;
        transform: translateZ(8px);
      }

      .glass-light {
        position: absolute;
        left: 50%;
        top: 12%;
        z-index: 2;
        width: 124%;
        height: 40%;
        border-radius: 999px;
        background: radial-gradient(circle, rgba(255,255,255,0.56), transparent 58%);
        transform: translateX(-50%) translateZ(24px);
        opacity: 0.48;
        filter: blur(10px);
        pointer-events: none;
      }

      .glass-prism {
        position: absolute;
        right: -38%;
        bottom: -4%;
        z-index: 2;
        width: 96%;
        height: 42%;
        background:
          linear-gradient(
            135deg,
            rgba(22,20,18,0.12),
            rgba(22,20,18,0.08),
            rgba(255,255,255,0.08)
          );
        filter: blur(22px);
        transform: rotate(-16deg) translateZ(18px);
        opacity: 0.72;
        mix-blend-mode: multiply;
      }

      .about-photo {
        position: absolute;
        left: 50%;
        bottom: -150%;
        z-index: 4;
        width: 268%;
        max-width: none;
        display: block;
        transform:
          translateX(-50%)
          translate3d(var(--tilt-photo-x), var(--tilt-photo-y), 46px);
        filter: grayscale(1) contrast(1.13);
        transition:
          filter 520ms ease,
          transform 720ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .glass-specimen-frame:hover .about-photo {
        filter: grayscale(1) contrast(1.17);
      }

      .glass-bottom {
        position: absolute;
        left: 32px;
        right: 28px;
        bottom: 25px;
        z-index: 10;
        display: flex;
        justify-content: space-between;
        gap: 18px;
        color: rgba(22,20,18,0.5);
        font-size: 0.55rem;
        font-weight: 200;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        opacity: calc(0.42 + var(--glass-progress) * 0.52);
        transform: translateZ(56px);
      }

      .about-text-panel,
      .contact-panel {
        position: absolute;
        left: clamp(34px, 6vw, 92px);
        top: 50%;
        z-index: 3;
        width: min(700px, 46vw);
        color: var(--about-ink);
        will-change: transform, opacity, filter;
      }

      .about-text-panel {
        opacity: var(--text-progress);
        transform:
          translate3d(
            calc(-64px + var(--text-progress) * 64px),
            -50%,
            0
          );
        filter: blur(calc((1 - var(--text-progress)) * 7px));
        transition:
          opacity 720ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
          filter 720ms ease;
      }

      .contact-panel {
        width: min(700px, 50vw);
        opacity: var(--contact-progress);
        transform:
          translate3d(
            calc(-44px + var(--contact-progress) * 44px),
            calc(-50% + (1 - var(--contact-progress)) * 36px),
            0
          );
        filter: blur(calc((1 - var(--contact-progress)) * 8px));
        pointer-events: none;
        transition:
          opacity 720ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
          filter 720ms ease;
      }

      .about-experience.is-contact .contact-panel {
        pointer-events: auto;
      }

      .about-kicker,
      .contact-kicker {
        display: inline-block;
        margin-bottom: clamp(18px, 2.8vh, 30px);
        color: rgba(22,20,18,0.52);
        font-size: 0.58rem;
        font-weight: 200;
        letter-spacing: 0.28em;
        text-transform: uppercase;
      }

      .about-kicker {
        opacity: var(--text-kicker);
        transform: translate3d(calc((1 - var(--text-kicker)) * -22px), 0, 0);
        transition:
          opacity 620ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 720ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .about-text-panel h2,
      .contact-panel h2 {
        max-width: 700px;
        margin: 0;
        color: var(--about-ink);
        font-size: clamp(3rem, 5vw, 6.4rem);
        font-weight: 200;
        line-height: 0.88;
        letter-spacing: -0.052em;
        text-transform: uppercase;
      }

      .contact-panel h2 {
        max-width: 650px;
        font-size: clamp(2.62rem, 4.1vw, 5.1rem);
      }

      .about-text-panel h2 {
        opacity: var(--text-title);
        transform: translate3d(calc((1 - var(--text-title)) * -34px), 0, 0);
        transition:
          opacity 720ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 820ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .about-lead,
      .contact-panel p {
        max-width: 570px;
        margin: clamp(24px, 3.6vh, 40px) 0 0;
        color: rgba(22,20,18,0.72);
        font-size: clamp(1.02rem, 1.2vw, 1.22rem);
        font-weight: 200;
        line-height: 1.36;
        letter-spacing: 0.004em;
      }

      .about-lead {
        opacity: var(--text-lead);
        transform: translate3d(calc((1 - var(--text-lead)) * -28px), 0, 0);
        transition:
          opacity 760ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 860ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .about-lead em,
      .contact-panel p em {
        font-style: italic;
      }

      .about-copy-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: clamp(18px, 2.6vw, 34px);
        max-width: 640px;
        margin-top: clamp(28px, 4.2vh, 48px);
        opacity: var(--text-blocks);
        transform: translate3d(calc((1 - var(--text-blocks)) * -24px), 0, 0);
        transition:
          opacity 760ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .about-copy-grid p {
        margin: 0;
        color: rgba(22,20,18,0.64);
        font-size: clamp(0.92rem, 1vw, 1.02rem);
        font-weight: 200;
        line-height: 1.5;
        border-top: 1px solid rgba(22,20,18,0.18);
        padding-top: 14px;
      }

      .about-skill-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1px;
        max-width: 640px;
        margin-top: clamp(30px, 4.6vh, 52px);
        border: 1px solid rgba(22,20,18,0.16);
        background: rgba(22,20,18,0.16);
        border-radius: 18px;
        overflow: hidden;
        opacity: var(--text-blocks);
        transform: translate3d(calc((1 - var(--text-blocks)) * -18px), 0, 0);
        transition:
          opacity 820ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 940ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .about-skill-grid div {
        min-height: 104px;
        padding: 16px;
        background: rgba(210,204,193,0.74);
        box-sizing: border-box;
        transition:
          background 260ms ease,
          transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .about-skill-grid div:hover {
        background: rgba(224,218,207,0.96);
        transform: translateY(-4px);
      }

      .about-skill-grid span {
        display: block;
        margin-bottom: 24px;
        color: rgba(22,20,18,0.42);
        font-size: 0.56rem;
        letter-spacing: 0.16em;
      }

      .about-skill-grid strong {
        display: block;
        color: var(--about-ink);
        font-size: clamp(0.9rem, 1vw, 1.02rem);
        font-weight: 400;
        line-height: 1.08;
      }

      .contact-shell {
        max-width: 700px;
      }

      .contact-actions-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-top: clamp(30px, 4.6vh, 46px);
      }

      .contact-action {
        position: relative;
        min-height: 116px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 18px;
        box-sizing: border-box;
        color: var(--about-ink);
        text-decoration: none;
        text-align: left;
        border: 1px solid rgba(22, 20, 18, 0.18);
        border-radius: 20px;
        background:
          linear-gradient(180deg, rgba(218, 212, 201, 0.78), rgba(194, 187, 176, 0.54));
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.22),
          0 24px 70px rgba(22, 20, 18, 0.08);
        backdrop-filter: blur(8px);
        transition:
          background 240ms ease,
          border-color 240ms ease,
          transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .contact-action:hover {
        background:
          linear-gradient(180deg, rgba(232, 226, 216, 0.94), rgba(204, 197, 186, 0.68));
        border-color: rgba(22, 20, 18, 0.32);
        transform: translateY(-4px);
      }

      .contact-action span {
        color: rgba(22, 20, 18, 0.5);
        font-size: 0.56rem;
        font-weight: 200;
        letter-spacing: 0.22em;
        text-transform: uppercase;
      }

      .contact-action svg {
        width: 24px;
        height: 24px;
        fill: rgba(22, 20, 18, 0.74);
      }

      .contact-action strong {
        color: var(--about-ink);
        font-size: 0.88rem;
        font-weight: 200;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .contact-action.is-disabled {
        opacity: 0.5;
      }

      .contact-action.is-disabled:hover {
        transform: none;
        border-color: rgba(22, 20, 18, 0.18);
        background:
          linear-gradient(180deg, rgba(218, 212, 201, 0.78), rgba(194, 187, 176, 0.54));
      }

      #contact {
        min-height: 100vh;
        position: relative;
        z-index: 10;
      }

      @media (max-width: 768px) {
        body,
        a,
        button {
          cursor: auto;
        }

        .custom-cursor {
          display: none;
        }

        .header {
          padding: 24px 22px;
        }

        .logo-image-link {
          width: 70px;
        }

        .nav {
          gap: 18px;
        }

        .nav-item {
          font-size: 0.62rem;
          letter-spacing: 0.18em;
        }

        .hero-section {
          padding: 0 24px;
        }

        .hero-title-source {
          font-size: clamp(3rem, 15vw, 5.8rem);
          line-height: 0.92;
        }

        .hero-title-source [data-hero-line="clear-useful"] {
          margin-left: 0.7em;
        }

        .hero-title-source [data-hero-line="digital"] {
          margin-left: 1.4em;
        }

        .hero-title-source [data-hero-line="experiences"] {
          margin-left: 1.02em;
        }

        .work-fixed {
          padding-top: 128px;
          padding-bottom: 56px;
        }

        .work-kicker,
        .work-row {
          padding-left: 24px;
          padding-right: 24px;
        }

        .work-row {
          height: 48px;
        }

        .work-row-name {
          left: 24px;
          font-size: clamp(1rem, 5vw, 1.72rem);
        }

        .work-row-meta {
          display: none;
        }

        .work-row.is-expanded {
          height: 54vh;
        }

        .work-expanded-image {
          width: 90vw;
          height: 27vh;
        }

        .work-preview {
          display: none;
        }

        .case-arrow {
          top: auto;
          bottom: 18px;
          min-width: 0;
          transform: none;
        }

        .case-arrow small {
          display: none;
        }

        .case-arrow-left {
          left: 22px;
        }

        .case-arrow-right {
          right: 22px;
        }

        .case-panel {
          left: 14px;
          top: 66px;
          width: calc(100vw - 28px);
          max-height: calc(100vh - 88px);
          transform: none;
          border-radius: 18px;
        }

        @keyframes caseIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .case-image {
          border-radius: 18px 18px 0 0;
        }

        .case-grid {
          grid-template-columns: 1fr;
        }

        .case-mockup-stage {
          min-height: auto;
          grid-template-columns: 1fr;
          gap: 34px;
          padding: 28px;
        }

        .case-section-heading {
          display: block;
        }

        .case-section-heading strong {
          display: block;
          margin-top: 14px;
        }

        .case-mockup-copy {
          max-width: none;
        }

        .case-device-composition {
          min-height: 620px;
        }

        .case-tablet-frame {
          right: -24px;
          top: 48%;
          width: min(620px, 112vw);
          transform:
            translateY(-50%)
            rotateZ(-3deg)
            perspective(1000px)
            rotateY(-5deg)
            rotateX(2deg);
        }

        .case-phone-frame {
          left: -6px;
          bottom: 8px;
          width: min(210px, 48vw);
          transform:
            rotateZ(4deg)
            perspective(900px)
            rotateY(8deg)
            rotateX(2deg);
        }

        .about-photo-scene {
          transform:
            translate3d(-50%, -50%, 0)
            translate3d(calc(var(--photo-x) * 0.26), calc(var(--photo-y) * 0.35), 0)
            scale(calc(var(--photo-scale) * 0.96));
        }

        .glass-specimen-frame {
          width: min(344px, 80vw);
          height: min(486px, 64vh);
          min-width: 0;
          min-height: 0;
        }

        .about-photo {
          width: 270%;
          bottom: -148%;
        }

        .about-text-panel,
        .contact-panel {
          left: 22px;
          top: 54%;
          width: calc(100vw - 44px);
        }

        .about-text-panel {
          opacity: clamp(0, calc((var(--text-progress) - 0.22) * 1.6), 1);
          transform:
            translate3d(
              calc(-34px + var(--text-progress) * 34px),
              -50%,
              0
            );
        }

        .about-text-panel h2,
        .contact-panel h2 {
          font-size: clamp(2.8rem, 13vw, 5rem);
          max-width: 92vw;
        }

        .about-lead,
        .contact-panel p {
          max-width: 88vw;
          font-size: clamp(1rem, 4.2vw, 1.22rem);
        }

        .about-copy-grid,
        .about-skill-grid {
          grid-template-columns: 1fr;
        }

        .contact-actions-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .contact-action {
          min-height: 104px;
        }
      }
    `,
    []
  );

  return (
    <main id="top" className="relative min-h-screen text-white">
      <style>{css}</style>

      <PrismBackground progress={heroProgress} />
      <Cursor dark={aboutMode} />
      <Hero progress={heroProgress} />

      <Header
        compact={heroProgress > 0.18 || aboutMode || aboutWiping}
        tone={aboutMode ? "light" : "dark"}
        onNavigate={navigate}
      />

      <AboutWipe active={aboutWiping} />

      <AboutExperience
        active={aboutMode}
        progress={aboutProgress}
        view={aboutView}
      />

      <section className="hero-spacer" style={{ height: "150vh" }} />

      <WorkStrips resetKey={workResetKey} />

      <section id="contact" />
    </main>
  );
}