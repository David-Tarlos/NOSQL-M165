// KN-M-03 Teil D: Daten veraendern
// WICHTIG: Zuerst separat ausfuehren: use gamingDB;
// WICHTIG: Zuerst drop_collections.js, dann create_collections.js, dann insert_data.js ausfuehren.

// =============================================
// 1) updateOne auf Collection "spiele"
//    Preis von Minecraft auf 19.90 aendern (mit _id)
// =============================================

var minecraft = db.spiele.findOne({ titel: "Minecraft" });

print("=== updateOne: Minecraft Preis aendern ===");
print("Vorher:");
printjson(db.spiele.findOne({ _id: minecraft._id }, { titel: 1, preis: 1 }));

db.spiele.updateOne(
  { _id: minecraft._id },
  { $set: { preis: 19.90, bewertung: 9.2 } }
);

print("Nachher:");
printjson(db.spiele.findOne({ _id: minecraft._id }, { titel: 1, preis: 1, bewertung: 1 }));

// =============================================
// 2) updateMany auf Collection "spieler"
//    Alle Spieler mit Username "NoobMaster" ODER "TurboGamer99"
//    bekommen ein neues Feld "aktiv: false"
//    (ODER-Verknuepfung, ohne _id, aendert mehr als 1 Datensatz)
// =============================================

print("=== updateMany: NoobMaster und TurboGamer99 auf inaktiv setzen ===");

db.spieler.updateMany(
  {
    $or: [
      { username: "NoobMaster" },
      { username: "TurboGamer99" }
    ]
  },
  { $set: { aktiv: false } }
);

print("Ergebnis:");
db.spieler.find(
  { aktiv: false },
  { _id: 0, username: 1, aktiv: 1 }
).forEach(printjson);

// =============================================
// 3) replaceOne auf Collection "plattformen"
//    Nintendo Switch komplett ersetzen (neue Generation)
// =============================================

var nintendoSwitch = db.plattformen.findOne({ name: "Nintendo Switch" });

print("=== replaceOne: Nintendo Switch durch Switch 2 ersetzen ===");
print("Vorher:");
printjson(db.plattformen.findOne({ _id: nintendoSwitch._id }));

db.plattformen.replaceOne(
  { _id: nintendoSwitch._id },
  {
    _id: nintendoSwitch._id,
    name: "Nintendo Switch 2",
    hersteller: "Nintendo",
    typ: "Handheld",
    spiel_ids: nintendoSwitch.spiel_ids
  }
);

print("Nachher:");
printjson(db.plattformen.findOne({ _id: nintendoSwitch._id }));
