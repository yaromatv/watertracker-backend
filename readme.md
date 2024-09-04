# WaterTracker Backend

<img src="https://res.cloudinary.com/doj55bihz/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1704651372/img/Logo-890d13ba_to7trg.jpg?_s=public-apps" alt="Logo">

Node.js server for the [WaterTracker](https://anzhela-ostrovska1.github.io/goit-group2-react-nodejs/) || [GitHub](https://github.com/Anzhela-Ostrovska1/WaterTracker)

WaterTracker is a application that allows the user to monitor their daily water consumption.

## Table of Content

- [Routing](#routing)
- [Features](#features)
- [Getting Started](#getting-started)
- [Technologies and packages Used](#technologies-and-packages-used)
- [Contributors](#contributors)

## Routing

### Auth Routes

- `POST /api/auth/register`: Registration user
- `POST /api/auth/login`: Login user
- `POST /api/auth/logout`: Logout user

### User Routes

- `GET /api/user/current`: Get current user information
- `PATCH /api/user/current`: Change user information
- `PATCH /api/user/rate`: Update user water rate

### Water Routes

- `GET /api/water`: Get list of consumed water
- `POST /api/water`: Add water value
- `PUT /api/water/{id}`: Update water value
- `DELETE /api/water/{id}`: Delete water value
- `GET /api/water/today`: Get list of water consumed today
- `GET /api/water/month`: Get list of water consumed this month


## Features

- User registration, authorization and logout
- Editting user data (avatar, name, email, password)
- Changing the calculation of the daily rate of water consumption
- Adding, update, delete a record of consumed water
- Calculating the amount of water for the current day or the selected month

## Getting Started

1. Clone the repo: `git clone https://github.com/yaromatv/watertracker-backend.git`
2. Install dependencies: `npm install`
3. Start the server: `npm start`

## Technologies and packages Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Bcrypt
- Dotenv
- CORS
- Nodemon
- Cloudinary
- Streamifier
- Cross-env
- Joi
- Morgan
- Multer
- Nanoid
- Swagger-ui-express

## Contributors

- Yaroslav Matvieiev [GitHub](https://github.com/yaromatv) || [LinkedIn](https://www.linkedin.com/in/yaroslavmatvieiev/)
- Ihor Berezhnyi [GitHub](https://github.com/iberezhnyi)
- Nina Raschupkina [GitHub](https://github.com/Ninel35)
- Olena Horodiuk [GitHub](https://github.com/OlenaUser1982)
