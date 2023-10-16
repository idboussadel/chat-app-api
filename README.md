# Chat Application API Documentation

## Introduction

Welcome to the documentation for the Chat Application API. This API facilitates real-time communication between users, enabling them to send messages, create chats, and retrieve chat history.

## Authentication

### Sign Up [/signup]

**POST**
- Sign up a new user.
- **Parameters**
  - `username` (string, required): The username of the new user.
  - `email` (string, required): The email of the new user.
  - `password` (string, required): The password of the new user.
  - `passwordConfirm` (string, required): Confirmation of the password.

### Login [/login]

**POST**
- Log in an existing user.
- **Parameters**
  - `email` (string, required): The email of the user.
  - `password` (string, required): The password of the user.

### Protect [/protect]

**Middleware**
- Protects routes, requiring a valid JWT token for access.

## User Operations

### Get All Users [/all]

**GET**
- Retrieve a list of all users.

### Get User by ID [/:userId]

**GET**
- Retrieve user information by user ID.
- **Parameters**
  - `userId` (string, required): The ID of the user.

## Chat Operations

### Post Chat [/:senderId/:receiverId]

**POST**
- Create a new chat between two users.
- **Parameters**
  - `senderId` (string, required): The ID of the sender user.
  - `receiverId` (string, required): The ID of the receiver user.

### Get Chat [/:firstId/:secondId]

**GET**
- Retrieve chat information between two users.
- **Parameters**
  - `firstId` (string, required): The ID of the first user.
  - `secondId` (string, required): The ID of the second user.

### Get All Chats [/:userId]

**GET**
- Retrieve all chats for a specific user.
- **Parameters**
  - `userId` (string, required): The ID of the user.

## Message Operations

### Post Message [/messages]

**POST**
- Send a new message.
- **Parameters**
  - `chatId` (string, required): The ID of the chat.
  - `senderId` (string, required): The ID of the message sender.
  - `text` (string, required): The text content of the message.

### Get Messages [/messages/:chatId]

**GET**
- Retrieve all messages for a specific chat.
- **Parameters**
  - `chatId` (string, required): The ID of the chat.

## Error Handling

- Custom error handling is implemented to provide meaningful error messages.
- Detailed error messages are returned in case of invalid requests.

## WebSockets

### Socket Events

- **new-user-add**: Add a new user to the active users list.
- **get-users**: Retrieve the list of active users.
- **disconnect**: Remove a user from the active users list when disconnected.
- **send-message**: Send a message to a specific user.
- **receive-message**: Receive a message from another user.
