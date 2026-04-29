export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const rawBody = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => resolve(data));
      req.on("error", reject);
    });

    const upstream = await fetch(
      "https://lokiprod.glsuite.us/UI/api/UITierService/ProcessDocument",
      {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: rawBody,
      }
    );

    const xmlText = await upstream.text();

    // Parse <row ... /> elements iteratively
    const rows = [];
    let i = 0;
    while (i < xmlText.length) {
      const start = xmlText.indexOf("<row ", i);
      if (start === -1) break;
      const end = xmlText.indexOf("/>", start);
      if (end === -1) break;
      const chunk = xmlText.slice(start + 5, end);
      const obj = {};
      const attrRe = /(\w+)="([^"]*)"/g;
      let m;
      while ((m = attrRe.exec(chunk)) !== null) {
        obj[m[1].replace(/_x0020_/g, "_")] = m[2];
      }
      if (Object.keys(obj).length > 0) rows.push(obj);
      i = end + 2;
    }

    // Always return array; include debug info if empty so client can surface it
    if (rows.length === 0) {
      return res.status(200).json({
        _debug: true,
        upstreamStatus: upstream.status,
        xmlLength: xmlText.length,
        xmlSnippet: xmlText.slice(0, 600),
      });
    }

    res.status(200).json(rows);

  } catch (error) {
    res.status(500).json({ _error: error.message });
  }
}