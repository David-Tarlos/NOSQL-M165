# NOSQL-M165

# KN-M-03: Datenmanipulation und Abfragen I

**Thema:** Videospiele & Gaming  
**Datenbank:** `gamingDB`

---

## A) Daten hinzufügen (25%)

### Script

[insert_data.js](Dateien/insert_data.js)

Das Script fügt Testdaten in alle drei Collections ein:

| Collection | Anzahl | Methode |
|---|---|---|
| `spieler` | 5 Datensätze | `insertMany()` |
| `plattformen` | 4 Datensätze | `insertMany()` |
| `spiele` | 5 Datensätze | `insertOne()` (pro Spiel) |

Alle `_id`-Felder werden über Variablen mit `new ObjectId()` gesetzt — keine hartcodierten Werte. Die Rückreferenzen (`spiel_ids` in spieler/plattformen) werden am Ende des Scripts aktualisiert.

### Screenshots

Ausführung des Scripts — Anfang (insertMany für Spieler und Plattformen, insertOne für Spiele):

<img width="595" height="530" alt="insert_data Anfang" src="https://github.com/user-attachments/assets/1834cb7b-29e1-4338-8126-cfe0f06b644d" />

Ausführung des Scripts — Ende (alle Datensätze erfolgreich eingefügt):

<img width="451" height="709" alt="insert_data Ende" src="https://github.com/user-attachments/assets/19242b10-2779-40e0-9ac2-a2b9f22b102e" />

---




B) Daten löschen (25%)

C) Daten abfragen (25%)

D) Daten verändern (25%)
