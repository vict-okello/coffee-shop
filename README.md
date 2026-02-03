# Coffee Shop Web Application

A full-stack coffee shop platform built to deliver a seamless online ordering experience, an intelligent AI-powered chatbot for customer assistance, and a powerful admin dashboard for business management.

## Overview

This application simulates a real-world coffee shop e-commerce workflow.  
Customers can browse the menu, place orders, make online payments, and interact with an AI chatbot for instant assistance.  
Administrators manage products, orders, reservations, and customer messages through a secure dashboard.

## Key Features

### Customer Experience
- Browse coffee, food, and dessert products
- View detailed product information
- Add items to cart and checkout
- Online payments via M-Pesa and Stripe
- AI-powered chatbot for:
  - Product inquiries
  - Order assistance
  - Store-related questions
- Contact form and table reservations
- Fully responsive design

### Admin Dashboard
- Secure admin authentication
- Create, update, and delete products
- View and manage customer orders
- Access customer contact messages
- Manage reservations

## Technology Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT-based authentication

### AI & Automation
- OpenAI API (chatbot integration)
- Website-aware product and order search

### Payments
- M-Pesa (Daraja API)
- Stripe

AI Chatbot

The chatbot is designed to be **website-aware**, allowing it to:

 Respond to general greetings before performing searches
 Answer questions about available products
 Assist with order-related queries
 Provide basic store information

The chatbot logic integrates backend search utilities to fetch relevant product and order data before generating responses.

Ensure environment variables are properly configured in production.

## Security

 Environment variables protect sensitive credentials
 JWT-secured admin routes
 Server-side validation for payment callbacks and chatbot requests

## Future Enhancements

 Live order tracking through chatbot
 Customer accounts and order history
 Analytics dashboard


## Author

Victor Okello
