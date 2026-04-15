const express = require("express");
const neo4j = require("neo4j-driver");
const path = require("path");

const app = express();
const PORT = 3000;

const driver = neo4j.driver(
  "neo4j+s://bac06bfc.databases.neo4j.io",
  neo4j.auth.basic("bac06bfc", "BZA6haKvdyzT0IwGnliqrTUrJsuokMpnTtdlcPico7Q")
);

app.use(express.static(path.join(__dirname, "public")));

function toPlain(val) {
  if (val === null || val === undefined) return val;
  if (neo4j.isInt(val)) return val.toNumber();
  if (neo4j.isDate(val) || neo4j.isDateTime(val) || neo4j.isLocalDateTime(val))
    return val.toString();
  if (typeof val === "object" && !Array.isArray(val)) {
    const out = {};
    for (const [k, v] of Object.entries(val)) out[k] = toPlain(v);
    return out;
  }
  if (Array.isArray(val)) return val.map(toPlain);
  return val;
}

function recordsToObjects(records) {
  return records.map((r) => {
    const obj = {};
    for (const key of r.keys) {
      obj[key] = toPlain(r.get(key));
    }
    return obj;
  });
}

app.get("/api/queries", async (req, res) => {
  const session = driver.session();
  const results = {};

  try {
    // Q1: Action-RPGs mit Bewertung > 8.0
    const r1 = await session.run(
      `MATCH (s:Spiel)
       WHERE s.genre = "Action-RPG" AND s.bewertung > 8.0
       RETURN s.titel, s.genre, s.bewertung, s.preis
       ORDER BY s.bewertung DESC`
    );
    results.q1 = recordsToObjects(r1.records);

    // Q2: Minecraft Besitzer mit Kaufpreis
    const r2 = await session.run(
      `MATCH (sp:Spieler)-[b:BESITZT]->(s:Spiel)
       WHERE s.titel = "Minecraft"
       RETURN sp.username, b.kaufdatum, b.kaufpreis
       ORDER BY b.kaufpreis ASC`
    );
    results.q2 = recordsToObjects(r2.records);

    // Q3: Japanische Entwickler -> Spiel -> Plattform
    const r3 = await session.run(
      `MATCH (e:Entwickler)-[:ENTWICKELT]->(s:Spiel)-[:VERFUEGBAR_AUF]->(p:Plattform)
       WHERE e.land = "Japan"
       RETURN e.name AS entwickler, s.titel AS spiel, p.name AS plattform`
    );
    results.q3 = recordsToObjects(r3.records);

    // Q4: Spielstunden > 100, sortiert
    const r4 = await session.run(
      `MATCH (sp:Spieler)-[spielt:SPIELT]->(s:Spiel)
       WHERE spielt.spielstunden > 100
       RETURN sp.username, s.titel, spielt.spielstunden, spielt.letztes_spieldatum
       ORDER BY spielt.spielstunden DESC`
    );
    results.q4 = recordsToObjects(r4.records);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server laeuft auf http://localhost:${PORT}`);
});
