import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { useApi } from "./hooks/useApi";
import WarmUpProvider from "./components/WarmUpProvider";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";


const COLORS = {
  "Careful Spenders": "#E17055",
  "High Value Champions": "#00B894",
  "Average Segment": "#0984E3",
  "Enthusiastic Spenders": "#FDCB6E",
  "Budget Conscious": "#A29BFE"
};

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0D1B2A 0%, #1E2D3D 50%, #0D1B2A 100%)",
    color: "#DFE6E9",
    fontFamily: "'Inter', 'Poppins', sans-serif",
    padding: "0",
  },
  header: {
    background: "rgba(0,184,148,0.08)",
    borderBottom: "1px solid rgba(0,184,148,0.2)",
    padding: "20px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    color: "#00B894",
    letterSpacing: -1,
  },
  badge: {
    background: "rgba(0,184,148,0.15)",
    border: "1px solid #00B894",
    color: "#00B894",
    borderRadius: 20,
    padding: "4px 14px",
    fontSize: 12,
    fontWeight: 600,
  },
  main: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "32px 16px",
  },
  hero: {
    textAlign: "center",
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 800,
    color: "#FFFFFF",
    marginBottom: 12,
    lineHeight: 1.2,
  },
  heroSub: {
    color: "#A0AEC0",
    fontSize: 16,
    maxWidth: 500,
    margin: "0 auto",
  },
  tabs: {
    display: "flex",
    gap: 8,
    marginBottom: 28,
    background: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: 6,
  },
  tab: (active) => ({
    flex: 1,
    padding: "10px 0",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    background: active ? "#00B894" : "transparent",
    color: active ? "#0D1B2A" : "#A0AEC0",
    transition: "all 0.2s",
  }),
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#A0AEC0",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#FFFFFF",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    marginBottom: 8,
    accentColor: "#00B894",
  },
  sliderVal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#A0AEC0",
    marginBottom: 20,
  },
  btn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #00B894, #00A381)",
    border: "none",
    borderRadius: 12,
    color: "#0D1B2A",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
    letterSpacing: 0.5,
  },
  resultCard: (color) => ({
    background: `linear-gradient(135deg, ${color}22, ${color}11)`,
    border: `2px solid ${color}`,
    borderRadius: 16,
    padding: 28,
    marginTop: 24,
    animation: "fadeIn 0.4s ease",
  }),
  segmentName: (color) => ({
    fontSize: 28,
    fontWeight: 800,
    color: color,
    marginBottom: 8,
  }),
  chip: (color) => ({
    display: "inline-block",
    background: `${color}22`,
    border: `1px solid ${color}`,
    color: color,
    borderRadius: 20,
    padding: "4px 14px",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 16,
  }),
  infoRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginTop: 16,
  },
  infoBox: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: 10,
    padding: 16,
  },
  infoLabel: {
    fontSize: 11,
    color: "#A0AEC0",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoVal: {
    fontSize: 14,
    color: "#DFE6E9",
    lineHeight: 1.5,
  },
  dropzone: (isDrag) => ({
    border: `2px dashed ${isDrag ? "#00B894" : "rgba(255,255,255,0.15)"}`,
    borderRadius: 16,
    padding: "48px 24px",
    textAlign: "center",
    cursor: "pointer",
    background: isDrag ? "rgba(0,184,148,0.08)" : "rgba(255,255,255,0.02)",
    transition: "all 0.2s",
    marginBottom: 20,
  }),
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 20,
  },
  summaryCard: (color) => ({
    background: `${color}15`,
    border: `1px solid ${color}40`,
    borderRadius: 12,
    padding: 16,
  }),
  footer: {
    textAlign: "center",
    padding: "24px",
    color: "#4A5568",
    fontSize: 13,
    borderTop: "1px solid rgba(255,255,255,0.06)",
    marginTop: 40,
  }
};

