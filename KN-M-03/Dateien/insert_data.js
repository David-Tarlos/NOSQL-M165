// KN-M-03 Teil A: Daten hinzufuegen
// WICHTIG: Zuerst separat ausfuehren: use gamingDB;
// Danach: Zuerst create_collections.js ausfuehren, falls Collections noch nicht existieren.

// =============================================
// 1) SPIELER einfuegen (insertMany)
// =============================================

var spieler1_id = new ObjectId();
var spieler2_id = new ObjectId();
var spieler3_id = new ObjectId();
var spieler4_id = new ObjectId();
var spieler5_id = new ObjectId();

db.spieler.insertMany([
  {
    _id: spieler1_id,
    username: "ShadowNinja",
    email: "shadow.ninja@gmail.com",
    registrierungsdatum: new Date("2022-03-15"),
    spiel_ids: []
  },
  {
    _id: spieler2_id,
    username: "PixelQueen",
    email: "pixel.queen@outlook.com",
    registrierungsdatum: new Date("2023-07-22"),
    spiel_ids: []
  },
  {
    _id: spieler3_id,
    username: "TurboGamer99",
    email: "turbo.gamer@yahoo.com",
    registrierungsdatum: new Date("2021-11-05"),
    spiel_ids: []
  },
  {
    _id: spieler4_id,
    username: "NoobMaster",
    email: "noob.master@gmail.com",
    registrierungsdatum: new Date("2024-01-10"),
    spiel_ids: []
  },
  {
    _id: spieler5_id,
    username: "SwissGamer",
    email: "swiss.gamer@bluewin.ch",
    registrierungsdatum: new Date("2020-06-30"),
    spiel_ids: []
  }
]);

// 2) PLATTFORMEN einfuegen (insertMany)

var plattform1_id = new ObjectId();
var plattform2_id = new ObjectId();
var plattform3_id = new ObjectId();
var plattform4_id = new ObjectId();

db.plattformen.insertMany([
  {
    _id: plattform1_id,
    name: "PlayStation 5",
    hersteller: "Sony",
    typ: "Konsole",
    spiel_ids: []
  },
  {
    _id: plattform2_id,
    name: "Nintendo Switch",
    hersteller: "Nintendo",
    typ: "Handheld",
    spiel_ids: []
  },
  {
    _id: plattform3_id,
    name: "Steam (PC)",
    hersteller: "Valve",
    typ: "PC",
    spiel_ids: []
  },
  {
    _id: plattform4_id,
    name: "Xbox Series X",
    hersteller: "Microsoft",
    typ: "Konsole",
    spiel_ids: []
  }
]);


// 3) SPIELE einfuegen (insertOne pro Spiel)

var spiel1_id = new ObjectId();
db.spiele.insertOne({
  _id: spiel1_id,
  titel: "The Legend of Zelda: Tears of the Kingdom",
  erscheinungsjahr: 2023,
  preis: 69.90,
  genre: "Action-Adventure",
  bewertung: 9.5,
  spieler_ids: [spieler1_id, spieler2_id, spieler5_id],
  plattform_ids: [plattform2_id],
  entwickler: {
    _id: new ObjectId(),
    name: "Nintendo EPD",
    gruendungsjahr: 2015,
    land: "Japan"
  }
});

var spiel2_id = new ObjectId();
db.spiele.insertOne({
  _id: spiel2_id,
  titel: "Elden Ring",
  erscheinungsjahr: 2022,
  preis: 59.90,
  genre: "Action-RPG",
  bewertung: 9.8,
  spieler_ids: [spieler1_id, spieler3_id, spieler4_id],
  plattform_ids: [plattform1_id, plattform3_id, plattform4_id],
  entwickler: {
    _id: new ObjectId(),
    name: "FromSoftware",
    gruendungsjahr: 1986,
    land: "Japan"
  }
});

var spiel3_id = new ObjectId();
db.spiele.insertOne({
  _id: spiel3_id,
  titel: "FIFA 24",
  erscheinungsjahr: 2023,
  preis: 79.90,
  genre: "Sport",
  bewertung: 6.5,
  spieler_ids: [spieler2_id, spieler4_id],
  plattform_ids: [plattform1_id, plattform3_id, plattform4_id],
  entwickler: {
    _id: new ObjectId(),
    name: "EA Sports",
    gruendungsjahr: 1991,
    land: "USA"
  }
});

var spiel4_id = new ObjectId();
db.spiele.insertOne({
  _id: spiel4_id,
  titel: "Minecraft",
  erscheinungsjahr: 2011,
  preis: 29.90,
  genre: "Sandbox",
  bewertung: 9.0,
  spieler_ids: [spieler1_id, spieler2_id, spieler3_id, spieler4_id, spieler5_id],
  plattform_ids: [plattform1_id, plattform2_id, plattform3_id, plattform4_id],
  entwickler: {
    _id: new ObjectId(),
    name: "Mojang Studios",
    gruendungsjahr: 2009,
    land: "Schweden"
  }
});

var spiel5_id = new ObjectId();
db.spiele.insertOne({
  _id: spiel5_id,
  titel: "Cyberpunk 2077",
  erscheinungsjahr: 2020,
  preis: 49.90,
  genre: "Action-RPG",
  bewertung: 7.5,
  spieler_ids: [spieler3_id, spieler5_id],
  plattform_ids: [plattform1_id, plattform3_id],
  entwickler: {
    _id: new ObjectId(),
    name: "CD Projekt Red",
    gruendungsjahr: 2002,
    land: "Polen"
  }
});


// 4) Rueckreferenzen in spieler aktualisieren


db.spieler.updateOne({ _id: spieler1_id }, { $set: { spiel_ids: [spiel1_id, spiel2_id, spiel4_id] } });
db.spieler.updateOne({ _id: spieler2_id }, { $set: { spiel_ids: [spiel1_id, spiel3_id, spiel4_id] } });
db.spieler.updateOne({ _id: spieler3_id }, { $set: { spiel_ids: [spiel2_id, spiel4_id, spiel5_id] } });
db.spieler.updateOne({ _id: spieler4_id }, { $set: { spiel_ids: [spiel2_id, spiel3_id, spiel4_id] } });
db.spieler.updateOne({ _id: spieler5_id }, { $set: { spiel_ids: [spiel1_id, spiel4_id, spiel5_id] } });


// 5) Rüeckreferenzen in plattformen aktualisieren


db.plattformen.updateOne({ _id: plattform1_id }, { $set: { spiel_ids: [spiel2_id, spiel3_id, spiel4_id, spiel5_id] } });
db.plattformen.updateOne({ _id: plattform2_id }, { $set: { spiel_ids: [spiel1_id, spiel4_id] } });
db.plattformen.updateOne({ _id: plattform3_id }, { $set: { spiel_ids: [spiel2_id, spiel3_id, spiel4_id, spiel5_id] } });
db.plattformen.updateOne({ _id: plattform4_id }, { $set: { spiel_ids: [spiel2_id, spiel3_id, spiel4_id] } });

// =============================================
// Kontrolle
// =============================================

print("=== SPIELE ===");
db.spiele.find().forEach(printjson);

print("=== SPIELER ===");
db.spieler.find().forEach(printjson);

print("=== PLATTFORMEN ===");
db.plattformen.find().forEach(printjson);
