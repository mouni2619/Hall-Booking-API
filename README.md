## Hall Booking Application API

## Overview
This Hall Booking Application API sets up a server using Express.js, a web framework for Node.js, to manage rooms and bookings for a hall booking application. It integrates with MongoDB, a NoSQL database, using the MongoDB Node.js driver. The code defines several routes to handle different functionalities:

🖊️POST /rooms,🖊️POST /bookings,📖GET /rooms,📖GET /customers,📖GET /customer/:customerName/booking-history

POSTMAN DOC LINK:

🔗https://documenter.getpostman.com/view/33522302/2sA2xjzqyZ#5e725d66-e91c-434f-9a24-781628ac3097

📖GET /:

Here I provided the URL to get the basic information about the API

🔗https://hall-booking-api-7.onrender.com/

📖GET /rooms:

🔗 https://hall-booking-api-7.onrender.com/rooms/

Retrieves all rooms from the database and includes the booking status for each room. The booking status indicates whether a room is currently booked or available based on its bookings.

📖GET /customers:

🔗https://hall-booking-api-7.onrender.com/customers

Retrieves all bookings from the database and includes details such as customer name, room name, date, start time, and end time for each booking.

📖GET /customer/:customerName/booking-history:

Retrieves the booking history for a specific customer. It includes details such as customer name, room name, booking date, start time, end time, booking ID, booking date, booking status, and booked status for each booking associated with the customer.

In this URL

🔗https://hall-booking-api-7.onrender.com/customer/:customerName/booking-history

give particular :customerName and get response like below i mentioned


🔗https://hall-booking-api-7.onrender.com/customer/John%20Doe/booking-history

🔗https://hall-booking-api-7.onrender.com/customer/Bob%20Brown/booking-history

🔗https://hall-booking-api-7.onrender.com/customer/Alice%20Smith/booking-history

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
