
# Email Verification and Authentication System

## Overview
This is a mini-project focused on creating a secure email verification system. The project sends a verification code to users via email, allowing them to confirm their identity before proceeding. It leverages a modern tech stack for both backend and frontend to ensure security, scalability, and user experience.

## Features
- Email Verification: Users receive a unique code via email to verify their identity.
- Secure Authentication: User passwords are hashed using bcryptjs to ensure secure storage.
- Token-Based Authentication: JWTs (JSON Web Tokens) are used for managing user sessions.
- Cross-Origin Resource Sharing (CORS): Handles secure communication between frontend and backend.
- Environment Configuration: Sensitive credentials are stored securely using environment variables.


## How It Works
1. User Registration: User signs up with an email and password.
2. Email Verification: A verification code is sent to the user’s email. The user must enter this code to verify their email.
3. Authentication: Once verified, the user can log in using their credentials, and a JWT token is issued for session management.
4. Protected Routes: The frontend uses react-router-dom to protect routes, ensuring only authenticated users can access certain pages.
