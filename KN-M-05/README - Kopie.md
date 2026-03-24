# NOSQL-M165

KN-M-05: Administration von MongoDB
A) Rechte und Rollen (40%)

Sie hatten bereit in KN-M-01 eine kurze Übersicht zu den Rechten und Sie mussten damals den Verbindungstext anschauen und verstehen. mongodb://<IhrBenutzer>:<IhrPasswort>@<IhreIp>:27017/?authSource=admin&readPreference=primary&ssl=false.
Mit authSource wird mitgegeben, in welcher Datenbank der Benutzer liegt. In diesem Teil werden Sie nun weitere Benutzer erstellen und auch zeigen, dass die Angabe von authSource relevant ist.

Ändern Sie den Verbindungstext und versuchen Sie als authSource eine andere Datenbank als admin anzugeben (aber eine existierende). Zeigen Sie so, dass der Zugriff nicht mehr funktioniert.
Screenshot von dem: 
<img width="497" height="83" alt="Screenshot 2026-03-24 110531" src="https://github.com/user-attachments/assets/d5274ef7-0eed-4661-b1c2-e566f0eb797e" />

2 commands wie wir den user erstellt habe
Skript, welches die beiden Benutzer erstellt.
leser: 
db.createUser({
    user: "leser",
    pwd: "12345",
    roles: [{ role: "read", db: "gamingDB" }]
  })

schreiber
db.createUser({
    user: "schreiber",
    pwd: "12345",
    roles: [{ role: "readWrite", db: "gamingDB" }]
  })

  4. Benutzer 1 testen (3 Screenshots)
   Screenshot 1: Erfolgreiche Verbindung (Verbindungsstring sichtbar)
<img width="337" height="81" alt="image" src="https://github.com/user-attachments/assets/12c831d7-87d0-4289-ad18-0e3240e19df1" />
Screenshot 2: db.eineCollection.find() → funktioniert, Daten werden angezeigt
<img width="571" height="397" alt="image" src="https://github.com/user-attachments/assets/cc2defb4-8a6a-46ba-b35b-a1de8c160efa" />
Screenshot 3: db.eineCollection.insertOne({test: "hallo"}) → Fehler, weil read-Rolle kein Schreiben erlaubt
db.eineCollection.insertOne({test: "hallo"})
<img width="844" height="99" alt="image" src="https://github.com/user-attachments/assets/171be56c-d46c-4015-8e6d-f51d5afb9130" />

5. Benutzer 2 testen (3 Screenshots)
Screenshot 1: Erfolgreiche Verbindung (Verbindungsstring sichtbar)
<img width="357" height="72" alt="image" src="https://github.com/user-attachments/assets/ba3b2504-9c57-4db7-86ba-917c7e3d924a" />
Screenshot 2: db.eineCollection.find() → funktioniert
<img width="570" height="393" alt="image" src="https://github.com/user-attachments/assets/62a26f2a-fa3e-470f-9291-1a8b4fa4cf05" />
Screenshot 3: db.eineCollection.insertOne({test: "hallo"}) → funktioniert ebenfalls, kein Fehler
<img width="572" height="153" alt="image" src="https://github.com/user-attachments/assets/b64d3d16-2c1a-4fd5-b294-ffdd01e0cf86" />

B) Backup & Restore
Vorbereitung: Sicherstellen, dass deine Datenbank mindestens 2 Collections mit Daten hat. Screenshot davon machen (z.B. in Compass die Collections zeigen)
Screenshots zu bestehenden Daten
plattformen
<img width="880" height="883" alt="image" src="https://github.com/user-attachments/assets/a42f1a21-ced8-4c10-ab89-1ee111093a67" />
spieler
<img width="1474" height="909" alt="image" src="https://github.com/user-attachments/assets/19775793-7031-48d7-8b57-e637ac98ce10" />



