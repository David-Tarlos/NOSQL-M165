// KN-M-03 Teil B: Alle Collections loeschen (Aufraeum-Skript)
// WICHTIG: Zuerst separat ausfuehren: use gamingDB;

db.spiele.drop();
db.spieler.drop();
db.plattformen.drop();

print("Alle Collections geloescht.");
db.getCollectionNames();
