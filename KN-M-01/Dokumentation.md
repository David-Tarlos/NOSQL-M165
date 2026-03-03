# NOSQL-M165

## Abgaben laut Anforderungen

---

### 1. Cloud-Init Datei mit geändertem Passwort

Die Cloud-Init Datei befindet sich im selben Ordner wie diese Dokumentation.

➡️ [Cloud-Init.md](./Cloud-Init.md)

---

### 2. Screenshot von Compass mit bestehenden Datenbanken

<img width="378" height="520" alt="MongoDB Compass - Datenbankliste" src="https://github.com/user-attachments/assets/3c601022-d906-409e-9ff6-fb50a05be87e" />

---

### 3. Connection String - `authSource=admin` erklärt

**Was macht `authSource=admin`?**

Der Parameter `authSource=admin` gibt MongoDB an, in welcher Datenbank nach dem Benutzer gesucht werden soll, um ihn zu authentifizieren.

**Warum ist dieser Parameter korrekt?**

Im Cloud-Init-Skript wurde der Benutzer `admin` in der Datenbank `admin` erstellt:

```javascript
use admin;              // Wechsel zur admin-Datenbank
db.createUser({
  user: "admin",        // User wird in der admin-DB gespeichert
  pwd: "MyPassword.45",
  ...
});
```

Die Benutzerinformationen (Username, Passwort-Hash, Rechte) werden in der Collection `system.users` der `admin`-Datenbank gespeichert.

**Beweis:**
```javascript
use admin
db.system.users.find()  // Zeigt den User "admin" in der admin-DB
```

Deshalb muss `authSource=admin` angegeben werden – damit MongoDB weiß, dass der User in der `admin`-Datenbank zu finden ist.

