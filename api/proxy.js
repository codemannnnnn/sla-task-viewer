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

    // Return raw XML so we can see exactly what the API sends
    res.status(200).json({ 
      raw: xmlText.slice(0, 1000),
      length: xmlText.length,
      httpStatus: response.status
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}