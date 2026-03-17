# KN-M-02: Datenmodellierung für MongoDB
---
**Thema:** Videospiele & Gaming  
**Datenbank:** `gamingDB`

---

## A) Konzeptionelles Datenmodell (30%)

### Diagramm

<img width="1208" height="482" alt="Konzeptionelles Datenmodell" src="https://github.com/user-attachments/assets/f3aac717-4775-4385-be01-08e29ccfe6d5" />

### Beschreibung

Das konzeptionelle Datenmodell bildet eine Videospiel- und Gaming-Datenbank ab und besteht aus **vier Entitäten**. Das Thema eignet sich gut für eine MongoDB-Modellierung, da die Beziehungen zwischen Spielen, Spielern und Plattformen vielfältig und flexibel sind.

### Entitäten

#### Entwickler

Speichert Informationen über Spieleentwickler-Studios: Name, Gründungsjahr und Land. Jeder Entwickler wird über eine eindeutige `entwickler_id` identifiziert.

| Attribut | Datentyp | Beschreibung |
|---|---|---|
| `entwickler_id` | UUID | Primärschlüssel |
| `name` | String | Name des Studios (z.B. Nintendo) |
| `gruendungsjahr` | int | Jahr der Firmengründung |
| `land` | String | Sitz des Studios (z.B. Japan) |

#### Spiel

Die zentrale Entität des Modells. Enthält Titel, Erscheinungsjahr, Preis, Genre und eine Bewertung. Jedes Spiel hat über `entwickler_id` eine Referenz auf seinen Entwickler.

| Attribut | Datentyp | Beschreibung |
|---|---|---|
| `spiel_id` | UUID | Primärschlüssel |
| `entwickler_id` | UUID (FK) | Fremdschlüssel auf Entwickler |
| `titel` | String | Name des Spiels |
| `erscheinungsjahr` | int | Jahr der Veröffentlichung |
| `preis` | float | Verkaufspreis in CHF |
| `genre` | String | Spielgenre (z.B. Action, RPG) |
| `bewertung` | float | Durchschnittsbewertung (0.0–10.0) |

#### Spieler

Enthält Username, E-Mail und Registrierungsdatum der Spieler, identifiziert durch `spieler_id`.

| Attribut | Datentyp | Beschreibung |
|---|---|---|
| `spieler_id` | UUID | Primärschlüssel |
| `username` | String | Einzigartiger Benutzername |
| `email` | String | E-Mail-Adresse |
| `registrierungsdatum` | Date | Datum der Kontoerstellung |

#### Plattform

Beschreibt Gaming-Plattformen mit Name, Hersteller und Typ, identifiziert durch `plattform_id`.

| Attribut | Datentyp | Beschreibung |
|---|---|---|
| `plattform_id` | UUID | Primärschlüssel |
| `name` | String | Plattformname (z.B. PlayStation 5) |
| `hersteller` | String | Hersteller (z.B. Sony) |
| `typ` | String | Typ: Konsole, PC, Mobile, Handheld |

### Beziehungen

#### Entwickler → Spiel (1:N)

Ein Entwicklerstudio kann mehrere Spiele entwickeln, aber jedes Spiel hat genau einen Entwickler. Die Beziehung wird über den Fremdschlüssel `entwickler_id` in der Spiel-Entität abgebildet.

#### Spiel ↔ Spieler (N:M)

Ein Spiel kann von mehreren Spielern gespielt werden, und ein Spieler kann mehrere Spiele besitzen. Dies ist eine **netzwerkförmige Beziehung**.

#### Spiel ↔ Plattform (N:M)

Ein Spiel kann auf mehreren Plattformen verfügbar sein, und eine Plattform bietet mehrere Spiele an. Dies ist die zweite **netzwerkförmige Beziehung**.

---

## B) Logisches Modell für MongoDB (60%)

### Diagramm

<img width="993" height="553" alt="Logisches Datenmodell" src="https://github.com/user-attachments/assets/f8101ba9-45a5-4b6a-989a-9991404bbd29" />

### Übersicht

Das logische Modell besteht aus **3 Collections**: `spiele`, `spieler` und `plattformen`. Die Entität **Entwickler** wird nicht als eigene Collection geführt, sondern direkt in `spiele` eingebettet (Embedding).

### Collection: `spiele`

Enthält `_id` (ObjectId), `titel` (String), `erscheinungsjahr` (int), `preis` (float), `genre` (String), `bewertung` (float), sowie Arrays mit `spieler_ids` und `plattform_ids` (jeweils `Array<ObjectId>`) für die N:M-Referenzen. Der Entwickler ist als **Subdokument** eingebettet mit `_id`, `name`, `gruendungsjahr` und `land`.

