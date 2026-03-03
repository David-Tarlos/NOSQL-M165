# KN-M-01: Installation und Verwaltung von MongoDB

---

## A) Installation (30%)

### 1. Cloud-Init Datei

Die Cloud-Init Datei befindet sich im selben Ordner wie diese Dokumentation.

➡️ [Cloud-Init.md](./Cloud-Init.md)

---

### 2. Compass – Bestehende Datenbanken

<img width="378" height="520" alt="MongoDB Compass - Datenbankliste" src="https://github.com/user-attachments/assets/3c601022-d906-409e-9ff6-fb50a05be87e" />

---

### 3. `authSource=admin` erklärt

Der Parameter `authSource=admin` teilt MongoDB mit, **in welcher Datenbank der Benutzer gespeichert ist** und dort authentifiziert werden soll.

**Warum ist `admin` korrekt?**

Im Cloud-Init wurde der Benutzer mit `use admin` erstellt – er ist also in der `admin`-Datenbank gespeichert:

```javascript
use admin;
db.createUser({
  user: "admin",
  pwd: "MyPassword.45",
  roles: [...]
});
```

MongoDB speichert Benutzer in der Collection `system.users` der jeweiligen Datenbank. Da unser Benutzer in `admin` erstellt wurde, muss `authSource=admin` angegeben werden – sonst findet MongoDB den Benutzer nicht und verweigert die Verbindung.

---

### 4. Die beiden `sed`-Befehle erklärt

`sed` (Stream Editor) ist ein Linux-Tool zum automatischen Suchen und Ersetzen von Text in Dateien.

**Befehl 1 – BindIP ändern:**
```bash
sudo sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mongod.conf
```
Ersetzt `127.0.0.1` mit `0.0.0.0`. Ohne diese Änderung akzeptiert MongoDB nur lokale Verbindungen – Compass von einem externen PC würde nicht funktionieren.

**Befehl 2 – Authentifizierung aktivieren:**
```bash
sudo sed -i 's/#security:/security:\n  authorization: enabled/g' /etc/mongod.conf
```
Aktiviert die Authentifizierung. Ohne diese Änderung kann jeder ohne Login auf die Datenbank zugreifen.

**Warum sind diese Befehle notwendig?**
MongoDB wird aus Sicherheitsgründen mit restriktiven Standardeinstellungen installiert. `sed` automatisiert die notwendigen Anpassungen, damit wir die Datenbank von aussen erreichen und sicher mit Passwort nutzen können.

---

### 5. MongoDB Konfigurationsdatei

**BindIP (0.0.0.0 sichtbar):**

<img width="808" height="71" alt="MongoDB Config - bindIp" src="https://github.com/user-attachments/assets/6ce903d1-263d-44e3-882b-46a5f7772053" />

**Security / Authorization (enabled sichtbar):**

<img width="838" height="75" alt="MongoDB Config - security" src="https://github.com/user-attachments/assets/2b1de31b-10d4-49d6-996d-31d82d57e70c" />

---

## B) Erste Schritte GUI (30%)

### 1. Dokument vor dem Einfügen

<img width="841" height="145" alt="Dokument vor dem Einfügen" src="https://github.com/user-attachments/assets/ab287e17-6ad9-40c2-8396-6e870d965231" />

---

### 2. Dokument nach Anpassung des Datentyps

<img width="864" height="397" alt="Compass nach Datumänderung" src="https://github.com/user-attachments/assets/8248997d-e452-43b7-b574-b73e743412b9" />

---

### 3. Export-Datei & Erklärung

<img width="465" height="296" alt="Export JSON" src="https://github.com/user-attachments/assets/f65bc34b-4452-475b-b9ad-d31a28cdffc5" />

**Erklärung:**

JSON kennt keinen eigenen Datum-Datentyp. Gibt man `"2008-04-22"` ein, wird es automatisch als **String** gespeichert – nicht als echtes Datum.

Um ein Datum direkt korrekt einzufügen, hätte man das BSON-Format `$date` verwenden müssen:

```json
{ "Geburtsdatum": { "$date": "2008-04-22T00:00:00.000Z" } }
```

MongoDB versteht `$date` als echten Datum-Datentyp (BSON) und speichert es korrekt.

**Implikationen auf andere Datentypen:**
Dasselbe Problem betrifft auch andere Typen. Zum Beispiel wird `"200"` (mit Anführungszeichen) als String gespeichert statt als Integer `200`. Das kann bei Berechnungen oder Abfragen zu falschen Resultaten führen.

