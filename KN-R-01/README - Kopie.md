# NOSQL-M165

## KN-R-01: Key-Value-Datenbank kennenlernen (Redis)

### 1. Redis mit Docker starten
Um Redis lokal auszuführen, wurde folgender Befehl verwendet:

```
docker run --name redis-server -p 6379:6379 -d redis
```

![Redis starten](https://github.com/user-attachments/assets/92c72293-6e48-4a36-b84d-8849e840e652)

---

### 2. Überprüfung der Funktion
Es wurde überprüft, ob Redis korrekt läuft:

![Überprüfung](https://github.com/user-attachments/assets/80b0627a-c0fc-4ca8-ae92-82c6b7dd5670)

---

### 3. Verbindung mit Redis CLI
Verbindung zur Redis-Konsole herstellen:

![Redis CLI](https://github.com/user-attachments/assets/ca6cb17a-2cfa-4178-94b2-e6681641dc85)

---

### 4. Key-Value Paare speichern und abrufen
Einfaches Beispiel zum Speichern und Auslesen von Daten:

![Key-Value Beispiel](https://github.com/user-attachments/assets/764a97b9-5684-40ce-9ffb-c92cbc584970)

Weitere Tests:

![Weiteres Beispiel](https://github.com/user-attachments/assets/0f11e558-f5d0-4a3a-8b0c-2b4f456ca64d)

---

### 5. Weitere Daten speichern
Speichern von zusätzlichen Werten wie Alter und Stadt:

![Alter und Stadt](https://github.com/user-attachments/assets/18ccb0ff-134a-4268-8183-0d790eb3894d)

---

### 6. Alle Keys anzeigen
Anzeige aller gespeicherten Keys:

![Alle Keys](https://github.com/user-attachments/assets/9d161942-5c8e-4540-9b71-8a37154b7832)

---

### 7. Keys löschen
Löschen eines Keys (z.B. Name) und anschliessendes Überprüfen:

![Key löschen](https://github.com/user-attachments/assets/ea5f25c1-4884-4568-abe6-f533e11363d7)

---

### 9. Benchmark-Test
Durchführung eines Performance-Tests:

![Benchmark](https://github.com/user-attachments/assets/06811655-c890-4ac2-883b-f083ff9869bf)

---
