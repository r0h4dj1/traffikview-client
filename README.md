# TraffikView

## University Project Context
- **Group Project:** Developed collaboratively by a team of 3 students.
- **Development Period:** December 19, 2024 – January 9, 2025
- **Assignment Brief & Theme:** This project was developed in response to the UK government's "Grand Challenges" initiative, which aims to put the UK at the forefront of future industries. Our team selected the **Future of Mobility** challenge. We identified traffic congestion as a key issue in urban areas, recognising that mitigating congestion can improve the environment, boost the economy, and increase public satisfaction. The module was completed across three main phases:
  - *Unit 1:* Researching the four Grand Challenges and selecting our focus.
  - *Unit 2:* Project initiation, defining methodology, conducting a literature review, and collecting data.
  - *Unit 3:* Developing and implementing the software solution.
- **My Key Contributions:**
  - Initialised the core Leaflet base map and configured map boundaries.
  - Developed user geolocation functionality, including location tracking and map store integration.
  - Conducted code reviews, managed code merges, and feature integrations.
- **Note:** This repository is a standalone copy with a clean git history. This measure was taken to protect the anonymity of other group members upon making the repository public.

## Overview

<p align="center">
  <img src="./assets/traffikview-recording.gif" width="700" alt="TraffikView App Demo">
</p>

TraffikView is a web application designed to help users avoid traffic congestion. By providing visual insights into traffic conditions, it empowers users to make better commuting decisions, save time, and reduce the stress of navigating through congested areas. 

## Tech Stack
- **Frontend:** Svelte, Vite, Leaflet (for interactive maps and heatmaps)
- **Backend:** Node.js, Express
- **Database:** SQLite

## Key User Journeys
- **View Traffic Conditions:** Users can open the map interface to view traffic data, including heatmaps of congested zones.
- **Plan Commutes:** By checking the application before departing, users can identify current traffic hotspots and choose alternative routes to bypass heavy congestion.

## Prerequisites
- Node.js (v18+ recommended)
- npm

## How to Run Locally

1. **Install Dependencies**
   Navigate to the root directory and install all required packages:
   ```bash
   npm install
   ```

2. **Start the Development Servers**
   This project includes a Svelte frontend and a Node/Express backend. You can start both concurrently using the provided npm script:
   ```bash
   npm start
   ```
   This will run the Vite development server for the frontend and the Express server for the backend.

3. **Production Build**
   To build the frontend and serve it from the backend server:
   ```bash
   npm run serve
   ```
