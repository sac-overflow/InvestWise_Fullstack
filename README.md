# InvestWise Fullstack

InvestWise is a full-stack investment advisory application built to help users track assets, manage a watchlist, calculate investment goals, and generate risk-profile based advisory strategies.

This project is designed as a practical fintech application using a Java Spring Boot backend and a React frontend. It focuses on clean backend architecture, REST API development, database integration, and frontend-backend communication.

> Note: AI-based advisory, user authentication, authorization, and onboarding flows are planned as future enhancements.

---

## Project Overview

InvestWise provides a simple investment advisory experience where users can:

* Track investment assets
* Maintain a personal watchlist
* Save investment calculator goals
* Create risk profiles using questionnaire-based inputs
* Receive a basic investment strategy based on risk score
* View preloaded sample financial data for quick testing

The project is built with a backend-first approach and follows a layered Spring Boot architecture.

---

## Tech Stack

### Backend

* Java 17
* Spring Boot
* Spring Web
* Spring Data JPA
* H2 Database
* Maven

### Frontend

* React.js
* Vite
* JavaScript
* CSS
* Axios

### Tools

* Git
* GitHub
* VS Code 
* Command Prompt / PowerShell
* H2 Console

---

## Features

### Asset Tracking

Users can view and manage investment assets such as stocks, mutual funds, ETFs, or other financial instruments.

### Watchlist Management

Users can maintain a watchlist of assets they want to monitor.

### Investment Calculator

Users can save investment goals with inputs such as:

* Initial investment
* Monthly contribution
* Annual interest rate
* Investment duration

The application calculates projected investment value based on the given inputs.

### Risk Profile Advisory

Users can answer risk-related questions and generate a risk profile.

The system considers factors such as:

* Age group
* Investment goal
* Investment horizon
* Market reaction
* Investment knowledge level

Based on the score, the application generates:

* Risk score
* Risk category
* Suggested investment strategy
* Asset allocation guidance

### Preloaded Mock Data

The backend initializes sample assets, watchlist items, and calculator goals so the application is interactive immediately after starting.

---

## Project Structure

```text
InvestWise_Fullstack/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/investwise/backend/
│   │   │   │   ├── BackendApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   └── DataInitializer.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AssetController.java
│   │   │   │   │   ├── WatchlistController.java
│   │   │   │   │   ├── CalculatorController.java
│   │   │   │   │   └── RiskProfileController.java
│   │   │   │   ├── model/
│   │   │   │   │   ├── Asset.java
│   │   │   │   │   ├── WatchlistItem.java
│   │   │   │   │   ├── CalculatorGoal.java
│   │   │   │   │   └── RiskProfile.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── AssetRepository.java
│   │   │   │   │   ├── WatchlistItemRepository.java
│   │   │   │   │   ├── CalculatorGoalRepository.java
│   │   │   │   │   └── RiskProfileRepository.java
│   │   │   │   └── service/
│   │   │   │       └── AdvisorService.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── run.ps1
├── start.bat
└── README.md
```

---

## Backend API Endpoints

### Assets

```http
GET /api/assets
POST /api/assets
PUT /api/assets/{id}
DELETE /api/assets/{id}
```

### Watchlist

```http
GET /api/watchlist
POST /api/watchlist
DELETE /api/watchlist/{id}
```

### Calculator Goals

```http
GET /api/calculator
POST /api/calculator
DELETE /api/calculator/{id}
```

### Risk Profile

```http
GET /api/risk-profile/latest
POST /api/risk-profile
```

---

## How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/sac-overflow/InvestWise_Fullstack.git
cd InvestWise_Fullstack
```

---

## Running the Backend

Go to the backend folder:

```bash
cd backend
```

Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

On Windows CMD:

```cmd
mvnw.cmd spring-boot:run
```

The backend will start at:

```text
http://localhost:8080
```

The H2 database console is available at:

```text
http://localhost:8080/h2-console
```

Use the following H2 credentials:

```text
JDBC URL: jdbc:h2:mem:investwisedb
Username: sa
Password: 
```

Leave the password blank.

---

## Running the Frontend

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

## Current Status

Completed:

* Spring Boot backend setup
* H2 database integration
* JPA entities and repositories
* REST controllers
* Service layer for advisory logic
* Data initializer with sample records
* React frontend setup
* GitHub repository setup

In progress / planned:

* AI-based investment recommendation engine
* User authentication and authorization
* User onboarding page
* Role-based dashboard
* Oracle DB integration
* Deployment
* Improved dashboard analytics
* Unit and integration testing

---

## Future Enhancements

The following features are planned:

* AI-powered investment advisory engine
* User login and registration
* JWT authentication
* Role-based authorization
* Personalized onboarding flow
* Portfolio performance charts
* Risk-based asset allocation visualization
* Oracle DB support for production-style setup
* Backend validation and exception handling improvements
* Deployment using cloud hosting platforms
* CI/CD pipeline using GitHub Actions


## Author

Manga Sachhith
B.Tech Computer Science & FinTech
MIT Manipal

GitHub: [sac-overflow](https://github.com/sac-overflow)
