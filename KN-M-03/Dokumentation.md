# KN-M-03: Datenmanipulation und Abfragen I

**Thema:** Videospiele & Gaming  
**Datenbank:** `gamingDB`

---

## A) Daten hinzufügen (25%)

### Script: [`insert_data.js`](Dateien/insert_data.js)

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

## B) Daten löschen (25%)

### Script 1: [`drop_collections.js`](Dateien/drop_collections.js)

Löscht alle Collections mit `collection.drop()`. Dient als Aufräum-Script, um danach mit einer leeren Datenbank neu starten zu können.

```javascript
db.spiele.drop();
db.spieler.drop();
db.plattformen.drop();
```

<img width="831" height="128" alt="drop_collections Ausführung" src="https://github.com/user-attachments/assets/b103aee2-3212-4226-9989-a508bd179dfc" />

### Script 2: [`delete_data.js`](Dateien/delete_data.js)

Löscht einzelne Datensätze aus der Collection `spiele`:

| Befehl | Was wird gelöscht | Filter |
|---|---|---|
| `deleteOne()` | FIFA 24 | `_id` des Spiels |
| `deleteMany()` | Zelda und Cyberpunk | `$or` mit zwei `_id`-Werten |

Nach dem Löschen bleiben **Elden Ring** und **Minecraft** übrig — es werden also nicht alle Datensätze gelöscht.

<img width="975" height="782" alt="delete_data Ausführung 1" src="https://github.com/user-attachments/assets/1ee5b4aa-07a0-464e-b6bd-0fae55d4d186" />

<img width="1495" height="748" alt="delete_data Ausführung 2" src="https://github.com/user-attachments/assets/95a4baa1-3046-44b8-ad7c-006b177b5bef" />

---

## C) Daten abfragen (25%)

### Script: [`query_data.js`](Dateien/query_data.js)

Führt verschiedene `find()`-Abfragen auf allen drei Collections aus:

| # | Collection | Was | Technik |
|---|---|---|---|
| 1 | `spiele` | Action-RPGs mit Bewertung > 8.0 | **UND-Verknüpfung** (`$and`), Projektion **mit** `_id` |
| 2 | `spieler` | ShadowNinja oder SwissGamer | **ODER-Verknüpfung** (`$or`), Projektion **ohne** `_id` |
| 3 | `plattformen` | Name enthält "Station" | **Regex** (`$regex`) |
| 4 | `spieler` | Registriert nach 01.01.2023 | **DateTime-Filterung** (`$gt` auf Date) |
| 5 | `spiele` | Titel enthält "Ring" oder "craft" | **Regex** (`$regex`) |

<img width="679" height="816" alt="query_data Ausführung" src="https://github.com/user-attachments/assets/34ee43aa-df20-401f-8246-52ada3824868" />

---

## D) Daten verändern (25%)

### Script: [`update_data.js`](Dateien/update_data.js)

Jeder Befehl wird auf einer **anderen Collection** ausgeführt:

| # | Collection | Befehl | Was passiert | Filter |
|---|---|---|---|---|
| 1 | `spiele` | `updateOne()` | Minecraft Preis → 19.90, Bewertung → 9.2 | `_id` |
| 2 | `spieler` | `updateMany()` | NoobMaster + TurboGamer99 → `aktiv: false` | `$or` auf `username` |
| 3 | `plattformen` | `replaceOne()` | Nintendo Switch → Nintendo Switch 2 | `_id` |

<img width="716" height="834" alt="update_data Ausführung" src="https://github.com/user-attachments/assets/84290f30-8332-4146-ba66-ae79b55bd46d" />

---

## Abgabe-Dateien

| Datei | Teil | Beschreibung |
|---|---|---|
| [`insert_data.js`](Dateien/insert_data.js) | A | Daten einfügen (insertOne + insertMany) |
| [`drop_collections.js`](Dateien/drop_collections.js) | B | Alle Collections löschen |
| [`delete_data.js`](Dateien/delete_data.js) | B | Einzelne Datensätze löschen (deleteOne + deleteMany) |
| [`query_data.js`](Dateien/query_data.js) | C | Abfragen (find mit Filtern, Regex, Projektionen) |
| [`update_data.js`](Dateien/update_data.js) | D | Daten ändern (updateOne, updateMany, replaceOne) |
