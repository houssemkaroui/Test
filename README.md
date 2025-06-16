# 📰 Blog Platform - MEAN Stack + Socket.io

Une plateforme de blog en temps réel construite avec la stack **MongoDB + Express + Angular + Node.js**, intégrant **Socket.io** pour les commentaires instantanés et notifications.

## 🚀 Fonctionnalités

### Frontend (Angular + Material UI)
- Authentification (connexion, inscription, JWT)
- Affichage des articles (création, édition, suppression)
- Ajout et gestion de commentaires en temps réel
- Commentaires imbriqués (réponses)
- Notifications dynamiques via WebSocket
- Interface responsive avec Angular Material

### Backend (Node.js + Express)
- API REST sécurisée avec JWT
- Uploads de fichiers (optionnel)
- Gestion des rôles utilisateur
- Socket.io pour :
  - Commentaires en direct
  - Notifications des nouveaux commentaires

## 📁 Structure du projet

```
Test/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── sockets/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── environments/
│   └── angular.json
└── README.md
```

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/houssemkaroui/Test.git
cd Test
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # ou créez un .env avec vos variables
npm start
```

Variables d'environnement (.env) :
```
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
FRONTEND_URL=http://localhost:4200
PORT=5000
```

### 3. Frontend

```bash
cd ../frontend
npm install
ng serve
```

Accédez à : `http://localhost:4200`

## 🧠 Technologies

- **Frontend**: Angular, Angular Material, RxJS, Socket.io-client
- **Backend**: Express.js, Mongoose, JWT, Bcrypt, Socket.io, Helmet, CORS
- **Base de données**: MongoDB

## 👥 Auteurs

- [Houssem Karoui]

## 📜 Licence

Ce projet est sous licence MIT.

---

> Projet personnel de blog temps réel avec Socket.io ✨

## 📜 Capture
![image](https://github.com/user-attachments/assets/dc3000e1-183d-4af9-a4d4-5699bec1924c)

![image](https://github.com/user-attachments/assets/a86b7738-a4da-4b38-bda8-c77c0f9113c2)


![article liste](https://github.com/user-attachments/assets/ef4a44c6-cf52-4487-8b0f-2ac6930e04ca)

![addarticle](https://github.com/user-attachments/assets/316ce1ca-29a0-4202-a5d6-2bf28612a61d)

![image](https://github.com/user-attachments/assets/53964a94-546b-4974-b0b1-dccbced4c22a)

![image](https://github.com/user-attachments/assets/0bd38627-ae57-4d05-9f78-2ad1ba49a19a)
