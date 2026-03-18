"use client";

import { useState } from "react";

const OUTPUT_TYPES = [
  {
    id: "shorts",
    label: "YouTube Shorts",
    icon: "▶",
    color: "#ff0000",
    description: "3 high-energy short scripts",
    prompt: (transcript) => `You are an expert YouTube Shorts scriptwriter.
Create 3 high-energy YouTube Shorts scripts from this transcript.
Each script needs: HOOK (first 3 seconds), BODY (main value), CTA (call to action).
Format clearly with Script 1/2/3 headers.
Transcript: ${transcript}`,
  },
  {
    id: "thread",
    label: "Tweet Thread",
    icon: "𝕏",
    color: "#1d9bf0",
    description: "Viral 10-tweet thread",
    prompt: (transcript) => `You are an expert Twitter/X thread writer.
Create a viral 10-tweet thread from this transcript.
Tweet 1 must be a powerful hook. Number each tweet. End with a CTA tweet.
Transcript: ${transcript}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn Post",
    icon: "in",
    color: "#0077b5",
    description: "Hook, paragraphs, carousel concept",
    prompt: (transcript) => `You are an expert LinkedIn content strategist.
Create a high-performing LinkedIn post from this transcript.
Include: Strong hook line, short punchy paragraphs, key takeaways as bullet points, closing line, 5 relevant hashtags, and a carousel slide concept (5 slides outlined).
Transcript: ${transcript}`,
  },
  {
    id: "blog",
    label: "Blog Article",
    icon: "✍",
    color: "#ff6b35",
    description: "1200–1500 word SEO article",
    prompt: (transcript) => `You are an expert SEO blog writer.
Create a full 1200-1500 word SEO-optimised blog article from this transcript.
Include: Title, Meta description (155 chars), Introduction, 4-5 H2 sections with content, Conclusion, 5 target keywords.
Transcript: ${transcript}`,
  },
  {
    id: "newsletter",
    label: "Newsletter",
    icon: "✉",
    color: "#9333ea",
    description: "Full email edition",
    prompt: (transcript) => `You are an expert email newsletter writer.
Create a full newsletter edition from this transcript.
Include: 2 subject line A/B options, Preview text, Hero section, 2-3 content sections, Key takeaway box, CTA section, PS line.
Transcript: ${transcript}`,
  },
  {
    id: "thumbnails",
    label: "Thumbnail Ideas",
    icon: "🖼",
    color: "#f59e0b",
    description: "5 thumbnail concepts",
    prompt: (transcript) => `You are an expert YouTube thumbnail strategist.
Create 5 distinct thumbnail concepts from this transcript.
For each: Main text overlay, Visual composition description, Emotion to convey, Color palette, Design rationale.
Format clearly numbered 1-5.
Transcript: ${transcript}`,
  },
];

const validateUrl = (val) => {
  const patterns = [
    /youtube\.com\/watch\?v=[\w-]+/,
    /youtu\.be\/[\w-]+/,
    /youtube\.com\/shorts\/[\w-]+/,
  ];
  return patterns.some((p) => p.test(val));
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');

  :root {
    --bg: #0a0a0a;
    --card: #111111;
    --card2: #1a1a1a;
    --border: #222222;
    --accent: #00ff88;
    --accent2: #00cc6a;
    --accent-dim: rgba(0, 255, 136, 0.08);
    --text: #f0f0f0;
    --muted: #666666;
    --error: #ff4444;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  * { box-sizing: border-box; }

  .app {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    font-family: var(--font-mono);
    color: var(--text);
  }

  .app ::-webkit-scrollbar { width: 4px; height: 4px; }
  .app ::-webkit-scrollbar-track { background: var(--card); }
  .app ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  header {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
    padding: 1rem 2rem;
    backdrop-filter: blur(10px);
    background: rgba(10, 10, 10, 0.9);
  }

  .logo {
    font-family: var(--font-display);
    font-size: 1.25rem;
    color: var(--accent);
    letter-spacing: -0.02em;
  }

  .badge {
    font-size: 0.7rem;
    padding: 2px 10px;
    border-radius: 99px;
    border: 1px solid var(--accent);
    color: var(--accent);
  }

  main {
    max-width: 860px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .step {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .step-label {
    font-family: var(--font-display);
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .step-label span {
    color: var(--accent);
    margin-right: 0.5rem;
  }

  .url-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .url-row input {
    flex: 1;
  }

  .url-row .check {
    color: var(--accent);
    font-size: 1rem;
  }

  input[type="text"],
  textarea {
    width: 100%;
    background: var(--card2);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-family: var(--font-mono);
    transition: all 0.15s ease;
  }

  input[type="text"]:focus,
  textarea:focus {
    border-color: var(--accent);
    outline: none;
  }

  input.valid {
    border-color: var(--accent);
  }

  textarea {
    resize: vertical;
    min-height: 180px;
  }

  .word-count {
    font-size: 0.75rem;
    color: var(--muted);
    text-align: right;
  }

  .hint {
    font-size: 0.75rem;
    color: var(--muted);
    line-height: 1.6;
  }

  .hint.error {
    color: var(--error);
  }

  .output-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  @media (max-width: 600px) {
    .output-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 400px) {
    .output-grid { grid-template-columns: 1fr; }
  }

  .output-card {
    background: var(--card2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem;
    cursor: pointer;
    position: relative;
    transition: all 0.15s ease;
  }

  .output-card:hover {
    border-color: var(--type-color);
    background: var(--card);
  }

  .output-card.selected {
    border-color: var(--type-color);
    background: color-mix(in srgb, var(--type-color) 10%, var(--card2));
    box-shadow: 0 0 0 1px var(--type-color);
  }

  .card-icon {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
  }

  .card-label {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.85rem;
  }

  .card-desc {
    font-size: 0.7rem;
    color: var(--muted);
    margin-top: 0.25rem;
  }

  .card-status {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    font-size: 0.75rem;
  }

  .card-status.loading {
    color: var(--accent);
    animation: pulse 1s ease-in-out infinite;
  }

  .card-status.done {
    color: var(--accent);
  }

  .card-status.error {
    color: var(--error);
  }

  .generate-btn {
    width: 100%;
    background: var(--accent);
    color: #000;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: -0.01em;
    transition: all 0.15s ease;
  }

  .generate-btn:hover:not(:disabled) {
    background: var(--accent2);
    transform: translateY(-1px);
  }

  .generate-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .progress-summary {
    font-size: 0.7rem;
    color: var(--accent);
    letter-spacing: 0.1em;
  }

  .tab-bar {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tab {
    background: var(--card2);
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.15s ease;
  }

  .tab.active {
    background: var(--accent-dim);
    border-color: var(--accent);
    color: var(--accent);
  }

  .tab-dot.loading {
    color: var(--accent);
    animation: pulse 1s ease-in-out infinite;
  }

  .tab-dot.done {
    color: var(--accent);
  }

  .output-panel {
    background: var(--card2);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    font-family: var(--font-display);
    font-size: 0.85rem;
  }

  .copy-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 0.3rem 0.75rem;
    border-radius: 5px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .copy-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .output-text {
    padding: 1.25rem;
    max-height: 500px;
    overflow-y: auto;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    line-height: 1.7;
    color: var(--text);
  }

  .output-text::-webkit-scrollbar { width: 4px; }
  .output-text::-webkit-scrollbar-track { background: var(--card); }
  .output-text::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  .output-text pre {
    white-space: pre-wrap;
    margin: 0;
  }

  .loading-state {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--muted);
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .error-state {
    color: var(--error);
    font-size: 0.8rem;
  }

  .quick-copy-strip {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .quick-copy-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 0.35rem 0.8rem;
    border-radius: 5px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .quick-copy-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  footer {
    margin-top: auto;
    padding: 1.5rem 2rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    color: var(--muted);
  }

  .fade-in {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function RepurposeAI() {
  const [url, setUrl] = useState("");
  const [urlValid, setUrlValid] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [outputs, setOutputs] = useState({});
  const [progress, setProgress] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [copied, setCopied] = useState({});
  const [isFetchingTranscript, setIsFetchingTranscript] = useState(false);
  const [transcriptError, setTranscriptError] = useState("");

  const callClaude = async (type, transcriptText) => {
    const systemPrompt = `You are an expert content repurposing strategist who transforms video transcripts into platform-native content. You write in an engaging, high-value style optimised for each platform's algorithm and audience. Be specific, actionable, and creative.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: type.prompt(transcriptText) }],
      }),
    });
    const data = await response.json();
    return data.content?.[0]?.text || "No content generated.";
  };

  const handleGenerate = async () => {
    if (!transcript.trim() || selectedTypes.length === 0) return;
    setIsGenerating(true);

    const initProgress = {};
    selectedTypes.forEach((id) => {
      initProgress[id] = "loading";
    });
    setProgress(initProgress);
    setActiveTab(selectedTypes[0]);

    await Promise.all(
      selectedTypes.map(async (id) => {
        const type = OUTPUT_TYPES.find((t) => t.id === id);
        try {
          const result = await callClaude(type, transcript);
          setOutputs((prev) => ({ ...prev, [id]: result }));
          setProgress((prev) => ({ ...prev, [id]: "done" }));
        } catch (e) {
          setProgress((prev) => ({ ...prev, [id]: "error" }));
        }
      })
    );

    setIsGenerating(false);
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(outputs[id] || "");
    setCopied((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [id]: false })), 2000);
  };

  const handleUrlChange = async (e) => {
    const val = e.target.value;
    setUrl(val);
    setTranscriptError("");
    const valid = validateUrl(val);
    setUrlValid(valid);
    if (!valid) {
      setShowTranscript(false);
      return;
    }

    setShowTranscript(true);
    setIsFetchingTranscript(true);
    setTranscript("");

    try {
      const res = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: val }),
      });
      const data = await res.json();
      if (!res.ok || !data.transcript) {
        throw new Error(data.error || "Failed to fetch transcript");
      }
      setTranscript(data.transcript);
    } catch (err) {
      setTranscript("");
      setTranscriptError(
        "Auto transcript failed. Paste your script or transcript manually."
      );
    } finally {
      setIsFetchingTranscript(false);
    }
  };

  return (
    <div className="app">
      <style>{CSS}</style>

      <header>
        <div className="logo">⚡ RepurposeAI</div>
        <div className="badge">{selectedTypes.length} outputs selected</div>
      </header>

      <main>
        <section className="step">
          <div className="step-label">
            <span>01</span> Video URL
          </div>
          <div className="url-row">
            <input
              type="text"
              placeholder="Paste YouTube URL..."
              value={url}
              onChange={handleUrlChange}
              className={urlValid ? "valid" : ""}
            />
            {urlValid && <span className="check">✓</span>}
          </div>
          {url && !urlValid && (
            <p className="hint error">Invalid YouTube URL</p>
          )}
        </section>

        {showTranscript && (
          <section className="step fade-in">
            <div className="step-label">
              <span>02</span> Transcript or Script
            </div>
            <p className="hint">
              No transcript yet? Paste your script, notes, or video description
              instead. If your video has captions, open YouTube → click the
              description to expand it → click &quot;Show transcript&quot; on the
              right side of the video.
            </p>
            {isFetchingTranscript && (
              <p className="hint">
                Fetching transcript from YouTube via Gemini…
              </p>
            )}
            {transcriptError && (
              <p className="hint error">{transcriptError}</p>
            )}
            <textarea
              placeholder="Paste your transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={8}
            />
            <div className="word-count">
              {transcript.trim()
                ? transcript.trim().split(/\s+/).length
                : 0}{" "}
              words
            </div>
          </section>
        )}

        {showTranscript && (
          <section className="step fade-in">
            <div className="step-label">
              <span>03</span> Select Outputs
            </div>
            <div className="output-grid">
              {OUTPUT_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type.id);
                const prog = progress[type.id];
                return (
                  <div
                    key={type.id}
                    className={`output-card ${isSelected ? "selected" : ""}`}
                    style={{ "--type-color": type.color }}
                    onClick={() => {
                      if (isGenerating) return;
                      setSelectedTypes((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== type.id)
                          : [...prev, type.id]
                      );
                    }}
                  >
                    <div
                      className="card-icon"
                      style={{ color: type.color }}
                    >
                      {type.icon}
                    </div>
                    <div className="card-label">{type.label}</div>
                    <div className="card-desc">{type.description}</div>
                    {prog === "loading" && (
                      <div className="card-status loading">●</div>
                    )}
                    {prog === "done" && (
                      <div className="card-status done">✓</div>
                    )}
                    {prog === "error" && (
                      <div className="card-status error">✗</div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={
                isGenerating ||
                !transcript.trim() ||
                selectedTypes.length === 0
              }
            >
              {isGenerating
                ? `Generating... ${Object.values(progress).filter((v) => v === "done").length}/${selectedTypes.length} complete`
                : `Generate ${selectedTypes.length} Content Piece${selectedTypes.length !== 1 ? "s" : ""} →`}
            </button>
          </section>
        )}

        {activeTab && (
          <section className="step results fade-in">
            <div className="step-label">Results</div>

            <div className="progress-summary">
              {Object.values(progress).filter((v) => v === "done").length}/
              {selectedTypes.length} complete
            </div>

            <div className="tab-bar">
              {selectedTypes.map((id) => {
                const type = OUTPUT_TYPES.find((t) => t.id === id);
                const prog = progress[id];
                return (
                  <button
                    key={id}
                    className={`tab ${activeTab === id ? "active" : ""}`}
                    onClick={() => setActiveTab(id)}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                    {prog === "loading" && (
                      <span className="tab-dot loading">●</span>
                    )}
                    {prog === "done" && (
                      <span className="tab-dot done">●</span>
                    )}
                  </button>
                );
              })}
            </div>

            {activeTab && (
              <div className="output-panel">
                <div className="panel-header">
                  <span
                    style={{
                      color: OUTPUT_TYPES.find((t) => t.id === activeTab)
                        ?.color,
                    }}
                  >
                    {OUTPUT_TYPES.find((t) => t.id === activeTab)?.icon}{" "}
                    {OUTPUT_TYPES.find((t) => t.id === activeTab)?.label}
                  </span>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(activeTab)}
                  >
                    {copied[activeTab] ? "✓ Copied!" : "Copy all"}
                  </button>
                </div>
                <div className="output-text">
                  {progress[activeTab] === "loading" && (
                    <div className="loading-state">
                      <div className="spinner" /> Generating{" "}
                      {OUTPUT_TYPES.find((t) => t.id === activeTab)?.label}...
                    </div>
                  )}
                  {progress[activeTab] === "done" && (
                    <pre>{outputs[activeTab]}</pre>
                  )}
                  {progress[activeTab] === "error" && (
                    <div className="error-state">
                      Generation failed. Check your connection and try again.
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="quick-copy-strip">
              {selectedTypes
                .filter((id) => id !== activeTab && progress[id] === "done")
                .map((id) => {
                  const type = OUTPUT_TYPES.find((t) => t.id === id);
                  return (
                    <button
                      key={id}
                      className="quick-copy-btn"
                      onClick={() => copyToClipboard(id)}
                    >
                      {type.icon} {copied[id] ? "✓" : "Copy"} {type.label}
                    </button>
                  );
                })}
            </div>
          </section>
        )}
      </main>

      <footer>
        <span>RepurposeAI — Turn 1 video into 6 content pieces</span>
        <span>Powered by Claude AI</span>
      </footer>
    </div>
  );
}
