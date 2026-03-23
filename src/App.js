import React, { useState, useEffect, useCallback } from "react";
import { RandomPassword } from "./utils/RandomPassword";

const HISTORY_KEY = "pwd_gen_history";
const THEME_KEY = "pwd_gen_theme";
const MAX_HISTORY = 10;

function calcStrength(len, charsets) {
  if (charsets === 0) return { score: 0, label: "" };
  let points = 0;
  if (len >= 10) points++;
  if (len >= 20) points++;
  if (charsets >= 2) points++;
  if (charsets >= 4) points++;
  if (points === 0) return { score: 1, label: "Weak" };
  if (points === 1) return { score: 2, label: "Fair" };
  if (points <= 3) return { score: 3, label: "Good" };
  return { score: 4, label: "Strong" };
}

function timeAgo(ts) {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function App({ version, onVersionSwitch }) {
  const [length, setLength] = useState(16);
  const [upperCase, setUpperCase] = useState(true);
  const [lowerCase, setLowerCase] = useState(true);
  const [numeric, setNumeric] = useState(true);
  const [symbol, setSymbol] = useState(true);
  const [pwd, setPwd] = useState("");
  const [tag, setTag] = useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || "light"
  );
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const buildPwd = useCallback((opts, len) => {
    return new RandomPassword()
      .setLength(len)
      .setUpperCase(opts.upperCase)
      .setLowerCase(opts.lowerCase)
      .setNumberCase(opts.numeric)
      .setSymbol(opts.symbol)
      .generate();
  }, []);

  const addToHistory = useCallback((password, label) => {
    const entry = {
      id: Date.now(),
      password,
      tag: label || "",
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    const opts = { upperCase, lowerCase, numeric, symbol };
    const newPwd = buildPwd(opts, length);
    setPwd(newPwd);
  }, [upperCase, lowerCase, numeric, symbol, length, buildPwd]);

  const handleGenerate = () => {
    const opts = { upperCase, lowerCase, numeric, symbol };
    const newPwd = buildPwd(opts, length);
    setPwd(newPwd);
    addToHistory(newPwd, tag);
    setTag("");
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const charsets = [upperCase, lowerCase, numeric, symbol].filter(Boolean).length;
  const strength = calcStrength(length, charsets);
  const strengthNames = ["", "weak", "fair", "good", "strong"];
  const strengthName = strengthNames[strength.score];

  return (
    <div className="app">
      <div className="card">
        <header className="card-header">
          <h1>
            Password Generator
            <span className="v2-badge">v2</span>
          </h1>
          <div className="header-actions">
            {onVersionSwitch && (
              <div className="version-switcher">
                <button
                  className={`version-btn${version === "v1" ? " active" : ""}`}
                  onClick={() => onVersionSwitch("v1")}
                >
                  v1
                </button>
                <button
                  className={`version-btn${version === "v2" ? " active" : ""}`}
                  onClick={() => onVersionSwitch("v2")}
                >
                  v2
                </button>
              </div>
            )}
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀" : "☽"}
            </button>
          </div>
        </header>

        <div className="pwd-section">
          <div className="pwd-display">
            <input
              id="pwd-input"
              className="pwd-input"
              type="text"
              readOnly
              value={pwd}
            />
            <button
              className={`copy-btn${copiedId === "current" ? " copied" : ""}`}
              onClick={() => copyToClipboard(pwd, "current")}
            >
              {copiedId === "current" ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="strength-meter">
            <div className="strength-bar">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`strength-segment${
                    i <= strength.score ? ` active-${strengthName}` : ""
                  }`}
                />
              ))}
            </div>
            {strength.label && (
              <span className={`strength-label ${strengthName}`}>
                {strength.label}
              </span>
            )}
          </div>
        </div>

        <hr className="divider" />

        <div className="options">
          <div className="option-group">
            <p className="options-label">Character Sets</p>
            <div className="checkboxes">
              {[
                { label: "Uppercase", value: upperCase, set: setUpperCase },
                { label: "Lowercase", value: lowerCase, set: setLowerCase },
                { label: "Numbers", value: numeric, set: setNumeric },
                { label: "Symbols", value: symbol, set: setSymbol },
              ].map(({ label, value, set }) => (
                <label key={label} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => set(e.target.checked)}
                  />
                  <span className="checkbox-custom" />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="option-group">
            <p className="options-label">Length</p>
            <div className="length-control">
              <div className="length-header">
                <span className="length-display">{length} chars</span>
                <input
                  type="number"
                  min="8"
                  max="40"
                  value={length}
                  onChange={(e) =>
                    setLength(
                      Math.min(40, Math.max(8, Number(e.target.value) || 8))
                    )
                  }
                  className="length-input"
                />
              </div>
              <input
                type="range"
                min="8"
                max="40"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="slider"
              />
            </div>
          </div>
        </div>

        <div className="tag-row">
          <input
            type="text"
            className="tag-input"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Label this password... e.g. GitHub, Netflix (optional)"
            maxLength={40}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>

        <button className="generate-btn" onClick={handleGenerate}>
          Generate Password
        </button>

        {history.length > 0 && (
          <div className="history">
            <div className="history-header">
              <span className="history-title">History ({history.length})</span>
              <button className="clear-btn" onClick={clearHistory}>
                Clear all
              </button>
            </div>
            <ul className="history-list">
              {history.map((entry) => (
                <li
                  key={entry.id}
                  className={`history-item${entry.tag ? " has-tag" : ""}`}
                  data-tooltip={entry.tag || undefined}
                >
                  {entry.tag && <span className="tag-dot" aria-hidden="true" />}
                  <span className="history-pwd">{entry.password}</span>
                  <div className="history-right">
                    <span className="history-time">
                      {timeAgo(entry.timestamp)}
                    </span>
                    <button
                      className={`history-copy-btn${
                        copiedId === entry.id ? " copied" : ""
                      }`}
                      onClick={() => copyToClipboard(entry.password, entry.id)}
                      aria-label="Copy password"
                    >
                      {copiedId === entry.id ? "✓" : "Copy"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <footer>
        Made with &#9829; by{" "}
        <a href="https://francisakoji.com">Francis Akoji</a>
      </footer>
    </div>
  );
}
