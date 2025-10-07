# The Reading Room

A full-stack web application where users can browse, add, and review books. The project provides an interactive interface for readers to share their thoughts and discover reviews from others.

![thereadingroom](https://github.com/user-attachments/assets/c20ac881-a667-4aea-81f6-8dc9b111391c)



## Features
- User authentication and book management  
- Add, update, and delete reviews  
- Search and filter books based on title, author or genre
- Responsive design with fast client-side rendering  
- RESTful API for book and review management  

## Tech Stack
- **Frontend:** React (Vite)  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Deployment:** Vercel  

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/zaidtausif56/the-reading-room
   ```
2. Navigate to the project directories and install dependencies:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Create a `.env` file in the backend with the required environment variables :
   ```bash
   PORT=
   MONGODB_URI=
   JWT_SECRET=
   JWT_EXPIRES_IN=
   CORS_ORIGIN=
   ```
4. Create a `.env` file in the frontend with the backend base url :
   ```bash
   VITE_API_BASE_URL=
   ```
5. Run the development servers:
   ```bash
   npm run dev
   ```

## Deployment
The frontend and backend are deployed on **Vercel** for seamless hosting and scalability.

---

##  Author
Developed by [Md Zaid Tausif](https://github.com/zaidtausif56).
