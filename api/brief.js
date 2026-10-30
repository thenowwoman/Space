export default async function handler(req, res) {
  try {
    const anchors = (req.body?.anchors || []).slice(0, 5);
    const base = process.env.QLOO_BASE_URL || "https://hackathon.api.qloo.com";
    const key = process.env.QLOO_API_KEY;
    if (!key) return res.status(500).json({ error: "Missing QLOO_API_KEY" });

    const lookups = await Promise.all(
      anchors.map(async (a) => {
        try {
          const r = await fetch(
            `${base}/search?query=${encodeURIComponent(a)}&take=5`,
            { headers: { "X-Api-Key": key } }
          );
          if (!r.ok) return null;
          const data = await r.json();
          const results = Array.isArray(data) ? data : data.results || [];
          const hit =
            results.find((x) => x.name?.toLowerCase() === a.toLowerCase()) ||
            results[0];
          return hit ? { anchor: a, hit } : null;
        } catch {
          return null;
        }
      })
    );

    const tally = {};
    const found = [];
    for (const item of lookups) {
      if (!item) continue;
      found.push({ anchor: item.anchor, matched: item.hit.name });
      for (const n of new Set((item.hit.tags || []).map((t) => t.name))) {
        tally[n] = (tally[n] || 0) + 1;
      }
    }

    const signals = Object.entries(tally)
      .sort((x, y) => y[1] - x[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    res.status(200).json({ found, signals });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}