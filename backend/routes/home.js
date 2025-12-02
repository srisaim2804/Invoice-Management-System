const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Swipe Invoice Management Backend</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f4;
            text-align: center;
          }
          .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          h1 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          p {
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
          }
          a {
            color: #0077cc;
            text-decoration: none;
            font-weight: bold;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Swipe Invoice Management Backend Server</h1>
          <p>Explore the code: <a href="https://github.com/hemanth-sunkireddy/Swipe-Invoice-Management/tree/main/backend" target="_blank">GitHub Repository</a></p>
          <p>API Documentation: <a href="https://github.com/hemanth-sunkireddy/Swipe-Invoice-Management/wiki/Backend-Docs" target="_blank">Backend Docs</a></p>
          <img src="https://github.com/hemanth-sunkireddy/Swipe-Invoice-Management/blob/main/frontend/public/images/swipe-logo.svg?raw=true" alt="Swipe Logo" class="logo">
        </div>
      </body>
      </html>
    `);
  });
  

module.exports = router;