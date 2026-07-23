export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const token = process.env.GLSUITE_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "Server misconfigured: missing token." });
  }

  const xmlBody = `<root RuleMarker="1">
  <Object Name="Entity" ObjectID="1" ObjectPK="1000009">
    <Association ActionTypeID="1" ObjectID="11">
      <Property Name="ObjectTypeID" ObjectID="37" ObjectPK="76" PriorValue="" ActionTypeID="2">109973</Property>
      <Object ObjectID="34" ActionTypeID="1" Selected="1">
        <Property Name="ObjectTypeID" ObjectID="37" ObjectPK="76" PriorValue="" ActionTypeID="2">12571</Property>
      </Object>
    </Association>
  </Object>
${token}
</root>`;

  try {
    const upstream = await fetch(
      "https://lokiprod.glsuite.us/UI/api/UITierService/ProcessDocument",
      {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlBody,
      }
    );

    const xmlText = await upstream.text();

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
