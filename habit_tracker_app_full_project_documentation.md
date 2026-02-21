# DailyRise App – Full Project Documentation

## 1. Project Overview

**DailyRise** is a modern web and mobile application that helps users build and maintain positive habits by tracking daily and weekly activities. The app focuses on motivation through **streaks**, **visual progress**, and **clear feedback**.

This project is designed to be:
- Portfolio-ready
- Scalable
- Docker-friendly
- Beginner-to-intermediate React friendly

---

## 2. Core Features

### 2.1 Habit Management
- Create new habits
- Edit habit details
- Delete habits
- Set habit frequency:
  - Daily
  - Weekly

### 2.2 Habit Tracking
- Mark habit as completed for a day
- Prevent duplicate completion for the same date
- Auto-reset weekly habits

### 2.3 Streak System 🔥
- Daily streak calculation
- Weekly streak calculation
- Longest streak record
- Streak breaks when a habit is missed

### 2.4 Progress Calendar 📅
- Monthly calendar view
- Completed days highlighted
- Missed days shown visually
- Hover / click to view habit status

### 2.5 Progress Analytics
- Completion percentage
- Current streak vs best streak
- Weekly and monthly summaries

### 2.6 UX Enhancements
- Responsive design
- Dark / light mode
- Animations for streak milestones

---

## 3. Tech Stack

### Frontend (Web)
- **React 19**
- **Vite 7**
- **TypeScript 5.9**
- **React Router 7**
- **Tailwind CSS 4**
- **Lucide React** & **React Icons**
- **GSAP** & **@gsap/react** (animations)
- **Recharts** (analytics visualization)
- **date-fns** (date utilities)

### Frontend (Mobile)
- **React Native 0.81** (via Expo 54)
- **NativeWind 4** (Tailwind for mobile)
- **React Navigation 7**
- **Async Storage** (local data)
- **Lucide React Native**

### State Management
- Context API + Reducer
- Optional upgrade: Zustand or Redux Toolkit

### Persistence
- LocalStorage (Phase 1)
- Optional:
  - Firebase Firestore
  - Supabase
  - REST API backend

### DevOps
- Docker
- Docker Compose
- Nginx (production)

---

## 4. Application Pages

### 4.1 Home / Dashboard
- Today’s habits
- Quick complete buttons
- Current streak summary

### 4.2 Habits Page
- List all habits
- Filter: Daily / Weekly
- Habit completion history

### 4.3 Calendar Page
- Monthly calendar
- Color-coded habit completion
- Click date to see details

### 4.4 Analytics Page
- Charts and stats
- Habit consistency trends

### 4.5 Settings
- Theme toggle
- Reset data
- Export habit data (JSON)

---

## 5. Data Model

### Habit Model
```ts
Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  createdAt: string;
  completedDates: string[]; // ISO dates
  currentStreak: number;
  longestStreak: number;
}
```

---

## 6. Streak Logic (Core Algorithm)

### Daily Habit
- If completed today → streak +1
- If missed yesterday → streak resets

### Weekly Habit
- One completion per week counts
- Missed week resets streak

### Edge Cases
- Timezone-safe date comparison
- Prevent double counting

---

## 7. Folder Structure

```
src/
├── components/
│   ├── HabitCard.tsx
│   ├── Calendar.tsx
│   ├── StreakBadge.tsx
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Habits.tsx
│   ├── CalendarView.tsx
│   ├── Analytics.tsx
│
├── context/
│   ├── HabitContext.tsx
│   ├── habitReducer.ts
│
├── hooks/
│   ├── useHabits.ts
│
├── utils/
│   ├── dateUtils.ts
│   ├── streakUtils.ts
│
├── styles/
├── App.tsx
└── main.tsx
```

---

## 8. Docker Setup

### Dockerfile (Development)
```Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

### docker-compose.yml
```yaml
version: "3.8"
services:
  habit-tracker:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
```

---

## 9. Development Phases

### Phase 1 – MVP
- Habit CRUD
- Daily tracking
- LocalStorage / Async Storage

### Phase 2 – Visual Progress
- Calendar view
- Streak counter

### Phase 3 – Analytics
- Charts
- Performance optimization

### Phase 4 – Production
- Environment configs

---

## 10. Testing Strategy

- Unit tests (Jest / Vitest)
- Component tests (React Testing Library)
- Manual edge-case testing for streak logic

---

## 11. Deployment Options

- Vercel (Frontend)
- Netlify
- Docker + VPS
- AWS EC2 with Nginx

---

## 12. Resume Description (Ready-to-use)

> Built DailyRise, a cross-platform habit tracking suite (Web & Mobile) using React 19, Expo 54, and TypeScript. Features robust streak logic, calendar visualizations with Recharts, and a high-performance Obsidian glass design with GSAP animations. Implemented Dockerized infrastructure for seamless deployment.

---

## 13. Future Enhancements

- User authentication (Firebase/Supabase)
- Cloud sync & real-time updates
- Enhanced push notifications
- Gamification (badges, levels, social leaderboards)

---

## 14. Success Criteria

- Clean UX
- Accurate streak logic
- Zero date bugs
- Dockerized setup
- Resume-worthy codebase

---

🔥 This project demonstrates **frontend fundamentals**, **real-world logic**, and **production readiness**.