```json
{
  "_id": "ObjectId",
  "titel": "String",
  "erscheinungsjahr": "int",
  "preis": "float",
  "genre": "String",
  "bewertung": "float",
  "spieler_ids": ["ObjectId", "ObjectId"],
  "plattform_ids": ["ObjectId", "ObjectId"],
  "entwickler": {
    "_id": "ObjectId",
    "name": "String",
    "gruendungsjahr": "int",
    "land": "String"
  }
}
```

### Collection: `spieler`

Enthält `_id` (ObjectId), `username` (String), `email` (String), `registrierungsdatum` (Date) und `spiel_ids` (`Array<ObjectId>`) als Rückreferenz auf Spiele.

```json
{
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "registrierungsdatum": "Date",
  "spiel_ids": ["ObjectId", "ObjectId"]
}
```

### Collection: `plattformen`

Enthält `_id` (ObjectId), `name` (String), `hersteller` (String), `typ` (String) und `spiel_ids` (`Array<ObjectId>`) als Rückreferenz auf Spiele.

```json
{
  "_id": "ObjectId",
  "name": "String",
  "hersteller": "String",
  "typ": "String",
  "spiel_ids": ["ObjectId", "ObjectId"]
}
```

### Verwendete Datentypen

| Datentyp | Verwendung |
|---|---|
| `String` | titel, genre, username, email, name, hersteller, typ, land |
| `int` | erscheinungsjahr, gruendungsjahr |
| `float` | preis, bewertung |
| `Date` | registrierungsdatum |
| `ObjectId` | _id, spieler_ids, plattform_ids, spiel_ids |

### Erklärung zur Verschachtelung

#### Warum Embedding für Entwickler?

Der Entwickler wird in `spiele` eingebettet (Embedding), weil jedes Spiel genau **einen** Entwickler hat (1:N-Beziehung) und sich Entwickler-Daten wie Name, Gründungsjahr und Land **selten ändern**. Beim Abfragen eines Spiels möchte man den Entwickler direkt mitsehen, ohne einen zweiten Lookup auf eine separate Collection machen zu müssen. **Embedding optimiert hier die Lesezugriffe.**

#### Alternative: Referencing

Die Alternative wäre Referencing — also eine eigene `entwickler`-Collection mit Verweis über eine `entwickler_id`. Das wäre sinnvoll, wenn Entwickler-Daten häufig aktualisiert würden oder wenn man oft alle Spiele eines Entwicklers sucht. Da Entwickler-Daten aber stabil sind und der häufigste Zugriff „zeig mir ein Spiel mit allen Details" ist, wurde **Embedding** gewählt.

#### N:M-Beziehungen mit Referencing

Für die N:M-Beziehungen (Spiel ↔ Spieler, Spiel ↔ Plattform) wird **Referencing mit bidirektionalen ObjectId-Arrays** verwendet. Embedding wäre hier problematisch, da ein Spieler viele Spiele besitzen kann und die Daten bei Änderungen an mehreren Stellen aktualisiert werden müssten (Inkonsistenzgefahr). Bidirektionale Referenzen ermöglichen effiziente Abfragen von beiden Seiten:

- „Welche Spieler besitzen Spiel X?"
- „Welche Spiele besitzt Spieler Y?"

---

## C) Anwendung des Schemas in MongoDB (10%)

Die Datenbank `gamingDB` wird erstellt und die drei Collections werden angelegt.

### Script: `create_collections.js`

**Schritt 1:** Zuerst wird separat der Befehl ausgeführt:

```javascript
use gamingDB;
```

**Schritt 2:** Danach wird das Script ausgeführt, welches die Collections erstellt:

```javascript
// KN-M-02 Teil C: Collections erstellen
// Thema: Videospiele & Gaming
// WICHTIG: Zuerst separat ausfuehren: use gamingDB;

db.createCollection("spiele");
db.createCollection("spieler");
db.createCollection("plattformen");

db.getCollectionNames();
```

### Erwartete Ausgabe

Nach der Ausführung zeigt `db.getCollectionNames()` folgendes Ergebnis:

```
[ "plattformen", "spiele", "spieler" ]
```

### Screenshot: Collections erstellt

<img width="229" height="131" alt="Collections erstellt" src="https://github.com/user-attachments/assets/8b80ba9b-c33d-4ae1-b38a-31e53891b413" />

---

## Abgabe-Dateien

| Datei | Teil | Beschreibung |
|---|---|---|
| `konzeptionelles_datenmodell.drawio` | A | Draw.io-Diagramm des konzeptionellen Modells |
| `logisches_datenmodell_mongodb.drawio` | B | Draw.io-Diagramm des logischen MongoDB-Modells |
| `create_collections.js` | C | Script zur Erstellung der Collections |
| `README.md` | A+B+C | Diese Dokumentation |
