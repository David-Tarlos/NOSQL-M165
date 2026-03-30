// KN-M-04: Datenmanipulation und Abfragen II
// Ausfuehrung: mongosh gamingDB aggregation_queries.js

// =============================================
// A) Aggregationen (50%)
// =============================================

// A1) KN-M-03 AND-Abfrage als Aggregation mit zwei $match-Stages
//     Genre "Action-RPG" UND Bewertung > 8.0

print("=== A1: Zwei $match-Stages (Action-RPG, Bewertung > 8.0) ===");
db.spiele.aggregate([
  { $match: { genre: "Action-RPG" } },
  { $match: { bewertung: { $gt: 8.0 } } },
  { $project: { _id: 1, titel: 1, genre: 1, bewertung: 1 } }
]).forEach(printjson);


// A2) $match + $project + $sort: Spiele ab 2020, sortiert nach Preis absteigend

print("=== A2: Spiele ab 2020, sortiert nach Preis (absteigend) ===");
db.spiele.aggregate([
  { $match: { erscheinungsjahr: { $gte: 2020 } } },
  { $project: { _id: 0, titel: 1, preis: 1, erscheinungsjahr: 1 } },
  { $sort: { preis: -1 } }
]).forEach(printjson);


// A3) $group + $sum: Anzahl Spiele pro Genre

print("=== A3: Anzahl Spiele pro Genre ===");
db.spiele.aggregate([
  { $group: { _id: "$genre", anzahl: { $sum: 1 } } },
  { $sort: { anzahl: -1 } }
]).forEach(printjson);


// A4) Erweiterter $group: Durchschnittliche Bewertung + Gesamtpreis pro Genre

print("=== A4: Durchschnittliche Bewertung + Gesamtpreis pro Genre ===");
db.spiele.aggregate([
  {
    $group: {
      _id: "$genre",
      durchschnittsBewertung: { $avg: "$bewertung" },
      gesamtPreis: { $sum: "$preis" }
    }
  },
  { $sort: { durchschnittsBewertung: -1 } }
]).forEach(printjson);


// =============================================
// B) Join-Aggregation (30%)
// =============================================

// B1) $lookup: spiele -> plattformen ueber plattform_ids

print("=== B1: Spiele mit Plattform-Details ($lookup) ===");
db.spiele.aggregate([
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
      _id: 0,
      titel: 1,
      genre: 1,
      "plattformen_details.name": 1,
      "plattformen_details.hersteller": 1
    }
  }
]).forEach(printjson);


// B2) $lookup: spiele -> spieler ueber spieler_ids,
//     dann $match fuer Spiele mit mehr als 2 Spielern, sortiert nach Anzahl

print("=== B2: Spiele mit >2 Spielern, sortiert nach Spieleranzahl ===");
db.spiele.aggregate([
  {
    $lookup: {
      from: "spieler",
      localField: "spieler_ids",
      foreignField: "_id",
      as: "spieler_details"
    }
  },
  {
    $addFields: {
      spielerAnzahl: { $size: "$spieler_details" }
    }
  },
  { $match: { spielerAnzahl: { $gt: 2 } } },
  { $sort: { spielerAnzahl: -1 } },
  {
    $project: {
      _id: 0,
      titel: 1,
      spielerAnzahl: 1,
      "spieler_details.username": 1
    }
  }
]).forEach(printjson);


// =============================================
// C) Unter-Dokumente / Arrays (20%)
// =============================================

// C1) Projektion auf eingebettetes Unter-Dokument "entwickler"

print("=== C1: Entwickler-Details (Unter-Dokument Projektion) ===");
db.spiele.find(
  {},
  {
    _id: 0,
    titel: 1,
    "entwickler.name": 1,
    "entwickler.land": 1
  }
).forEach(printjson);


// C2) Filterung nach Unter-Dokument-Feld: entwickler.land = "Japan"

print("=== C2: Spiele von japanischen Entwicklern ===");
db.spiele.find(
  { "entwickler.land": "Japan" },
  {
    _id: 0,
    titel: 1,
    "entwickler.name": 1,
    "entwickler.land": 1
  }
).forEach(printjson);


// C3) $unwind auf plattform_ids + $lookup: Jedes Spiel-Plattform-Paar als eigene Zeile

print("=== C3: Spiel-Plattform-Paare ($unwind + $lookup) ===");
db.spiele.aggregate([
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
      _id: 0,
      titel: 1,
      plattform_name: "$plattform.name",
      plattform_hersteller: "$plattform.hersteller"
    }
  }
]).forEach(printjson);
