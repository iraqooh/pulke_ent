# 🎬 Pulke ENT

**Pulke ENT** is a modern movie and TV show discovery platform that provides **free download links**, powered by the **OMDb API**, **Appwrite**, and **Google AdSense**.  
It features real-time search, trending titles, SEO-optimized pages, user-submitted download suggestions, and a secure admin moderation panel.

🔗 **Live Site:** https://pulke-ent.vercel.app

---

## ✨ Features

### Public Features
- 🔍 Search movies & TV shows with autocomplete suggestions
- 📈 Trending titles curated on the homepage
- 🎥 Detailed movie pages (IMDb rating, plot, poster, year, type)
- ⬇️ Multiple download links per title (quality & size)
- ✍️ User-submitted link suggestions
- 📱 Fully responsive UI
- 🔎 SEO optimization with React Helmet
- 💰 Google AdSense integration

### Admin Features
- 🔐 Secure admin authentication
- 🧾 Review and moderate link suggestions
- ➕ Add download links directly
- 🚪 Logout and session persistence
- 🗄️ Appwrite-powered database

---

## 🧱 Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- React Helmet Async
- React Hot Toast
- TanStack React Query

### Backend / Services
- OMDb API
- Appwrite (Auth & Database)
- Google AdSense
- Vercel (Deployment)

---

## 📁 Project Structure

```bash
src/
├── components/
│   ├── AdBanner.jsx
│   ├── Card.jsx
│   └── SearchBar.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── lib/
│   ├── appwrite.js
│   └── omdb.js
│
├── pages/
│   ├── Home.jsx
│   ├── SearchResults.jsx
│   ├── MovieDetails.jsx
│   ├── AdminLogin.jsx
│   └── AdminPanel.jsx
│
├── Layout.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 🔐 Authentication & Authorization

- Admin authentication via Appwrite Email/Password sessions

- Protected admin routes using React Context

- Unauthorized users redirected to /admin/login

## 🗃️ Appwrite Collections

### download-links
```json
{
  "imdbId": "tt1234567",
  "quality": "1080p Bluray",
  "size": "4.2 GB",
  "link": "https://example.com/download"
}
```

### link_suggestions

```json
{
  "imdbId": "tt1234567",
  "title": "Movie Title",
  "year": "2023",
  "quality": "720p WEB-DL",
  "size": "1.4 GB",
  "link": "https://example.com",
  "suggesterEmail": "user@example.com"
}
```

## 🌍 Environment Variables

Create a .env file in the project root:

```env
VITE_OMDB_KEY=your_omdb_api_key
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DB_ID=your_database_id
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pulke-ent.git
cd pulke-ent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## 📦 Deployment

- Hosted on Vercel

- Automatic builds on push to main

- Environment variables managed via Vercel dashboard

## ⚠️ Disclaimer

Pulke ENT does not host any files.
All download links are user-submitted or externally sourced.
Copyright owners may request removal.

## 📄 License

This project is released under the MIT License.

## 👨‍💻 Author

Harry Iraku 