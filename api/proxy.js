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

    // Parse every <row ... /> element into a flat object
    const rows = [];
    let i = 0;
    while (i < xmlText.length) {
      const start = xmlText.indexOf("<row ", i);
      if (start === -1) break;
      const end = xmlText.indexOf("/>", start);
      if (end === -1) break;
      const chunk = xmlText.slice(start + 5, end); // attributes string
      const obj = {};
      const attrRe = /(\w+)="([^"]*)"/g;
      let m;
      while ((m = attrRe.exec(chunk)) !== null) {
        const key = m[1].replace(/_x0020_/g, "_");
        obj[key] = m[2];
      }
      if (Object.keys(obj).length > 0) rows.push(obj);
      i = end + 2;
    }

    res.status(200).json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}