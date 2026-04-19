# 🏃‍♀️ SportTracker

Application mobile de **suivi sportif en temps réel** avec géolocalisation, notifications push et interaction entre utilisateurs.

---

## 🚀 Fonctionnalités

- 🔐 Authentification sécurisée (JWT)
- 📍 Suivi GPS en temps réel (distance, vitesse, calories)
- 📡 WebSocket : voir les sportifs à proximité
- 🔔 Notifications push (Firebase FCM)
- 📱 Notifications locales (activité, profil…)
- 📊 Historique des activités
- 🗺️ Carte interactive (OpenStreetMap)

---

## 🛠️ Stack technique

### 📱 Frontend
- Expo (React Native)
- React Navigation
- Expo Location & Notifications
- Socket.IO Client

### ⚙️ Backend
- NestJS
- PostgreSQL + TypeORM
- JWT & bcrypt
- Socket.IO
- Firebase Admin SDK

---

## 🏗️ Architecture
- Frontend (Expo) ↔ Backend (NestJS) ↔ PostgreSQL / Firebase
- 
- REST API → gestion des données  
- WebSocket → temps réel  
- Scheduler → notifications  

---

## ⚡ Installation rapide


--
```bash
🔧 Backend
cd backend
npm install
npm run start:dev
📱 Frontend
cd front_end
npm install
npx expo start
📦 Build APK
cd front_end
eas build --platform android

⭐ Projet
👉 Application complète combinant tracking sportif + temps réel + notifications intelligentes
