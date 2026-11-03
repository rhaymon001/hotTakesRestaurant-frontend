# HotTakesFrontend

HotTakesFrontend is the customer-facing web application for the HotTakes restaurant platform. It provides a polished ordering experience with menu browsing, cart management, checkout, account access, and administrative tools for restaurant operations.

## Overview

This project is built with Vue 3, Vite, and Tailwind CSS to deliver a responsive, fast, and modern user interface. The frontend interacts with the backend service to handle authentication, menu data, orders, payments, and user settings.

## Why this app exists

The frontend is designed to feel intuitive and conversion-focused while keeping business logic and sensitive workflows on the backend. It enables both customer and staff experiences through a single codebase with route-based access control.

## Features

- Responsive restaurant landing page
- Dynamic menu and item browsing experience
- Shopping cart and checkout flow
- Customer login and registration
- Password recovery and reset flow
- User dashboard with order history and settings
- Admin dashboard for food, orders, and user management
- Payment success states and post-purchase experience
- Route guards for authenticated and role-based access

## Tech Stack

- Vue 3
- Vite
- Vue Router
- Pinia
- Tailwind CSS
- Axios
- VeeValidate and Yup
- Font Awesome and Lucide icons

## Project Structure

```text
HotTakesFrontend/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── router/
│   ├── stores/
│   ├── views/
│   ├── App.vue
│   └── main.js
├── index.html
├── jsconfig.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── README.md
```

## Prerequisites

Before running the app locally, ensure you have:

- Node.js 18 or newer
- npm installed
- A running instance of the backend API from the `HotTakesBackend` project

## Installation

```bash
npm install
```

## Running the application

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The app runs locally at:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev      # start the Vite development server
npm run build    # create a production bundle
npm run preview  # preview the built app locally
npm run format   # format the source files with Prettier
```

## Routing overview

The application uses Vue Router with protected routes and role-aware navigation. Key routes include:

- `/` — home page
- `/menu` — menu browsing
- `/cart` — shopping cart
- `/checkOut` — checkout
- `/login` — sign in
- `/register` — sign up
- `/forgot-password` — password recovery
- `/reset-password/:token` — reset password form
- `/dashboard` — authenticated customer dashboard
- `/admin` — admin dashboard

## Backend integration

This frontend communicates with the backend through API modules and Pinia stores. Ensure the API service is running and reachable before testing order, auth, and admin workflows.

## Deployment notes

This project is configured for deployment on Vercel and similar static hosting providers. For production deployment, make sure the backend URL used by the frontend matches the deployed API domain and that all required runtime configuration is set in the hosting environment.

## License

This project is licensed under the ISC license.

## Contributing

Contributions are welcome. Keep the UI consistent with the current design, validate user flows thoroughly, and submit changes with clear, focused updates.
