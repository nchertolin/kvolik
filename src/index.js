import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.scss';
import App from './App';

// const defaultState = {
//   animes: [
//     {
//       id: 1,
//       picture: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
//       name: 'Code geas',
//       genre: 'ONA / 2023'
//     },
//     {
//       id: 2,
//       picture: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
//       name: 'Naruto',
//       genre: 'ONA / 2023'
//     },
//     {
//       id: 3,
//       picture: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
//       name: 'Avatar',
//       genre: 'ONA / 2023'
//     },
//     {
//       id: 4,
//       picture: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
//       name: 'Darling',
//       genre: 'ONA / 2023'
//     }
//   ]
// };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <App />
  </Router>
);
