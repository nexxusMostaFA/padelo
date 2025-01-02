## API Documentation

## Authentication API


### `POST /api/users/register`
Registers a new user and sends a verification email.
- **Body**:
  - `name` (string, required): User's full name.
  - `email` (string, required): User's email address.
  - `password` (string, required): User's password (must be strong).
  
- **Success Response**:
  - **Code**: `201`
  - **Content**:
    ```json
    {
      "message": "User registered successfully. Please verify your email to activate your account.",
      "user": {
        "id": "userId",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "isVerified": false
      }
    }
    ```

### `POST /api/users/verify_email`
Verifies a user's email using the verification code sent during registration.
- **Body**:
  - `email` (string, required): User's email address.
  - `code` (string, required): The verification code sent to the user.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "Email verified successfully",
      "token": "JWT Token"
    }
    ```

### `POST /api/users/resend_verification`
Resends the verification code to the user's email if the previous code expired or was not used.
- **Body**:
  - `email` (string, required): User's email address.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "A new verification code has been sent to your email."
    }
    ```

### `POST /api/users/login`
Logs in a user with email and password.
- **Body**:
  - `email` (string, required): User's email.
  - `password` (string, required): User's password.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "user": {
        "email": "john.doe@example.com",
        "name": "John Doe",
        "role": "user"
      },
      "token": "JWT Token"
    }
    ```

### `PATCH /api/users/reset-password/:token`
Resets the user's password using a valid reset token.
- **Params**:
  - `token` (string, required): The reset token received via email.
  
- **Body**:
  - `password` (string, required): New password.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "Password reset successfully",
      "token": "JWT Token"
    }
    ```

### `PATCH /api/users/update-image/:id`
Allows the user to upload a profile image.
- **Params**:
  - `id` (string, required): User's ID.
  
- **Body**:
  - `file` (file, required): The new profile image.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "Photo uploaded successfully",
      "user": {
        "id": "userId",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "isVerified": false
      }
    }
    ```

### `PUT /api/users/add-phone-number`
Adds or updates a user's phone number.
- **Body**:
  - `userId` (string, required): User's ID.
  - `PhoneNumber` (string, required): User's phone number.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "PhoneNumber added successfully",
      "user": {
        "id": "userId",
        "PhoneNumber": "1234567890"
      }
    }
    ```

### `PUT /api/users/change-name`
Updates the user's name.
- **Body**:
  - `userId` (string, required): User's ID.
  - `name` (string, required): New name for the user.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "Name updated successfully",
      "user": {
        "id": "userId",
        "name": "New Name"
      }
    }
    ```

### `PUT /api/users/change-email`
Updates the user's email.
- **Body**:
  - `userId` (string, required): User's ID.
  - `email` (string, required): New email for the user.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "Email updated successfully",
      "user": {
        "id": "userId",
        "email": "new.email@example.com"
      }
    }
    ```

---

# Google Authentication APIs

## Google Login
- **URL**: `/api/auth/google`
- **Method**: `GET`
- **Description**: Initiates the Google OAuth2 authentication flow.
- **Request Parameters**: None
- **Response**: Redirects the user to the Google login page.

## Google Callback
- **URL**: `/api/auth/google/callback`
- **Method**: `GET`
- **Description**: Handles the callback from Google after authentication.
  - Verifies the user and generates a JWT token.
  - If authentication fails, the user is redirected to `/login`.

- **Response (Success)**:
  ```json
  {
    "message": "Google authentication successful",
    "token": "string",
    "user": {
      "email": "string",
      "name": "string",
      "role": "string"
    }
  }
  ```

- **Response (Error)**:
  ```json
  {
    "message": "Google authentication failed",
    "error": "string"
  }
  ```
---

## Court API

### `GET /api/courts`
Gets a list of all courts.
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "courts": [
        {
          "id": "courtId",
          "name": "Court Name",
          "location": "City, Country"
        }
      ]
    }
    ```

### `GET /api/courts/search`
Search courts by name.
- **Query Parameters**:
  - `q` (string, required): Search query.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "courts": [
        {
          "id": "courtId",
          "name": "Court Name"
        }
      ]
    }
    ```

### `GET /api/courts/:id`
Get a specific court by ID.
- **Params**:
  - `id` (string, required): Court's ID.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "court": {
        "id": "courtId",
        "name": "Court Name",
        "description": "Court Description",
        "reviews": [
          {
            "user": "User Name",
            "rating": 4,
            "comment": "Great court!"
          }
        ]
      }
    }
    ```
### `POST /api/courts/reviews`
Adds a review for a court.
- **Body**:
  - `courtId` (string, required): Court's ID.
  - `userId` (string, required): User's ID.
  - `rating` (number, required): Rating from 1 to 5.
  - `comment` (string, optional): Review comment.
  
- **Success Response**:
  - **Code**: `201`
  - **Content**:
    ```json
    {
      "message": "Review added successfully!",
      "review": {
        "user": "userId",
        "rating": 4,
        "comment": "Great court!"
      }
    }
    ```

### `GET /api/courts/:id/reviews`
Gets all reviews for a specific court.
- **Params**:
  - `id` (string, required): Court's ID.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "Reviews fetched successfully!",
      "reviews": [
        {
          "user": "User Name",
          "rating": 4,
          "comment": "Great court!"
        }
      ]
    }
    ```

