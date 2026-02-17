# Cloud-Init Konfiguration für MongoDB Installation

## Übersicht

Diese Cloud-Init Datei automatisiert die Installation und Konfiguration von MongoDB 6.0 auf einer AWS Ubuntu-Instanz.

---

## Cloud-Init Datei

```yaml
#cloud-config

# ========================================
# BENUTZER-KONFIGURATION
# ========================================
users:
  - name: ubuntu
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups: users, admin
    home: /home/ubuntu
    shell: /bin/bash
    ssh_authorized_keys:
      # Teacher Keys (nicht entfernen!)
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCPIIO8uY8oWIihDv0tCAbX6toyG1RYkaLZyfGD1L+I07K4CnwAVBSU+81vw3Yv5sN9tj2Ccve9kzEeCNMld2mDP/Tt7edkx2MCToVfVx+njqwY/XbMY9bfdRKJLhIoLavuVNLnnkSIXdtlGr3JF71hPHzBDMEo64ofPCQ8hPsGxL1u3efb12jcWcRhudKtv7Qh6cVE47Zj4xImfi6VlLqwzcKZ5oCqR/z1hLLL+/pS3eM5Qsor5wmAqNfH4+z5eE+pOkFm7a0Nkygv9jwXIqtJzFGKYDe6ciBD04pEovdvY0FTyiv2vksQOVgjtu2faG2Iv1HOG0JktCIwJ49OEgjT teacher-key
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDRI4IqTl6RNGbOJlpVLT6qSuRa34FqHtdOQaq1vxgTPPDesHMGrTIM2jaS2S6HgKMgW3C8COFXR23SQAcyF2C9G+H4MzTge/dmpFDJh3ram2N7HC/N1tB76W0nA05aQWvDHAHSqqB20pAstxvtq8DteGERCNj6sl9GRKDxwXdAthuRXwq+dM05cq6T7vDki/yMmJUYRmyGBEzKfci6XYBMQ079I/4x33NGGqsK23wFb3khqziCUTRtCwJe7frX9Z1ak2JG9RMdEf4l/5kGjOez0VptMcpdZM4C7uyklFtGIb9OjAPLHowgq0cCB9bL7h86U5FkdejLkC87Uzhm/Fo7 teacher-key
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKCuWX/W66sjjNiDNuPpKgYO1xFqDoMJoeo5hz2LDNrF teacher-key-wir
      # Eigener SSH-Key
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDZ2Bh2Y+W5xs+O/HUtPgFS1FTjQlC6EIq0Kju+qDzypBmFirGGI3R9vqQMPf5pvwaQYezfAtBOsBAjeFL5Rm1oZi1H0cjK2DCV8KI247KtJIUKMp0z4Tj0ceNh/KXPGD5GgoYlRAK/1BCYCj1YpWdmp8rGO6rKe0zRnyurOxMf0yZSO9od5aICHvQ4Y1C88RaSdOLQSyC7bCNspzblWZIc4u/9EsuDRZc91nABx6UPJnM2AA9RrHrvQdux+jUkBGrviZkylWFsK+RukHUPY2r465ZzUgQRQe2+wuFi0tPcNmH0rng+GOawIqcuEvxVatZNj+CyCpVH/8oOj2MBUZ6R

ssh_pwauth: false
disable_root: false

# ========================================
# SYSTEM-PAKETE
# ========================================
package_update: true 
packages:
  - unzip
  - gnupg
  - curl

# ========================================
# KONFIGURATIONSDATEIEN
# ========================================
write_files:
  # Skript zum Aktivieren der MongoDB-Authentifizierung
  - path: /home/ubuntu/mongodconfupdate.sh
    content: |
      sudo sed -i 's/#security:/security:\n  authorization: enabled/g' /etc/mongod.conf
  
  # MongoDB Admin-Benutzer erstellen
  - path: /home/ubuntu/mongodbuser.txt
    content: |
      use admin;
      db.createUser(
        {
          user: "admin",
          pwd: "12345",
          roles: [
            { role: "userAdminAnyDatabase", db: "admin" },
            { role: "readWriteAnyDatabase", db: "admin" }
          ]
        }
      );

# ========================================
# INSTALLATIONSBEFEHLE
# ========================================
runcmd:
  # MongoDB GPG-Key hinzufügen
  - curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
  
  # MongoDB Repository hinzufügen
  - echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
  
  # System aktualisieren
  - sudo apt-get update -y
  
  # MongoDB installieren
  - sudo apt-get install -y mongodb-org
  
  # BindIP auf 0.0.0.0 setzen (externe Verbindungen erlauben)
  - sudo sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mongod.conf
  
  # Security-Skript ausführbar machen und ausführen
  - sudo chmod +x /home/ubuntu/mongodconfupdate.sh
  - sudo /home/ubuntu/mongodconfupdate.sh
  
  # MongoDB aktivieren und starten
  - sudo systemctl enable mongod
  - sudo systemctl start mongod
  
  # Kurz warten bis MongoDB bereit ist
  - sudo sleep 3
  
  # Admin-Benutzer erstellen
  - sudo mongosh < /home/ubuntu/mongodbuser.txt
  
  # MongoDB neu starten (damit Security-Einstellungen aktiv werden)
  - sudo systemctl restart mongod
```
