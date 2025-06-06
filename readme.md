## EP - Course Assignment Back-end
.env file example:
- HOST=localhost
- ADMIN_USERNAME=root
- ADMIN_PASSWORD=password
- DATABASE_NAME=ecommercedb
- DIALECT=mysql
- PORT=3000
- ACCESS_TOKEN_SECRET=qwepoimnbzxc
---
Run application:
- Back-end:
    - cd back-end
    - npm install
    - npm start
- Front-end (new terminal): 
    - cd front-end
    - npm install
    - npm start
---
NodeJS v20.17.0

REFERENCES
- The function generateCode in orderService.js file is created by AI.
- The bootstrap modal form used in various ejs files are based on a design given to me by AI.
- The search function in productService. The idea of adding strings to a base query based on parameters, was given by AI.
- I used ChatGPT to help me with the main structure of the swagger documentation.
- The middlware functions isAuth and errorHandler, and passwordHelper are based on code given by Nick for previous assignments.