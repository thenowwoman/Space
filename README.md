# Space

Space is an African demand intelligence agent. A seller names the artists their audience loves, and Space uses Qloo's taste graph to find the taste signals those audiences share, then turns them into a Demand Brief.

**Live demo:** https://space-sepia-rho.vercel.app

## How Qloo powers it
1. The seller enters up to 5 audience anchors (for example Burna Boy, Tems, Asake).
2. A server function searches each anchor in Qloo and picks the exact-name match.
3. It reads each entity's taste tags from Qloo and counts which tags the anchors share.
4. The brief shows the strongest signals, the matched entities, and drafted positioning lines.

All signals come from Qloo's data. Without Qloo there is nothing to read.

## Run locally
Run `npm install`. Set `QLOO_API_KEY` and `QLOO_BASE_URL=https://hackathon.api.qloo.com` as environment variables, then run `vercel dev`. Keep the key server-side only.

## Limits
Space surfaces real taste signals and drafts positioning from them. It does not yet name specific products to stock, and music anchors work best. Food and fashion anchors are next.

## License
MIT
