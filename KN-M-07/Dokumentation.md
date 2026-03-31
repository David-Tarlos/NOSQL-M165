# KN-M-07: Programmierung mit MongoDB (Node.js)

**Thema:** Videospiele & Gaming
**Datenbank:** `gamingDB`

---

## Setup

```bash
cd KN-M-07/Dateien
npm install
node app.js
```

Danach im Browser oeffnen: [http://localhost:3000](http://localhost:3000)

Die Web-App verwendet `express` als Webserver und `mongodb` (Version 6.x) fuer die Datenbankverbindung. Per Klick auf "Abfragen laden" werden alle 6 Queries ausgefuehrt und die Ergebnisse in Tabellen angezeigt.

---

## Abfragen

Die App fuehrt 6 Abfragen aus — 3 `find()` und 3 `aggregate()`:

| # | Typ | Was | Technik | Herkunft |
|---|-----|-----|---------|----------|
| Q1 | `find()` | Action-RPGs mit Bewertung > 8.0 | `$and` | KN-M-03 Abfrage 1 |
| Q2 | `find()` | Plattformen mit "Station" im Namen | `$regex` | KN-M-03 Abfrage 3 |
| Q3 | `find()` | Spiele von japanischen Entwicklern | Subdocument-Filter (`entwickler.land`) | KN-M-04 C2 |
| Q4 | `aggregate()` | Anzahl Spiele pro Genre | `$group` + `$sum` | KN-M-04 A3 |
| Q5 | `aggregate()` | Spiele mit Plattform-Details | `$lookup` | KN-M-04 B1 |
| Q6 | `aggregate()` | Spiel-Plattform-Paare (flach) | `$unwind` + `$lookup` | KN-M-04 C3 |

---

## Code

### [`app.js`](Dateien/app.js) — Express Server + MongoDB Queries

```javascript
const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const PORT = 3000;
const uri = "mongodb://admin:12345@100.52.14.227:27017/gamingDB?authSource=admin";

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/queries", async (req, res) => {
  const client = new MongoClient(uri);
  const results = {};

  try {
    await client.connect();
    const db = client.db("gamingDB");

    // Q1: find() — Action-RPGs mit Bewertung > 8.0
    results.q1 = await db.collection("spiele").find(
      { $and: [{ genre: "Action-RPG" }, { bewertung: { $gt: 8.0 } }] },
      { projection: { _id: 1, titel: 1, genre: 1, bewertung: 1 } }
    ).toArray();

    // Q2: find() — Plattformen mit Regex "Station"
    results.q2 = await db.collection("plattformen").find(
      { name: { $regex: /Station/i } },
      { projection: { _id: 0, name: 1, hersteller: 1, typ: 1 } }
    ).toArray();

    // Q3: find() — Subdocument-Filter entwickler.land = "Japan"
    results.q3 = await db.collection("spiele").find(
      { "entwickler.land": "Japan" },
      { projection: { _id: 0, titel: 1, "entwickler.name": 1, "entwickler.land": 1 } }
    ).toArray();

    // Q4: aggregate() — Anzahl Spiele pro Genre
    results.q4 = await db.collection("spiele").aggregate([
      { $group: { _id: "$genre", anzahl: { $sum: 1 } } },
      { $sort: { anzahl: -1 } }
    ]).toArray();

    // Q5: aggregate() — $lookup Spiele -> Plattformen
    results.q5 = await db.collection("spiele").aggregate([
      {
        $lookup: {
          from: "plattformen",
          localField: "plattform_ids",
          foreignField: "_id",
          as: "plattformen_details"
        }
      },
      {
        $project: {
          _id: 0, titel: 1, genre: 1,
          "plattformen_details.name": 1,
          "plattformen_details.hersteller": 1
        }
      }
    ]).toArray();

    // Q6: aggregate() — $unwind + $lookup
    results.q6 = await db.collection("spiele").aggregate([
      { $unwind: "$plattform_ids" },
      {
        $lookup: {
          from: "plattformen",
          localField: "plattform_ids",
          foreignField: "_id",
          as: "plattform"
        }
      },
      { $unwind: "$plattform" },
      {
        $project: {
          _id: 0, titel: 1,
          plattform_name: "$plattform.name",
          plattform_hersteller: "$plattform.hersteller"
        }
      }
    ]).toArray();

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server laeuft auf http://localhost:${PORT}`);
});
```

### [`public/index.html`](Dateien/public/index.html) — Frontend

Das Frontend zeigt die Ergebnisse in einer Card-Grid-Ansicht mit Tabellen an. Jede Karte zeigt den Query-Typ (find/aggregate), eine Beschreibung und die Ergebnis-Tabelle.

---

## Screenshots

**Web-UI nach dem Laden der Abfragen:**

![Web-UI](Dateien/screenshot_webui.png)

---

## Abgabe-Dateien

| Datei | Beschreibung |
|---|---|
| [`app.js`](Dateien/app.js) | Express Server mit 6 MongoDB-Abfragen als REST-API |
| [`public/index.html`](Dateien/public/index.html) | Frontend mit Card-Grid fuer Abfrage-Ergebnisse |
| [`package.json`](Dateien/package.json) | npm-Paketdefinition mit `mongodb` + `express` |
