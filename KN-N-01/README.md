# NOSQL-M165 – Neo4j

## A) Installation / Account erstellen (30%)

Screenshot dass die Verbindung funktioniert und die Instanz über Neo4j AuraDB sauber läuft:

![Neo4j AuraDB Instanz](https://github.com/user-attachments/assets/0aff94f1-e24e-4070-88ad-5c80c5d956e7)

Query-Verbindung um zu testen ob die Verbindung wirklich funktioniert:

![Query Test](https://github.com/user-attachments/assets/6a6a768e-408f-4a28-adaf-38d8e94bc219)

Verbindung in der App:

![App Verbindung](https://github.com/user-attachments/assets/a0d6c8f8-47be-4129-9232-48aad2dc81c6)

---

## B) Logisches Modell für Neo4j (70%)

### Bild

![Neo4j Logisches Modell](https://github.com/user-attachments/assets/5c106501-c8ac-4218-9bb7-344736c87ca1)

### Draw.io-Datei

[neo4j-logisches-modell.drawio](neo4j-logisches-modell.drawio)

---

### Erklärung

#### Knoten

| Knoten | Attribute | Begründung |
|---|---|---|
| **:Entwickler** (blau) | name : String, gruendungsjahr : int, land : String | Eigener Knoten, weil ein Entwickler mehrere Spiele entwickeln kann. Ohne eigenen Knoten müsste man die Studio-Daten bei jedem Spiel wiederholen. |
| **:Spiel** (orange) | titel : String, erscheinungsjahr : int, preis : float, genre : String, bewertung : float | Zentrale Entität, die Entwickler, Spieler und Plattformen verbindet. Der Preis hier ist der allgemeine Standardpreis. |
| **:Spieler** (grün) | username : String, email : String, registrierungsdatum : Date | Eigener Knoten, weil ein Spieler viele Spiele besitzen und auf mehreren Plattformen aktiv sein kann. |
| **:Plattform** (pink) | name : String, hersteller : String, typ : String | Eigener Knoten, weil mehrere Spiele und Spieler die gleiche Plattform nutzen können. |

#### Kanten ohne Attribute

| Kante | Richtung | Kardinalität | Begründung |
|---|---|---|---|
| **:Entwickelt** | Entwickler → Spiel | 1:N | Einfache Zuordnung – ein Entwickler hat ein Spiel gemacht. Keine zusätzlichen Daten nötig. |
| **:Verfügbar_Auf** | Spiel → Plattform | N:M | Einfache Ja/Nein-Zuordnung – das Spiel ist auf der Plattform oder nicht. |
| **:Spielt_Auf** | Spieler → Plattform | N:M | Zeigt nur, dass der Spieler die Plattform nutzt. Keine zusätzlichen Daten nötig. |

#### Kanten MIT Attributen

| Kante | Richtung | Kardinalität | Attribute | Begründung |
|---|---|---|---|---|
| **:Spielt** | Spieler → Spiel | N:M | spielstunden : float, letztes_spieldatum : Date | Die Spielstunden gehören weder zum Spieler noch zum Spiel alleine – Spieler A hat 200h in Spiel X aber nur 10h in Spiel Y. Die Werte sind pro Spieler-Spiel-Kombination unterschiedlich, deshalb auf der Kante. |
| **:Besitzt** | Spieler → Spiel | N:M | kaufdatum : Date, kaufpreis : float | Spieler A hat das Spiel 2023 für CHF 30 im Sale gekauft, Spieler B 2024 für CHF 60 Vollpreis. Der kaufpreis auf der Kante unterscheidet sich vom allgemeinen preis auf dem Spiel-Knoten. |

#### Warum keine IDs (UUIDs)?

Im konzeptionellen Modell hatte jede Entität eine UUID als Primärschlüssel. In Neo4j braucht man das nicht, weil Neo4j intern eigene IDs verwaltet. Beziehungen werden direkt über Kanten hergestellt, nicht über Foreign Keys.

#### Unterschied zum konzeptionellen Modell

Im relationalen Modell braucht man Fremdschlüssel und Zwischentabellen für N:M-Beziehungen. In Neo4j werden diese direkt als Kanten dargestellt – einfacher und schneller bei Abfragen über mehrere Beziehungen.
