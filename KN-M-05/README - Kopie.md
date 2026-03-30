# KN-M-05: Administration von MongoDB

---

## A) Rechte und Rollen (40%)

### Falscher authSource

Wenn man im Verbindungsstring eine andere `authSource` als `admin` angibt (z.B. `gamingDB`), schlägt die Authentifizierung fehl, da der Benutzer `admin` in der Datenbank `admin` gespeichert ist und nicht in `gamingDB`.

**Screenshot: Fehler bei falscher Authentifizierungsquelle**

![Screenshot Fehler authSource](https://github.com/user-attachments/assets/d5274ef7-0eed-4661-b1c2-e566f0eb797e)

---

### Skript: Benutzer erstellen

**Benutzer 1 – Leser (nur Lesen, authSource = gamingDB):**

```js
use gamingDB
db.createUser({
    user: "leser",
    pwd: "12345",
    roles: [{ role: "read", db: "gamingDB" }]
})
```

**Benutzer 2 – Schreiber (Lesen & Schreiben, authSource = admin):**

```js
use admin
db.createUser({
    user: "schreiber",
    pwd: "12345",
    roles: [{ role: "readWrite", db: "gamingDB" }]
})
```

---

### Benutzer 1 testen (leser – nur read)

**Screenshot 1: Einloggen (Verbindungsstring sichtbar)**

![Leser Login](https://github.com/user-attachments/assets/12c831d7-87d0-4289-ad18-0e3240e19df1)

**Screenshot 2: Lesen von Daten ohne Fehler**

![Leser Lesen](https://github.com/user-attachments/assets/cc2defb4-8a6a-46ba-b35b-a1de8c160efa)

**Screenshot 3: Schreiben von Daten mit Fehler**

![Leser Schreiben Fehler](https://github.com/user-attachments/assets/171be56c-d46c-4015-8e6d-f51d5afb9130)

> Der Benutzer `leser` hat nur die Rolle `read` und darf daher keine Daten schreiben. Der `insertOne`-Befehl wird mit einem Fehler abgelehnt.

---

### Benutzer 2 testen (schreiber – readWrite)

**Screenshot 1: Einloggen (Verbindungsstring sichtbar)**

![Schreiber Login](https://github.com/user-attachments/assets/ba3b2504-9c57-4db7-86ba-917c7e3d924a)

**Screenshot 2: Lesen von Daten ohne Fehler**

![Schreiber Lesen](https://github.com/user-attachments/assets/62a26f2a-fa3e-470f-9291-1a8b4fa4cf05)

**Screenshot 3: Schreiben von Daten ohne Fehler**

![Schreiber Schreiben](https://github.com/user-attachments/assets/b64d3d16-2c1a-4fd5-b294-ffdd01e0cf86)

> Der Benutzer `schreiber` hat die Rolle `readWrite` und darf sowohl lesen als auch schreiben. Beide Operationen funktionieren ohne Fehler.

---

## B) Backup und Restore (40%)

### Variante 1: AWS Snapshot

#### Schritt 1: Ausgangslage – Daten vorhanden

Zwei Collections mit Daten in der `gamingDB`:

**Collection: plattformen**

![Plattformen](https://github.com/user-attachments/assets/a42f1a21-ced8-4c10-ab89-1ee111093a67)

**Collection: spieler**

![Spieler](https://github.com/user-attachments/assets/19775793-7031-48d7-8b57-e637ac98ce10)

#### Schritt 2: Snapshot erstellen

![Snapshot completed](https://github.com/user-attachments/assets/5b96baff-5ed7-48fe-8ad0-26d385ac6c5c)

#### Schritt 3: Collection löschen

**Befehl:**

```js
use gamingDB
db.plattformen.drop()
```

**Vorher:**

![DB vorher](https://github.com/user-attachments/assets/bc7209cb-8b84-47cc-add5-fa42dc65212d)

**Nachher (plattformen gelöscht):**

![DB nachher](https://github.com/user-attachments/assets/0c945bf3-bece-4fdc-a957-6ad395ddeaa3)

#### Schritt 4: Volume aus Snapshot wiederherstellen

Neues Volume wurde aus dem Snapshot erstellt (gleiche Availability Zone: `us-east-1a`):

![Volume aus Snapshot](https://github.com/user-attachments/assets/58576485-ba63-4f7e-a6ea-b30992e642c8)

#### Schritt 5: Volume tauschen

Altes Volume detached, neues Volume (aus Snapshot) attached:

![Volume tauschen](https://github.com/user-attachments/assets/149b4836-0d55-4ec1-a9e2-3903efaf8290)

> "Volume-Neu" ist das Volume, welches aus dem Snapshot erstellt wurde.

#### Schritt 6: Prüfung – Daten sind wiederhergestellt

Alle Collections sind wieder vorhanden:

![Collections wiederhergestellt](https://github.com/user-attachments/assets/9c442788-f12a-4ced-bd62-7f8d24e9049f)

---

### Variante 2: mongodump / mongorestore

#### Schritt 1: Ausgangslage – Daten vorhanden

**In Compass:**

![Daten in Compass](https://github.com/user-attachments/assets/94ff633e-4352-47b9-8d65-857b55b0c789)

**Im Terminal:**

![Collections im Terminal](https://github.com/user-attachments/assets/95d2f70f-2de4-4c8b-89ee-28a1be2c83d1)

#### Schritt 2: Backup mit mongodump

**Befehl:**

```bash
mongodump --uri="mongodb://admin:12345@52.73.228.122:27017/?authSource=admin&readPreference=primary&ssl=false" --db=gamingDB --out=C:\backup
```

**Terminal-Output:**

![mongodump Output](https://github.com/user-attachments/assets/5c5c44e9-7e2f-44be-b741-5edf273abad6)

**Backup-Dateien im Ordner:**

![Backup Dateien](https://github.com/user-attachments/assets/bd9ccb44-2991-456d-bcca-e9199c5812af)

#### Schritt 3: Datenbank löschen

**Befehl:**

```js
use gamingDB
db.dropDatabase()
```

**Screenshot: Datenbank ist gelöscht**

![DB gelöscht](https://github.com/user-attachments/assets/dd840a5a-e4c3-45ec-8a34-090dfffd4249)

#### Schritt 4: Wiederherstellen mit mongorestore

**Befehl:**

```bash
mongorestore --uri="mongodb://admin:12345@52.73.228.122:27017/?authSource=admin&readPreference=primary&ssl=false" --db=gamingDB C:\backup\gamingDB
```

**Terminal-Output:**

![mongorestore Output](https://github.com/user-attachments/assets/3de34d6c-5f4b-4d71-b628-34921accb69e)

#### Schritt 5: Prüfung – Daten sind wiederhergestellt

![Daten wiederhergestellt](https://github.com/user-attachments/assets/e7e65740-9c6e-46d4-bba1-28af737b4b41)

---

## C) Skalierung (20%)

### Replication vs. Sharding

**Replication** bedeutet, dass die Daten auf mehrere Server **kopiert** werden. Jeder Server hat **alle** Daten. Wenn ein Server ausfällt, übernimmt automatisch ein anderer. Der Hauptzweck ist **Ausfallsicherheit (High Availability)**.

![Replication](https://github.com/user-attachments/assets/17c46e4c-9bd1-479d-b995-0794e351499a)

**Sharding (Partitionierung)** bedeutet, dass die Daten auf mehrere Server **aufgeteilt** werden. Jeder Server hat nur einen **Teil** der Daten. Der Hauptzweck ist **Performance und Skalierung bei grossen Datenmengen**.

![Sharding](https://github.com/user-attachments/assets/4be6065e-231e-4473-834d-3f04f55bee89)

| | Replication | Sharding |
|---|---|---|
| Daten | Gleiche Daten auf allen Servern | Daten aufgeteilt auf verschiedene Server |
| Zweck | Ausfallsicherheit | Performance bei grossen Datenmengen |
| Datenmenge pro Server | Alle Daten | Nur ein Teil |

### Empfehlung für unsere Firma

Unsere Firma betreibt eine Gaming-Applikation mit einer MongoDB-Datenbank (`gamingDB`). Aktuell läuft alles auf einem einzelnen t3.micro Server bei AWS. Die Datenbank enthält drei Collections (spiele, spieler, plattformen) mit wenigen Dokumenten. Die Nutzerzahl ist gering.

**Empfehlung: Replikation einführen, kein Sharding.**

Sharding ist für unsere Situation nicht nötig, da die Datenmenge minimal ist und ein einzelner Server die Last problemlos bewältigt. Sharding würde unnötige Komplexität und Kosten verursachen.

Eine Replikation mit einem Replica Set (1 Primary + 2 Secondaries) wäre jedoch sinnvoll, um Ausfallsicherheit zu gewährleisten. Falls der Primary-Server ausfällt, übernimmt automatisch ein Secondary und die Applikation bleibt verfügbar.

Falls die Applikation in Zukunft stark wächst (z.B. Millionen von Spielern), könnte man zu einem späteren Zeitpunkt zusätzlich Sharding einführen.

**Quellen:**

- MongoDB Dokumentation Replication: https://www.mongodb.com/docs/manual/replication/
- MongoDB Dokumentation Sharding: https://www.mongodb.com/docs/manual/sharding/
