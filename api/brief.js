export default async function handler(req, res) {
  const anchors = (req.body?.anchors || []).slice(0, 5);
  const base = process.env.QLOO_BASE_URL || "https://hackathon.api.qloo.com";
  const tally = {};
  const found = [];

  for (const a of anchors) {
    const r = await fetch(
      `${base}/search?query=${encodeURIComponent(a)}&take=5`,
      { headers: { "X-Api-Key": process.env.QLOO_API_KEY } }
    );
    const data = await r.json();
    const results = Array.isArray(data) ? data : data.results || [];
    const hit =
      results.find((x) => x.name?.toLowerCase() === a.toLowerCase()) || results[0];
    if (!hit) continue;
    found.push({ anchor: a, matched: hit.name });
    for (const t of hit.tags || []) tally[t.name] = (tally[t.name] || 0) + 1;
  }

  const signals = Object.entries(tally)
    .sort((x, y) => y[1] - x[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  res.status(200).json({ found, signals });
}