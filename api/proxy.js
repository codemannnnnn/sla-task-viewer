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

    const response = await fetch(
      "https://lokidev.glsuite.us/UI/api/UITierService/ProcessDocument",
      {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: rawBody,
      }
    );

    const xmlText = await response.text();

    // Parse XML rows into JSON using DOMParser-style attribute extraction
    const rows = [];
    const rowRegex = /<row\b([^>]*?)(?:\/?>)/gs;
    const attrRegex = /(\w+)="([^"]*)"/g;

    let rowMatch;
    while ((rowMatch = rowRegex.exec(xmlText)) !== null) {
      const attrs = {};
      let attrMatch;
      const attrString = rowMatch[1];
      while ((attrMatch = attrRegex.exec(attrString)) !== null) {
        const key = attrMatch[1].replace(/_x0020_/g, "_");
        attrs[key] = attrMatch[2];
      }
      rows.push(attrs);
    }

    // Debug: if still empty, return a snippet of the raw XML so we can see what we're dealing with
    if (rows.length === 0) {
      return res.status(200).json({ debug: true, snippet: xmlText.substring(0, 500) });
    }

    res.status(200).json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}