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
Skript: welches alle Collections löscht: befindet sich im Dateien ordner und heisst: drop_collections.js, mache eine verbindung
<img width="831" height="128" alt="image" src="https://github.com/user-attachments/assets/b103aee2-3212-4226-9989-a508bd179dfc" />
load("C:/Users/david/Downloads/drop_collections.js")

bestimmte daten löschen
Skript: welches alle Dokuemnte löscht: befindet sich im Dateien ordner und heisst: delete_data.js, mache eine verbindung
<img width="975" height="782" alt="image" src="https://github.com/user-attachments/assets/1ee5b4aa-07a0-464e-b6bd-0fae55d4d186" />
<img width="1495" height="748" alt="image" src="https://github.com/user-attachments/assets/95a4baa1-3046-44b8-ad7c-006b177b5bef" />


C) Daten abfragen (25%)
Skript: welches query abfragen macht, befindet sich im Dateien ordner und heisst: query_data.js, mache eine verbindung
<img width="679" height="816" alt="image" src="https://github.com/user-attachments/assets/34ee43aa-df20-401f-8246-52ada3824868" />

D) Daten verändern (25%)
Skript: Skript: welches daten updatet/verändert, befindet sich im Dateien ordner und heisst: update_data.js, mache eine verbindung
<img width="716" height="834" alt="image" src="https://github.com/user-attachments/assets/84290f30-8332-4146-ba66-ae79b55bd46d" />

