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