**Warum dieser komplizierte Weg?**
JSON ist ein simples Format mit nur wenigen Grundtypen (String, Number, Boolean, Array, Object, null). MongoDB erweitert JSON intern mit BSON, um zusätzliche Typen wie `Date`, `Int32` oder `ObjectId` zu unterstützen – diese müssen jedoch explizit angegeben werden.

---

## C) Erste Schritte Shell (10%)

### Screenshot Compass Shell

<img width="579" height="693" alt="Compass Shell Befehle" src="https://github.com/user-attachments/assets/b1c38ad3-7c7a-4d8f-a002-633d105c5f01" />

---

### Screenshot MongoDB Shell (Linux-Server)

<img width="633" height="373" alt="Linux Server Shell Befehle" src="https://github.com/user-attachments/assets/7520478f-037e-4456-9ca3-2297ddf78ced" />

---

### Was machen die Befehle 1–5?

| Befehl | Funktion |
|---|---|
| `show dbs` | Zeigt alle Datenbanken mit Grösse an |
| `show databases` | Identisch mit `show dbs` |
| `use Tarlos` | Wechselt in die Datenbank `Tarlos` |
| `show collections` | Zeigt alle Collections der aktuellen Datenbank |
| `show tables` | Identisch mit `show collections` (SQL-Alias) |

### Unterschied: Collections vs. Tables

**Tables** (SQL) – Daten sind in festen Zeilen und Spalten gespeichert. Jede Zeile hat dieselbe Struktur (strenges Schema).

**Collections** (MongoDB/NoSQL) – Speichern flexible JSON-Dokumente ohne festes Schema. Dokumente in derselben Collection können unterschiedliche Felder haben.

`show tables` existiert in MongoDB nur als Alias für Benutzer, die SQL gewohnt sind.

---

## D) Rechte und Rollen (30%)

### 1. Fehler bei falscher `authSource`

<img width="1266" height="957" alt="Fehler falsche authSource" src="https://github.com/user-attachments/assets/cdefac1d-11b5-4520-93f7-2442c6a37cf5" />

---

### 2. Skript zur Benutzererstellung

```javascript
// Benutzer 1: leser – nur Lesen, gespeichert in Tarlos
use Tarlos
db.createUser({
  user: "leser",
  pwd: "leser123",
  roles: [{ role: "read", db: "Tarlos" }]
})

// Benutzer 2: schreiber – Lesen & Schreiben, gespeichert in admin
use admin
db.createUser({
  user: "schreiber",
  pwd: "schreiber123",
  roles: [{ role: "readWrite", db: "Tarlos" }]
})
```

<img width="490" height="180" alt="Benutzer 1 erstellt" src="https://github.com/user-attachments/assets/ffc0e105-4307-4ec8-8561-391ffa99d5e4" />

<img width="519" height="212" alt="Benutzer 2 erstellt" src="https://github.com/user-attachments/assets/062be834-3bf6-45cf-aadd-1f7ca8b44193" />

---

### 3. Benutzer 1 – Nur Lesen (`leser`)

**Login** (`authSource=Tarlos`):

<img width="1167" height="417" alt="Leser Login" src="https://github.com/user-attachments/assets/39a69449-f76c-4147-8a52-093cadeb97f4" />

**Lesen funktioniert:**

<img width="556" height="214" alt="Leser find() erfolgreich" src="https://github.com/user-attachments/assets/7990950e-ae54-42e7-a38a-495dd2de9277" />

**Schreiben gibt Fehler:**

<img width="841" height="145" alt="Leser insertOne() Fehler" src="https://github.com/user-attachments/assets/3e2087c4-c3a9-446d-bc46-285e5809e4ef" />

---

### 4. Benutzer 2 – Lesen & Schreiben (`schreiber`)

**Login** (`authSource=admin`):

<img width="1156" height="414" alt="Schreiber Login" src="https://github.com/user-attachments/assets/42a4db9a-8b29-44e1-bdee-05b5f333761a" />

**Lesen funktioniert** ✅

**Schreiben funktioniert:**

<img width="542" height="442" alt="Schreiber insertOne() erfolgreich" src="https://github.com/user-attachments/assets/91d6734e-7031-4ea4-a91a-25e1bffa9f28" />
