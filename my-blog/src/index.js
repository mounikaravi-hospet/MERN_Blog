import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA3hSdzHW97UJSb4m8O_uGFhEXMEigV7w",
  authDomain: "fs-blog-5297c.firebaseapp.com",
  projectId: "fs-blog-5297c",
  storageBucket: "fs-blog-5297c.appspot.com",
  messagingSenderId: "600000199750",
  appId: "1:600000199750:web:c1074ab2add27d8eee1e47"
};

// these are all public keys, so it is ok to commit it to github

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
