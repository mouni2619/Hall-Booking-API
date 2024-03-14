# Hall Booking Application API

## Overview
The Hall Booking Application API provides endpoints for managing rooms and bookings for a hall booking application.

## Installation
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables in a `.env` file.

## Usage
1. Start the server using `npm start`.
2. Use the API endpoints to manage rooms and bookings.

## MongoDB Setup
1. Install MongoDB locally or use a cloud-based MongoDB service.
2. Create a database named `hallBookingAppDB`.
3. Create collections named `rooms` and `bookings`.
4. Set the MongoDB URI in the `.env` file.

## Acknowledgements
- Express.js
- MongoDB
- dotenv

## Additional Information
- For security reasons, do not expose your MongoDB URI in your code.
- This project is still under development. Future updates will include [list of future updates].





// Endpoint to get the basic information about the API
https://hall-booking-api-7.onrender.com/

// Endpoint to get all rooms with booking status.(/rooms)
https://hall-booking-api-7.onrender.com/rooms


// Endpoint to get all customers with their bookings(/customers)
https://hall-booking-api-7.onrender.com/customers


// Endpoint to get booking history for a specific customer(/customer/:customerName/booking-history)
https://hall-booking-api-7.onrender.com/customer/:customerName/booking-history
https://hall-booking-api-7.onrender.com/customer/John Doe/booking-history
https://hall-booking-api-7.onrender.com/customer/Bob Brown/booking-history
https://hall-booking-api-7.onrender.com/customer/Alice Smith/booking-history