function SinglePredict() {
  const [age, setAge] = useState(30);
  const [income, setIncome] = useState(60);
  const [score, setScore] = useState(50);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { predict: apiPredict } = useApi();

  const predict = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await apiPredict({
        age: parseFloat(age),
        annual_income: parseFloat(income),
        spending_score: parseFloat(score),
      });
      setResult(data);
    } catch (e) {
      setError("Server is waking up — please try again in 20 seconds.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={styles.card}>
        <label style={styles.label}>Age: {age} years</label>
        <input type="range" min="18" max="70" value={age}
          onChange={e => setAge(e.target.value)} style={styles.slider} />
        <div style={styles.sliderVal}><span>18</span><span>70</span></div>

        <label style={styles.label}>Annual Income: ${income}k</label>
        <input type="range" min="15" max="137" value={income}
          onChange={e => setIncome(e.target.value)} style={styles.slider} />
        <div style={styles.sliderVal}><span>$15k</span><span>$137k</span></div>

        <label style={styles.label}>Spending Score: {score}/100</label>
        <input type="range" min="1" max="100" value={score}
          onChange={e => setScore(e.target.value)} style={styles.slider} />
        <div style={styles.sliderVal}><span>1</span><span>100</span></div>

        <button onClick={predict} style={styles.btn} disabled={loading}>
          {loading ? "Predicting..." : "Predict Segment"}
        </button>

        {error && <p style={{ color: "#E17055", marginTop: 12 }}>{error}</p>}
      </div>

      {result && (
        <div style={styles.resultCard(result.color)}>
          <div style={styles.chip(result.color)}>Cluster {result.cluster}</div>
          <div style={styles.segmentName(result.color)}>{result.segment_name}</div>
          <p style={{ color: "#A0AEC0", marginBottom: 8 }}>{result.profile}</p>
          <p style={{ color: "#DFE6E9", fontSize: 14, lineHeight: 1.7 }}>{result.strategy}</p>

          <div style={styles.infoRow}>
            <div style={styles.infoBox}>
              <div style={styles.infoLabel}>Confidence</div>
              <div style={{ ...styles.infoVal, color: result.color, fontWeight: 700, fontSize: 22 }}>
                {result.confidence}%
              </div>
            </div>
            <div style={styles.infoBox}>
              <div style={styles.infoLabel}>Kenya Channel</div>
              <div style={styles.infoVal}>{result.mpesa_channel}</div>
            </div>
            <div style={styles.infoBox}>
              <div style={styles.infoLabel}>Age</div>
              <div style={styles.infoVal}>{result.input.age} years</div>
            </div>
            <div style={styles.infoBox}>
              <div style={styles.infoLabel}>Income / Score</div>
              <div style={styles.infoVal}>${result.input.annual_income}k / {result.input.spending_score}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CSVPredict() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { predictBatch } = useApi();

  const onDrop = useCallback(async (files) => {
    setLoading(true);
    setError("");
    setResults(null);
    const formData = new FormData();
    formData.append("file", files[0]);
    try {
      const data = await predictBatch(formData);
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data);
      }
    } catch (e) {
      setError("Server is waking up — please try again in 20 seconds.");
    }
    setLoading(false);
  }, [predictBatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "text/csv": [".csv"] }, maxFiles: 1
  });

  const chartData = results ? Object.entries(results.summary).map(([name, value]) => ({
    name, value
  })) : [];

  return (
    <div>
      <div style={styles.card}>
        <p style={{ color: "#A0AEC0", marginBottom: 16, fontSize: 14 }}>
          Upload a CSV with columns: <strong style={{ color: "#00B894" }}>Age, AnnualIncome, SpendingScore</strong>
        </p>

        <div {...getRootProps()} style={styles.dropzone(isDragActive)}>
          <input {...getInputProps()} />
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          <div style={{ color: isDragActive ? "#00B894" : "#A0AEC0", fontWeight: 600 }}>
            {isDragActive ? "Drop your CSV here" : "Drag and drop CSV or tap to browse"}
          </div>
          <div style={{ color: "#4A5568", fontSize: 13, marginTop: 8 }}>
            Supports multiple customers in one file
          </div>
        </div>

        {loading && <p style={{ color: "#00B894", textAlign: "center" }}>Analysing your data...</p>}
        {error && <p style={{ color: "#E17055" }}>{error}</p>}
      </div>

      {results && (
        <div>
          <div style={styles.card}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              {results.total} Customers Segmented
            </div>
            <div style={{ color: "#A0AEC0", fontSize: 14, marginBottom: 24 }}>
              Segment distribution across your customer base
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" outerRadius={100}
                  dataKey="value" nameKey="name" label={({ name, percent }) =>
                    `${(percent * 100).toFixed(0)}%`}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name] || "#888"} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} customers`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div style={styles.summaryGrid}>
              {Object.entries(results.summary).map(([name, count]) => (
                <div key={name} style={styles.summaryCard(COLORS[name] || "#888")}>
                  <div style={{ color: COLORS[name], fontWeight: 700, fontSize: 15 }}>{name}</div>
                  <div style={{ color: "#A0AEC0", fontSize: 13 }}>{count} customers</div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Individual Predictions</div>
            {results.predictions.slice(0, 10).map((r, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)"
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: r.color, flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <span style={{ color: r.color, fontWeight: 600 }}>{r.segment_name}</span>
                  <span style={{ color: "#4A5568", fontSize: 12, marginLeft: 8 }}>
                    Age {r.input.age} · ${r.input.annual_income}k · Score {r.input.spending_score}
                  </span>
                </div>
                <div style={{ color: "#A0AEC0", fontSize: 12 }}>{r.confidence}%</div>
              </div>
            ))}
            {results.total > 10 && (
              <div style={{ color: "#4A5568", fontSize: 13, marginTop: 12, textAlign: "center" }}>
                Showing first 10 of {results.total} predictions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("single");

  return (
    <WarmUpProvider>
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.logo}>SegmentIQ</div>
        <div style={styles.badge}>K-Means · 5 Segments · Live</div>
      </header>

      <main style={styles.main}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>
            Know Your Customer.<br />
            <span style={{ color: "#00B894" }}>Before They Walk Out.</span>
          </h1>
          <p style={styles.heroSub}>
            Enter customer data or upload a CSV to instantly predict which
            segment they belong to — with a tailored business strategy.
          </p>
        </div>

        <div style={styles.tabs}>
          <button style={styles.tab(tab === "single")} onClick={() => setTab("single")}>
            Single Prediction
          </button>
          <button style={styles.tab(tab === "csv")} onClick={() => setTab("csv")}>
            CSV Batch Upload
          </button>
        </div>

        {tab === "single" ? <SinglePredict /> : <CSVPredict />}
      </main>

      <footer style={styles.footer}>
        Built by James Koero · Kisumu, Kenya · Built on Android ·
        <a href="https://github.com/jameskoero/jameskoero-kmeans-customer-segmentation"
          style={{ color: "#00B894", marginLeft: 6 }}>GitHub</a>
      </footer>
    </div>
    </WarmUpProvider>
  );
}
