# Note Taking API

## Overview

This is a note-taking REST API for teams. Users can create notes, organize them by teams, and manage team memberships.

## Tech Stack

Node.js, Express, SQLite, better-sqlite3, Jest, Supertest

## Setup

```
npm install
npm run seed
npm start
```

## Environment

This project uses SQLite as a local database. The app creates a local file called `notes.db` when the server starts.

## Database Design

A user can create many notes.
A note is created by one user.

A team can have many notes.
A note belongs to one team.

A user can belong to many teams.
A team can have many users.
(This relationship is represented by team_members)

A user can only create notes for teams they are a member of.

## API Endpoints

Base URL:

```
http://localhost:3000
```

### Health

| Method | Endpoint  | Description                   |
| ------ | --------- | ----------------------------- |
| GET    | `/health` | Check that the API is running |

### Users

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/users`               | Get all users            |
| GET    | `/users/:id`           | Get one user by ID       |
| POST   | `/users`               | Create a user            |
| PUT    | `/users/:id`           | Update a user            |
| DELETE | `/users/:id`           | Delete a user            |
| GET    | `/users/:userId/teams` | Get all teams for a user |

Create or update user body:

```json
{
  "name": "Daroush",
  "email": "daroush@example.com"
}
```

### Teams

| Method | Endpoint     | Description        |
| ------ | ------------ | ------------------ |
| GET    | `/teams`     | Get all teams      |
| GET    | `/teams/:id` | Get one team by ID |
| POST   | `/teams`     | Create a team      |
| PUT    | `/teams/:id` | Update a team      |
| DELETE | `/teams/:id` | Delete a team      |

Create or update team body:

```json
{
  "name": "Engineering"
}
```

### Team Members

| Method | Endpoint                         | Description                |
| ------ | -------------------------------- | -------------------------- |
| POST   | `/teams/:teamId/members`         | Add a user to a team       |
| GET    | `/teams/:teamId/members`         | Get all members for a team |
| GET    | `/teams/:teamId/members/:userId` | Get one team member        |
| PUT    | `/teams/:teamId/members/:userId` | Update a member role       |
| DELETE | `/teams/:teamId/members/:userId` | Remove a user from a team  |

Add member body:

```json
{
  "userId": 1,
  "role": "member"
}
```

Allowed roles:

```txt
owner, admin, member
```

If `role` is not provided when adding a member, it defaults to `member`.

Update member role body:

```json
{
  "role": "admin"
}
```

### Notes

| Method | Endpoint     | Description                                    |
| ------ | ------------ | ---------------------------------------------- |
| GET    | `/notes`     | Get notes with pagination, sorting, and search |
| GET    | `/notes/:id` | Get one note by ID                             |
| POST   | `/notes`     | Create a note                                  |
| PUT    | `/notes/:id` | Update a note                                  |
| DELETE | `/notes/:id` | Delete a note                                  |

Get notes query parameters:

| Query    | Default | Description                                |
| -------- | ------- | ------------------------------------------ |
| `page`   | `1`     | Page number                                |
| `limit`  | `10`    | Number of notes per page                   |
| `sort`   | `desc`  | Sort by note ID. Use `asc` or `desc`       |
| `search` | empty   | Search text found in note title or content |

Example:

```txt
GET /notes?page=1&limit=5&sort=asc&search=launch
```

Response shape:

```json
{
  "page": 1,
  "limit": 5,
  "sort": "asc",
  "search": "launch",
  "data": []
}
```

Create note body:

```json
{
  "user_id": 1,
  "team_id": 1,
  "title": "Sprint planning",
  "content": "Review priorities and blockers."
}
```

Update note body:

```json
{
  "title": "Updated note",
  "content": "Updated note content."
}
```

A user can only create notes for teams they are a member of. If the user is not a member of the team, the API returns `403 Forbidden`.

## Testing

`npm run test`

## Design Decisions

I used SQLite because it is simple to set up and allows the project to run locally without requiring an external database server. This keeps the application easy to install, run, and test.

I chose Node.js because it is well-suited for building lightweight REST APIs quickly. It allowed me to focus on clean application structure, database modeling, and testability.

## Production Considerations

If I had more time, I would add authentication and authorization to demonstrate functionality for different roles. For example, admins can add and delete members on their team. Another improvement is to add note visibility that allows users to make their notes private or shareable with the team.
