import { useState } from "react";
import "./App.css";

type Signal = { name: string; count: number };
type Found = { anchor: string; matched: string };
type Result = { found: Found[]; signals: Signal[] };

export default function App() {
  const [step, setStep] = useState<"profile" | "agent" | "brief">("profile");
  const [brand, setBrand] = useState("");
  const [city, setCity] = useState("Lagos");
  const [anchorText, setAnchorText] = useState("Burna Boy, Tems, Asake");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const anchors = anchorText.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);

  async function run() {
    setError("");
    setStep("agent");
    try {
      const r = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anchors }),
      });
      if (!r.ok) throw new Error("Qloo request failed (" + r.status + ")");
      const data: Result = await r.json();
      if (!data.found?.length || !data.signals?.length)
        throw new Error("Qloo did not return taste signals for those anchors. Try artist names.");
      setResult(data);
      setStep("brief");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStep("profile");
    }
  }

  const s = result?.signals ?? [];
  const top = s[0]?.name;
  const strong = s.filter((x) => x.count > 1);
  const weak = s.filter((x) => x.count === 1);

  return (
    <div className="wrap">
      <div className="logo"><span className="mark"><i /></span>Space</div>

      {step === "profile" && (
        <>
          <h1>Tell Space about your customers</h1>
          <p className="sub">Name the artists your audience loves. Space reads their taste tags from Qloo.</p>
          <div className="card">
            <label>Business name</label>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Adaeze Wears" />
            <label>City</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} />
            <label>Audience anchors (up to 5, separated by commas)</label>
            <input value={anchorText} onChange={(e) => setAnchorText(e.target.value)} />
            <button onClick={run} disabled={!anchors.length}>Read my demand</button>
            {error && <p className="err">{error}</p>}
          </div>
        </>
      )}

      {step === "agent" && (
        <div className="card">
          <div className="pulse" />
          <h2>Space is reading taste signals</h2>
          <p className="muted">Searching Qloo for: {anchors.join(", ")}</p>
        </div>
      )}

      {step === "brief" && result && (
        <>
          <h1>Your demand brief{brand ? ` · ${brand}` : ""}</h1>
          <p className="sub">Built from Qloo taste tags for {result.found.length} anchors in {city}.</p>

          <div className="card dark">
            <p className="muted" style={{ color: "#F5B800" }}>STRONGEST SHARED SIGNAL</p>
            <h2 style={{ fontSize: 34 }}>{top}</h2>
            <p>Shared by {s[0].count} of {result.found.length} anchors. Lead your range and content here.</p>
          </div>

          <div className="card">
            <h2>Matched in Qloo</h2>
            {result.found.map((f) => (
              <span className="chip" key={f.anchor}>{f.anchor} → {f.matched}</span>
            ))}
          </div>

          <div className="card">
            <h2>Taste signals to build around</h2>
            {strong.map((x) => (
              <span className="chip" key={x.name}>{x.name} · {x.count} anchors</span>
            ))}
            {!strong.length && <p className="muted">No signal was shared by more than one anchor. Try anchors from one scene.</p>}
          </div>

          <div className="card">
            <h2>Positioning language</h2>
            <p>“Made for {s[0]?.name} days.”</p>
            {s[1] && <p>“{s[1].name}, styled for {city}.”</p>}
            <p className="muted">Drafted from your top signals. Edit freely.</p>
          </div>

          <div className="card">
            <h2>Don’t lead with</h2>
            {weak.slice(0, 4).map((x) => (
              <span className="chip" key={x.name}>{x.name}</span>
            ))}
            <p className="muted">Only one anchor carries these, so treat them as optional.</p>
          </div>

          <button onClick={() => setStep("profile")}>Start over</button>
        </>
      )}
    </div>
  );
}