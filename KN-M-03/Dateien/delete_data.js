// KN-M-03 Teil B: Einzelne Datensaetze loeschen
// WICHTIG: Zuerst separat ausfuehren: use gamingDB;
// WICHTIG: Zuerst insert_data.js ausfuehren, damit Daten vorhanden sind.

// =============================================
// Vorher: IDs der zu loeschenden Datensaetze holen
// =============================================

var fifaSpiel = db.spiele.findOne({ titel: "FIFA 24" });
var zelda = db.spiele.findOne({ titel: "The Legend of Zelda: Tears of the Kingdom" });
var cyberpunk = db.spiele.findOne({ titel: "Cyberpunk 2077" });

// =============================================
// 1) deleteOne: Ein einzelnes Spiel loeschen (mit _id)
// =============================================

print("=== deleteOne: FIFA 24 loeschen ===");
db.spiele.deleteOne({ _id: fifaSpiel._id });
print("Geloescht. Verbleibende Spiele:");
db.spiele.find({}, { titel: 1 }).forEach(printjson);

// =============================================
// 2) deleteMany: Mehrere Spiele loeschen (ODER-Verknuepfung auf _id)
//    Loescht Zelda und Cyberpunk, aber NICHT Elden Ring und Minecraft
// =============================================

print("=== deleteMany: Zelda und Cyberpunk loeschen ===");
db.spiele.deleteMany({
  $or: [
    { _id: zelda._id },
    { _id: cyberpunk._id }
  ]
});
print("Geloescht. Verbleibende Spiele:");
db.spiele.find({}, { titel: 1 }).forEach(printjson);
