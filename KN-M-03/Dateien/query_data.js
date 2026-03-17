
// 1) Abfrage auf Collection "spiele"
//    UND-Verknuepfung: Genre ist "Action-RPG" UND Bewertung groesser als 8.0
//    Projektion: _id wird MIT ausgegeben


print("=== Spiele: Action-RPG mit Bewertung > 8.0 (mit _id) ===");
db.spiele.find(
  {
    $and: [
      { genre: "Action-RPG" },
      { bewertung: { $gt: 8.0 } }
    ]
  },
  {
    _id: 1,
    titel: 1,
    genre: 1,
    bewertung: 1
  }
).forEach(printjson);


// 2) Abfrage auf Collection "spieler"
//    ODER-Verknuepfung: Username ist "ShadowNinja" ODER "SwissGamer"
//    Projektion: _id wird NICHT ausgegeben


print("=== Spieler: ShadowNinja oder SwissGamer (ohne _id) ===");
db.spieler.find(
  {
    $or: [
      { username: "ShadowNinja" },
      { username: "SwissGamer" }
    ]
  },
  {
    _id: 0,
    username: 1,
    email: 1,
    registrierungsdatum: 1
  }
).forEach(printjson);


// 3) Abfrage auf Collection "plattformen"
//    Regex: Alle Plattformen deren Name "Station" enthaelt


print("=== Plattformen: Name enthaelt 'Station' (Regex) ===");
db.plattformen.find(
  {
    name: { $regex: /Station/i }
  },
  {
    _id: 0,
    name: 1,
    hersteller: 1,
    typ: 1
  }
).forEach(printjson);


// 4) Abfrage auf Collection "spieler"
//    DateTime-Filterung: Alle Spieler die sich nach dem 01.01.2023 registriert haben


print("=== Spieler: Registriert nach 01.01.2023 ===");
db.spieler.find(
  {
    registrierungsdatum: { $gt: new Date("2023-01-01") }
  },
  {
    _id: 0,
    username: 1,
    registrierungsdatum: 1
  }
).forEach(printjson);


// 5) Abfrage auf Collection "spiele"
//    Regex: Alle Spiele deren Titel "Ring" oder "craft" enthaelt


print("=== Spiele: Titel enthaelt 'Ring' oder 'craft' ===");
db.spiele.find(
  {
    titel: { $regex: /Ring|craft/i }
  },
  {
    _id: 1,
    titel: 1,
    bewertung: 1
  }
).forEach(printjson);