---

## Reservation API

### `POST /api/reservations`
Creates a new reservation.
- **Body**:
  - `user` (string, required): User's ID.
  - `court` (string, required): Court's ID.
  - `day` (string, required): Reserved day.
  - `slotNumber` (number, required): Slot number.
  
- **Success Response**:
  - **Code**: `201`
  - **Content**:
    ```json
    {
      "message": "Reservation added successfully!",
      "reservation": {
        "user": "userId",
        "court": "courtId",
        "day": "Monday",
        "slotNumber": 1
      }
    }
    ```

### `GET /api/reservations/user/:user`
Gets all reservations for a user.
- **Params**:
  - `user` (string, required): User's ID.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "reservations": [
        {
          "court": "courtId",
          "day": "Monday",
          "slotNumber": 1
        }
      ]
    }
    ```

### `GET /api/reservations/court/:courtId`
Gets all reservations for a specific court.
- **Params**:
  - `courtId` (string, required): Court's ID.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "reservations": [
        {
          "user": "userId",
          "court": "courtId",
          "status": "reserved",
          "day": "Monday",
          "slotNumber": 1
        }
      ]
    }
    ```

### `PATCH /api/reservations/:id/cancel`
Cancels a reservation.
- **Params**:
  - `id` (string, required): Reservation's ID.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "Reservation cancelled successfully!",
      "reservation": {
        "id": "reservationId",
        "status": "cancelled"
      }
    }
    ```
### `GET /api/reservations/search`
Search reservations by various parameters.
- **Query Parameters**:
  - `user` (string, optional): User's ID to filter reservations.
  - `court` (string, optional): Court's ID to filter reservations.
  - `status` (string, optional): Reservation status to filter (e.g., 'reserved', 'cancelled').
  - `day` (string, optional): Day of reservation.
  - `slotNumber` (number, optional): Slot number.
  - `page` (number, optional): Page number (default: 1).
  - `limit` (number, optional): Number of results per page (default: 10).
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "reservations": [
        {
          "court": "courtId",
          "user": "userId",
          "status": "reserved",
          "day": "Monday",
          "slotNumber": 1
        }
      ],
      "totalPages": 3,
      "currentPage": 1
    }
    ```

### `PATCH /api/reservations/:id/review`
Adds or updates a review for a completed reservation.
- **Params**:
  - `id` (string, required): Reservation's ID.
  
- **Body**:
  - `rating` (number, required): Rating from 1 to 5.
  - `comment` (string, optional): Review comment.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "Review added/updated successfully!",
      "reservation": {
        "user": "userId",
        "court": "courtId",
        "status": "completed",
        "rating": 4,
        "comment": "Great experience!"
      }
    }
    ```

### `PATCH /api/reservations/:id/complete`
Marks a reservation as completed.
- **Params**:
  - `id` (string, required): Reservation's ID.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "Reservation completed successfully!",
      "reservation": {
        "user": "userId",
        "court": "courtId",
        "status": "completed"
      }
    }
    ```


---

## Admin API

# Admin Court API

### `POST /api/admin/courts`
Adds a new court (Admin only).
- **Body**:
  - `name` (string, required): Court's name.
  - `location` (string, required): Court's location.
  - `price` (number, required): Price for the court.
  - `email` (string, optional): Contact email for the court.
  - `contactNumber` (string, optional): Contact number for the court.
  - `description` (string, optional): Description of the court.
  - `image` (file, optional): Image of the court.
  
- **Success Response**:
  - **Code**: `201`
  - **Content**:
    ```json
    {
      "message": "Court added successfully!",
      "court": {
        "id": "courtId",
        "name": "Court Name",
        "location": "City",
        "price": 50
      }
    }
    ```

### `PATCH /api/admin/courts/:id`
Updates an existing court (Admin only).
- **Params**:
  - `id` (string, required): Court's ID.
  
- **Body**:
  - Fields like `name`, `location`, `price`, etc., can be updated.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "Court updated successfully!",
      "court": {
        "id": "courtId",
        "name": "Updated Court Name"
      }
    }
    ```

### `DELETE /api/admin/courts/:id`
Deletes an existing court (Admin only).
- **Params**:
  - `id` (string, required): Court's ID.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "Court deleted successfully!"
    }
    ```

## Admin User API

### `DELETE /api/admin/users/:email`
Deletes a user by email (Admin only).
- **Params**:
  - `email` (string, required): User's email to delete.
  
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "User deleted successfully"
    }
    ```

### `GET /api/admin/users`
Gets a list of all users (Admin only).
- **Success Response**:
  - **Code**: `200`
  - **Content**:
    ```json
    {
      "message": "Users retrieved successfully",
      "users": [
        {
          "id": "userId",
          "name": "John Doe",
          "email": "john.doe@example.com"
        }
      ]
    }
    ```

