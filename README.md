# Knowledge Showdown API

Welcome to the Knowledge Showdown API repository! This Node.js-based RESTful API, originally written in the Mars Engine (JavaScript), serves as a robust control interface for managing data within the Knowledge Showdown Database.

![Knowledge Showdown API](link-to-image)

## Table of Contents
- [Overview](#overview)
- [Setup](#setup)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

The Knowledge Showdown API enables seamless communication with the Knowledge Showdown Database, allowing you to efficiently control and manipulate data related to avatars, countries, average scores, categories, questions, users, games, responses, answers, roles, and permissions. The API is designed to facilitate the integration of the Knowledge Showdown system into your applications.

## Setup

To set up the Knowledge Showdown API on your local machine, follow these steps:

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.
4. Configure the API settings in the `config.js` file.
5. Start the API server: `npm start`.

## Usage

The Knowledge Showdown API provides a set of powerful endpoints to interact with the Knowledge Showdown Database. Familiarize yourself with the API's capabilities to seamlessly integrate it into your applications.

## Endpoints

### Avatars
- `GET /avatars`: Retrieve avatar images and associated data.

### Countries
- `GET /countries`: Retrieve information about countries.

### Average Scores
- `GET /average-scores`: Retrieve average scores data.

### Categories Questions
- `GET /categories-questions`: Retrieve data connecting categories and questions.

### Users
- `GET /users`: Retrieve information about users, including unique IDs, names, and contact details.
- `POST /users`: Create a new user.
- `PUT /users/:id`: Update user information.
- `DELETE /users/:id`: Delete a user.

### Categories
- `GET /categories`: Retrieve information about knowledge categories.

### Questions
- `GET /questions`: Retrieve details about questions, including question IDs and text.

### Games
- `GET /games`: Retrieve information about games and their details.
- `POST /games`: Create a new game.
- `PUT /games/:id`: Update game information.
- `DELETE /games/:id`: Delete a game.

### Responses
- `GET /responses`: Retrieve responses to questions.

### Answers
- `GET /answers`: Retrieve information about answers to questions.

### Users Roles
- `GET /users-roles`: Retrieve data connecting users and roles.

### Games Questions
- `GET /games-questions`: Retrieve data connecting games and questions.

### Roles Permissions
- `GET /roles-permissions`: Retrieve data connecting roles and permissions.

### Roles
- `GET /roles`: Retrieve information about user roles.

### Users Permissions
- `GET /users-permissions`: Retrieve data connecting users and permissions.

### Permissions
- `GET /permissions`: Retrieve information about user permissions.

## Contributing

Contributions to the Knowledge Showdown API project are welcome. Follow these guidelines:

1. Fork the repository and create your branch: `git checkout -b your-branch-name`.
2. Make changes following the project's coding conventions.
3. Test your changes thoroughly to ensure they don't introduce any issues.
4. Commit your changes: `git commit -m "Your commit message"`.
5. Push to the branch: `git push origin your-branch-name`.
6. Open a pull request, describing your changes and their purpose.

## License

The Knowledge Showdown API project is released under the MIT License. You are free to use, modify, and distribute the code according to the terms of the license.

## Contact

If you have any questions, suggestions, or feedback, please feel free to reach out by opening an issue on the repository.

Thank you for your interest in the Knowledge Showdown API project. We hope it proves to be a valuable resource for implementing the API component of your knowledge showdown system!