# Collabrix ...

### Connect. Collaborate. Build Together.

Collabrix is a full-stack collaboration and professional networking platform designed for developers and students to discover like-minded people, share project ideas, build teams, and collaborate on real-world projects.

It combines professional profiles, networking, project discovery, task management, and real-time messaging in one platform.

---

## 📸 Screenshots

### 🏠 Landing Page

Showcase of the Collabrix landing page.

![Collabrix Landing Page](docs/images/landing-page.png)

### 📊 Dashboard

Discover projects, explore opportunities to collaborate, and connect with other developers.

![Collabrix Dashboard](docs/images/dashboard.png)

### 🔔 Notifications

Stay updated with connection requests, project interests, and task assignments.

![Collabrix Notifications](docs/images/notifications.png)

---

## ✨ Features

### 👤 User Profiles

* Create and manage professional profiles.
* Add a bio, skills, experience, and education.
* Upload profile and cover images.
* View other users' profiles.

### 🤝 Professional Networking

* Send and manage connection requests.
* Accept or reject connection requests.
* Discover people through People You May Know.
* View connection relationships.

### 💡 Project Discovery & Collaboration

* Create and discover projects.
* Express interest in joining projects.
* Accept or reject collaboration requests.
* Manage project members.
* Collaborate through a dedicated project workspace.

### 📝 Posts & Activity Feed

* Share project ideas and updates.
* Like and unlike posts.
* Comment on posts.
* Edit and delete your own posts.
* Navigate directly to a post publisher's profile.

### 🛠️ Project Playground

* Manage project tasks.
* Share ideas with collaborators.
* Manage project files.
* Connect project work with GitHub.
* Organize project members and activities.

### 💬 Real-Time Messaging

* Communicate with other users through one-to-one messaging.
* Use WebSocket-based communication for realtime updates.

### 🔔 Notifications

Receive notifications for important activities, including:

* Connection requests.
* Accepted connections.
* Project interest requests.
* Accepted project interests.
* Task assignments.

### 🔎 Search

* Search for users by username, name, or headline.
* Search projects by title, description, technology stack, and collaboration requirements.

### 🌙 User Experience

* Responsive interface.
* Dark mode.
* Interactive navigation.
* Context-aware user profiles.

---

## 🧰 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* JavaScript

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* JWT Authentication
* BCrypt Password Hashing
* WebSocket / STOMP

### Database

* MySQL

### Development Tools

* Git
* GitHub
* Postman
* Maven
* npm

---

## 🏗️ Architecture

Collabrix currently follows a full-stack monolithic backend architecture.

```text
                   ┌──────────────────────┐
                   │       User           │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   React Frontend     │
                   │   Vite + Tailwind    │
                   └──────────┬───────────┘
                              │
                     REST APIs / WebSocket
                              │
                              ▼
                   ┌──────────────────────┐
                   │   Spring Boot API    │
                   │                      │
                   │ Controllers          │
                   │ Services             │
                   │ Repositories         │
                   │ Spring Security      │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │       MySQL          │
                   └──────────────────────┘
```

### Authentication Flow

1. A user registers or logs in.
2. The backend authenticates the credentials.
3. Passwords are protected using BCrypt hashing.
4. JWT is used to authenticate subsequent API requests.
5. Spring Security protects the relevant endpoints.

---

## ⚙️ Getting Started

Follow these instructions to run Collabrix locally.

### Prerequisites

Install the following:

* Java (version compatible with your Spring Boot configuration)
* Maven
* Node.js and npm
* MySQL
* Git

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Collabrix
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your repository URL.

### 2. Configure MySQL

Create a database:

```sql
CREATE DATABASE collabrix;
```

Configure the database connection in your backend's environment or application configuration.

Example environment variables:

```env
DB_URL=jdbc:mysql://localhost:3306/collabrix
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secure_secret
```

**Security note:** Use environment variables or a secret manager for sensitive production configuration. Never commit real database passwords or JWT secrets to GitHub.

Make sure the application configuration references the environment variable names you use.

### 3. Run the Backend

Open a terminal in the backend directory:

```bash
./mvnw spring-boot:run
```

On Windows, use:

```powershell
.\mvnw.cmd spring-boot:run
```

If your project does not include the Maven Wrapper, use:

```bash
mvn spring-boot:run
```

Ensure MySQL is running and the backend configuration is correct before starting the application.

### 4. Run the Frontend

Open another terminal in the frontend directory:

```bash
npm install
npm run dev
```

Vite will display the local development URL in the terminal.

Open that URL in your browser.

> **Note:** Frontend API URLs, database settings, JWT secrets, and WebSocket configuration must match your actual project setup. The commands and environment variable names above are examples where configuration may differ.

---

## 🔐 Security

Collabrix includes several security-related features:

* JWT-based authentication.
* BCrypt password hashing.
* Spring Security endpoint protection.
* Ownership checks for post modification and deletion.
* User-specific access checks for protected operations.

Security hardening and production configuration should be reviewed before deploying the application publicly.

---

## 🚀 Future Improvements

Planned production-readiness improvements include:

* Centralized exception handling and request validation.
* Improved API error responses.
* Pagination and database query optimization.
* Automated backend and frontend testing.
* Database migrations.
* Docker-based deployment.
* CI/CD using GitHub Actions.
* Production logging, health checks, and monitoring.
* Improved file storage and deployment configuration.

---

## 🎯 Project Goals

Collabrix was built to explore and apply practical full-stack development concepts, including:

* REST API design.
* Layered backend architecture.
* Authentication and authorization.
* Relational database modeling.
* Real-time communication.
* Frontend-backend integration.
* Collaborative application workflows.
* System design and production readiness.

---

## 👨‍💻 Author

**Harsh Pandey**

Third-year B.Tech Computer Science and Engineering student interested in Java backend development, full-stack engineering, Spring Boot, React, and system design.

---

## ⭐ Support

If you find Collabrix interesting, consider giving the repository a ⭐ on GitHub.

**Connect. Collaborate. Build Together.**
