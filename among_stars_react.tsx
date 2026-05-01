import { useState, useEffect, useRef } from "react";

const gold = "#c8a96e";
const bg = "#0c0b09";
const surface = "rgba(200,169,110,0.05)";
const border = "rgba(200,169,110,0.2)";
const borderFaint = "rgba(200,169,110,0.12)";
const textMain = "#d4c9b8";
const textMuted = "#6b6358";
const textBody = "#b8aa98";

const s = {
  wrap: { background: bg, minHeight: "100vh", padding: "2.5rem 1.5rem", fontFamily: "'Cormorant Garamond', serif", color: textMain },
  h1: { fontSize: "2rem", fontWeight: 300, letterSpacing: ".18em", color: gold, textTransform: "uppercase", marginBottom: ".3rem" },
  sub: { fontFamily: "'Inconsolata', monospace", fontSize: ".7rem", letterSpacing: ".14em", color: textMuted, textTransform: "uppercase", marginBottom: "2.5rem" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem 1.5rem", marginBottom: "1.5rem" },
  field: { display: "flex", flexDirection: "column", gap: ".4rem" },
  label: { fontFamily: "'Inconsolata', monospace", fontSize: ".65rem", letterSpacing: ".14em", color: gold, textTransform: "uppercase" },
  input: { background: "rgba(200,169,110,0.06)", border: `1px solid ${border}`, borderRadius: "2px", color: textMain, fontFamily: "'Inconsolata', monospace", fontSize: ".88rem", padding: ".6rem .8rem", outline: "none" },
  hint: { fontFamily: "'Inconsolata', monospace", fontSize: ".6rem", color: "#3e3a34", marginTop: ".1rem" },
  btn: { display: "block", width: "100%", padding: ".8rem", background: "transparent", border: `1px solid rgba(200,169,110,0.45)`, borderRadius: "2px", color: gold, fontFamily: "'Inconsolata', monospace", fontSize: ".78rem", letterSpacing: ".18em", textTransform: "uppercase", cursor: "pointer", marginBottom: "2.5rem" },
  err: { fontFamily: "'Inconsolata', monospace", fontSize: ".75rem", color: "#c06060", padding: ".75rem 1rem", border: "1px solid rgba(192,96,96,0.3)", borderRadius: "2px", marginBottom: "1.5rem", background: "rgba(192,96,96,0.05)" },
  preview: { padding: "1.25rem 1.5rem", border: `1px solid rgba(200,169,110,0.15)`, borderRadius: "2px", background: surface, marginBottom: "2rem" },
  pvTitle: { fontSize: "1.65rem", fontWeight: 300, color: "#e8dece", letterSpacing: ".04em", marginBottom: ".2rem" },
  pvMeta: { fontFamily: "'Inconsolata', monospace", fontSize: ".68rem", letterSpacing: ".1em", color: textMuted, marginBottom: ".7rem" },
  pill: { display: "inline-block", fontFamily: "'Inconsolata', monospace", fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: gold, border: `1px solid rgba(200,169,110,0.35)`, borderRadius: "1px", padding: ".2rem .55rem", marginBottom: ".9rem" },
  pvDesc: { fontSize: ".98rem", fontWeight: 300, lineHeight: 1.75, color: textBody, fontStyle: "italic" },
  divider: { border: "none", borderTop: `1px solid ${borderFaint}`, margin: "1.5rem 0" },
  blockWrap: { marginBottom: "1.75rem" },
  blockLabel: { fontFamily: "'Inconsolata', monospace", fontSize: ".65rem", letterSpacing: ".14em", color: gold, textTransform: "uppercase", marginBottom: ".5rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
  copyBtn: { background: "transparent", border: `1px solid rgba(200,169,110,0.25)`, borderRadius: "2px", color: gold, fontFamily: "'Inconsolata', monospace", fontSize: ".6rem", letterSpacing: ".1em", padding: ".2rem .55rem", cursor: "pointer" },
  pre: { background: "rgba(0,0,0,0.45)", border: `1px solid ${borderFaint}`, borderRadius: "2px", padding: "1rem 1.1rem", overflowX: "auto", fontFamily: "'Inconsolata', monospace", fontSize: ".74rem", lineHeight: 1.6, color: "#a89e8e", whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 },
};

export default function App() {
  const [catalog, setCatalog] = useState("");
  const [filename, setFilename] = useState("");
  const [integration, setIntegration] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState({});

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inconsolata:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  const handleKey = e => { if (e.key === "Enter" && !loading) generate(); };

  async function generate() {
    setErr("");
    if (!catalog.trim() || !filename.trim() || !integration.trim() || !date.trim()) {
      setErr("All four fields are required."); return;
    }
    setLoading(true);
    try {
      const prompt = `You are an astrophysics reference assistant. Return ONLY a raw JSON object with no markdown fences, no preamble, no explanation.

For the astronomical object "${catalog.trim()}", return exactly this structure:
{
  "title": "common name of the object",
  "tag": "one of: galaxy | nebula | cluster | comet | other",
  "desc": "3 to 5 sentences, scientifically precise and elegantly written, no apostrophes, no markdown, no contractions",
  "depth": [array of {"name": "Full Name (Catalog)", "type": "galaxy|nebula|cluster|star|other", "ly": distance_as_number} for the primary object and any notable companions],
  "gal_l": galactic_longitude_as_number,
  "gal_b": galactic_latitude_as_number,
  "ly": distance_in_light_years_as_number
}

Return only the JSON. No backticks. No markdown. No text before or after.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `API error ${res.status}`);

      const raw = data.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      const d = JSON.parse(raw);

      const tag = (d.tag || "other").toLowerCase();
      const title = d.title || catalog.trim();
      const meta = `${catalog.trim().toUpperCase()} · ${date.trim()} · Edinburgh · ${integration.trim()}`;
      const depthStr = JSON.stringify(d.depth || []);
      const imgPath = `images/${filename.trim()}`;
      const primary = (d.depth && d.depth[0]) ? d.depth[0] : { name: `${title} (${catalog.trim()})`, type: tag, ly: d.ly };
      const shortName = title.split(" ").slice(0, 3).join(" ");

      const htmlSnippet =
`<div class="card" data-img="${imgPath}"
  data-tag="${tag}" data-title="${title}" data-meta="${meta}"
  data-depth='${depthStr}'
  data-desc="${d.desc || ''}"></div>`;

      const jsSnippet = `  {name:"${shortName} (${catalog.trim()})", type:"${tag}", ly:${d.ly}, l:${d.gal_l}, b:${d.gal_b}},`;

      setResult({ title, meta, tag, desc: d.desc, htmlSnippet, jsSnippet });
    } catch(e) {
      setErr("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function copyBlock(text, key) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(c => ({ ...c, [key]: true }));
      setTimeout(() => setCopied(c => ({ ...c, [key]: false })), 2000);
    });
  }

  const field = (label, id, val, set, placeholder, hint) => (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input style={s.input} value={val} onChange={e => set(e.target.value)}
        onKeyDown={handleKey} placeholder={placeholder} />
      {hint && <span style={s.hint}>{hint}</span>}
    </div>
  );

  return (
    <div style={s.wrap}>
      <h1 style={s.h1}>Among Stars</h1>
      <p style={s.sub}>Card Generator</p>

      <div style={s.grid}>
        {field("Catalog ID / Name", "catalog", catalog, setCatalog, "M13, NGC 891, C32…")}
        {field("Image Filename", "fn", filename, setFilename, "m13_rgb.jpg", "Images/ prepended automatically · case-sensitive")}
        {field("Integration Time", "int", integration, setIntegration, "1h 30m")}
        {field("Capture Date", "date", date, setDate, "29 Apr 2026")}
      </div>

      <button style={s.btn} onClick={generate} disabled={loading}>
        {loading ? "Querying Claude…" : "Generate Card"}
      </button>

      {err && <div style={s.err}>{err}</div>}

      {result && <>
        <div style={s.preview}>
          <div style={s.pvTitle}>{result.title}</div>
          <div style={s.pvMeta}>{result.meta}</div>
          <div style={s.pill}>{result.tag}</div>
          <div style={s.pvDesc}>{result.desc}</div>
        </div>

        <hr style={s.divider} />

        <div style={s.blockWrap}>
          <div style={s.blockLabel}>
            Card HTML
            <button style={s.copyBtn} onClick={() => copyBlock(result.htmlSnippet, "html")}>
              {copied.html ? "Copied" : "Copy"}
            </button>
          </div>
          <pre style={s.pre}>{result.htmlSnippet}</pre>
        </div>

        <div style={s.blockWrap}>
          <div style={s.blockLabel}>
            GALACTIC_TARGETS entry
            <button style={s.copyBtn} onClick={() => copyBlock(result.jsSnippet, "js")}>
              {copied.js ? "Copied" : "Copy"}
            </button>
          </div>
          <pre style={s.pre}>{result.jsSnippet}</pre>
        </div>
      </>}
    </div>
  );
}
