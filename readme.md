## E-commerce API
This project was created as an exam submission for Noroff Oslo (2025).  
A full-stack e-commerce solution featuring a Node.js backend with a REST API and a MySQL database. The backend provides user authentication, product management, and shopping cart, search functionality. The frontend is for users with admin role to manage products, categories, and orders. All data is stored and retrieved from a connected MySQL database.
---

**.env file example:**
- HOST=localhost
- ADMIN_USERNAME=root
- ADMIN_PASSWORD=password
- DATABASE_NAME=ecommercedb
- DIALECT=mysql
- PORT=3000
- ACCESS_TOKEN_SECRET=myTokenSecret
---

**API documentation**
- Visit http://localhost:3000/doc in your browser after running backend.
---

**Run application:**
- Back-end:
    - cd back-end
    - npm install
    - Add a `.env` file with your configuration (see example above)
    - npm start
- Front-end (new terminal): 
    - cd front-end
    - npm install
    - npm start
    - Visit `http://localhost:5000/admin` in your browser.
    - Admin login: 
        - email: 'admin@noroff.no'
        - password: 'P@ssword2023'
---

NodeJS v20.17.0
