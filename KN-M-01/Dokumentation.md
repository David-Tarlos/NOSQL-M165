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

C) Erste Schritte Shell (10%)
Screenshot von Compass, der zeigt, dass Sie die Befehle eingegeben haben
<img width="579" height="693" alt="Screenshot 2026-03-03 111041" src="https://github.com/user-attachments/assets/b1c38ad3-7c7a-4d8f-a002-633d105c5f01" />
Screenshot von der MongoDB-Shell auf dem Linux-Server, der zeigt, dass Sie die Befehle eingegeben haben.<img width="633" height="373" alt="Screenshot 2026-03-03 114404" src="https://github.com/user-attachments/assets/7520478f-037e-4456-9ca3-2297ddf78ced" />
Was machen die Befehle 1-5?

show dbs / show databases → Zeigt alle Datenbanken mit ihrer Grösse an. Beide Befehle machen dasselbe.
use Tarlos → Wechselt in die Datenbank Tarlos
show collections / show tables → Zeigt alle Collections in der aktuellen Datenbank. Beide Befehle machen dasselbe.

Unterschied Collections vs Tables?

Tables ist der Begriff aus SQL (relationale Datenbanken) – Daten sind in festen Zeilen und Spalten gespeichert
Collections ist der Begriff aus MongoDB (NoSQL) – Daten sind flexible JSON-Dokumente ohne festes Schema
In MongoDB existiert show tables nur als Alias für Leute die SQL gewohnt sind ✅

D)
