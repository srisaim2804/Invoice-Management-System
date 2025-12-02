# SWIPE Automatic Invoice Management Frontend
* Next.js app router with TypeScript
* Tailwind CSS v3 for flexible styling customization
* used React Icons Library for Icons
---

## Setup Frontend
1. **Change Backend URL to local backend URL:**
   * Go to `frontend/config.tsx` file and
     Update the following line to localhost backend URL
     ```
     export const backendURL = "https://swipe-invoice-management.vercel.app";
     ```
     to
     ```
      export const backendURL = "http://localhost:4000";
     ```

2. **Setup the frontend:**
* Go to Frontend Folder
```
  cd frontend
```

* Install Dependencies
```
  npm install
```

* Start the app
```
  npm run dev
```

4. **Open link in browser:**
`
http://localhost:3000
`

> Please visit the Frontend Documentation for a detailed overview of the code: [Frontend Docs wiki](https://github.com/hemanth-sunkireddy/Swipe-Invoice-Management/wiki/Frontend-Docs)
