const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const PORT = 3000;
const uri = "mongodb://admin:12345@52.73.228.122:27017/gamingDB?authSource=admin&readPreference=primary&ssl=false";

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
