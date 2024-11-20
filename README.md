# Media Scraper Project

This project is a media scraper application with a **frontend** (built using Next.js), a **backend** (built using Node.js), and a **PostgreSQL database** for data storage. The application is fully containerized using Docker for easy setup and deployment.

---

## **Features**
1. Scrapes images and videos from provided URLs.
2. Stores media in a PostgreSQL database.
3. Provides a user interface to view the scraped media.
4. Fully Dockerized for ease of setup.

---

## **Prerequisites**
Ensure the following tools are installed on your system:
- **Docker**: [Download and Install Docker](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Comes bundled with Docker Desktop.

---

## **Setup Instructions**

### **1. Clone the Repository**
Clone the project repository to your local machine:
```bash
git clone <repository-url>
cd <repository-folder>
```

### **2. Ensure Docker is Running**
Start Docker on your system and verify installation:

```bash
docker --version
docker-compose --version
```

### **3. Build and Run the Project**
Run the following command to build and start all services (frontend, backend, and database):

```bash
docker-compose up --build
```


### **4. Access the Application**
Once the services are running:
- **Frontend**:  http://localhost:3000
- **Backend**:  http://localhost:4000
- **Database**: Host: ```localhost```, Port: ```5432```, Username: ```media_user```, Password: ```media_password```, Database: ```media_db```


### **5. Stop the Services**
To stop all running services, use:

```bash
docker-compose down
```