**Quelle:** [MongoDB Connection String URI Format](https://www.mongodb.com/docs/manual/reference/connection-string/)

---

### 4. Die beiden `sed`-Befehle erklärt

**Was `sed` bewirkt:**

`sed` (Stream Editor) ist ein Linux-Tool zum automatischen Suchen und Ersetzen von Text in Dateien.

**Erster `sed`-Befehl:**

Ersetzt `127.0.0.1` mit `0.0.0.0` in der MongoDB-Konfiguration, damit externe Verbindungen erlaubt werden. Ohne diese Änderung akzeptiert MongoDB nur lokale Verbindungen.

**Zweiter `sed`-Befehl:**

Ersetzt `#security:` mit `security:\n  authorization: enabled`, um die Authentifizierung zu aktivieren. Ohne diese Änderung kann jeder ohne Login auf die Datenbank zugreifen.

**Quelle:** [MongoDB Configuration Options](https://www.mongodb.com/docs/manual/reference/configuration-options/)

---

### 5. Screenshot der MongoDB-Konfigurationsdatei

**BindIP-Konfiguration:**

<img width="808" height="71" alt="MongoDB Config - bindIp" src="https://github.com/user-attachments/assets/6ce903d1-263d-44e3-882b-46a5f7772053" />

**Security-Konfiguration:**

<img width="838" height="75" alt="MongoDB Config - security" src="https://github.com/user-attachments/assets/2b1de31b-10d4-49d6-996d-31d82d57e70c" />

# C) Erste Schritte Shell (10%)

## 📸 Screenshot MongoDB Compass

Screenshot von MongoDB Compass, der zeigt, dass die Befehle ausgeführt wurden:

<img width="579" height="693" alt="Screenshot 2026-03-03 111041" src="https://github.com/user-attachments/assets/b1c38ad3-7c7a-4d8f-a002-633d105c5f01" />

---

## 📸 Screenshot MongoDB-Shell (Linux-Server)

Screenshot der MongoDB-Shell auf dem Linux-Server, der zeigt, dass die Befehle eingegeben und ausgeführt wurden:

<img width="633" height="373" alt="Screenshot 2026-03-03 114404" src="https://github.com/user-attachments/assets/7520478f-037e-4456-9ca3-2297ddf78ced" />

---

## ❓ Was machen die Befehle 1–5?

### `show dbs` / `show databases`
- Zeigt alle vorhandenen Datenbanken inklusive ihrer Grösse an.
- Beide Befehle haben die gleiche Funktion.

### `use Tarlos`
- Wechselt zur Datenbank **Tarlos**.
- Falls sie noch nicht existiert, wird sie beim ersten Einfügen von Daten automatisch erstellt.

### `show collections` / `show tables`
- Zeigt alle Collections der aktuell ausgewählten Datenbank an.
- Beide Befehle sind funktional identisch.

---

## 🔎 Unterschied: Collections vs. Tables

### Tables
- Begriff aus SQL (relationale Datenbanken)
- Daten sind in festen Zeilen und Spalten organisiert
- Strenges Schema (jede Zeile hat dieselbe Struktur)

### Collections
- Begriff aus MongoDB (NoSQL)
- Speichern flexible JSON-Dokumente
- Kein festes Schema erforderlich (Dokumente können unterschiedliche Felder haben)

> Hinweis: In MongoDB existiert `show tables` nur als Alias für Benutzer, die an SQL-Datenbanken gewöhnt sind.

# D) Rechte und Rollen (30%)

## ❌ Fehler bei falscher Authentifizierungsquelle

Screenshot des Fehlers bei einer Verbindung mit einer falschen `authSource`:

<img width="1266" height="957" alt="Screenshot 2026-03-03 131714" src="https://github.com/user-attachments/assets/cdefac1d-11b5-4520-93f7-2442c6a37cf5" />

---

## 👤 Erstellung der Benutzer

Skript zur Erstellung der beiden Benutzer mit unterschiedlichen Rollen:

<img width="490" height="180" alt="image" src="https://github.com/user-attachments/assets/ffc0e105-4307-4ec8-8561-391ffa99d5e4" />

<img width="519" height="212" alt="image" src="https://github.com/user-attachments/assets/062be834-3bf6-45cf-aadd-1f7ca8b44193" />

---

# 🔐 Benutzer 1 – Eingeschränkte Rechte (z. B. nur Lesen)

## ✅ Login erfolgreich

Screenshot des erfolgreichen Logins  
(Verbindungstext ist sichtbar):

<img width="1167" height="417" alt="image" src="https://github.com/user-attachments/assets/39a69449-f76c-4147-8a52-093cadeb97f4" />

## ✅ Lesen von Daten funktioniert

Screenshot zeigt, dass Daten ohne Fehler gelesen werden können:

<img width="556" height="214" alt="image" src="https://github.com/user-attachments/assets/7990950e-ae54-42e7-a38a-495dd2de9277" />

## ❌ Schreiben von Daten nicht erlaubt

Screenshot zeigt einen Fehler beim Versuch, Daten zu schreiben  
(keine Schreibrechte vorhanden):

<img width="841" height="145" alt="image" src="https://github.com/user-attachments/assets/3e2087c4-c3a9-446d-bc46-285e5809e4ef" />

---

# 🔓 Benutzer 2 – Erweiterte Rechte (Lesen & Schreiben)

## ✅ Login erfolgreich

Screenshot des erfolgreichen Logins  
(Verbindungstext ist sichtbar):

<img width="1156" height="414" alt="Screenshot 2026-03-03 135401" src="https://github.com/user-attachments/assets/42a4db9a-8b29-44e1-bdee-05b5f333761a" />

## ✅ Lesen von Daten funktioniert

Screenshot zeigt, dass Daten ohne Fehler gelesen werden können.

## ✅ Schreiben von Daten funktioniert

Screenshot zeigt, dass Daten erfolgreich geschrieben werden können:

<img width="542" height="442" alt="Screenshot 2026-03-03 135342" src="https://github.com/user-attachments/assets/91d6734e-7031-4ea4-a91a-25e1bffa9f28" />

---

## 📌 Fazit

- Benutzer 1 besitzt nur Leserechte.
- Benutzer 2 besitzt Lese- und Schreibrechte.
- Eine falsche Authentifizierungsquelle (`authSource`) führt zu einem Verbindungsfehler.
