import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI

const client = new MongoClient(uri);

let db;

app.use(express.json());


// MongoDB Connection
async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('hallBookingAppDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

// async function disconnectFromMongo() {
//   try {
//     await client.close();
//     console.log('Disconnected from MongoDB');
//   } catch (err) {
//     console.error('Failed to disconnect from MongoDB:', err);
//   }
// }

// Endpoint to get the basic information about the API
app.get("/", (req, res) => {
  res.send("<div style=background-color:#EED9C4;padding:20px;><h2 style=text-align:center;color:green>API for Hall Booking Appilication 🌐</h2><h4>💠 This code sets up a server using Express.js, a web framework for Node.js, to manage rooms and bookings for a hall booking application. It integrates with MongoDB, a NoSQL database, using the MongoDB Node.js driver. The code defines several routes to handle different functionalities:</h4><ol><li><b>🖊️POST /rooms:</b><br><br> Allows users to add new rooms to the database. Users can provide details such as room name, available seats, amenities, and price per hour. Upon successful creation, the endpoint returns a message confirming the room creation along with the ID of the new room. </li><br><li> <b>🖊️POST /bookings:</b> <br><br>Enables users to create bookings for specific rooms. Users must provide the customer's name, booking date, start time, end time, and the room ID. The endpoint checks for any conflicting bookings and, if none are found, creates a new booking and returns a success message along with the booking ID.</li><br><li><b>📖GET /rooms:</b> <br><br>Retrieves all rooms from the database and includes the booking status for each room. The booking status indicates whether a room is currently booked or available based on its bookings.</li><br><li><b>📖GET /customers:</b><br><br> Retrieves all bookings from the database and includes details such as customer name, room name, date, start time, and end time for each booking.</li><br><li><b>📖GET /customer/:customerName/booking-history:</b><br><br> Retrieves the booking history for a specific customer. It includes details such as customer name, room name, booking date, start time, end time, booking ID, booking date, booking status, and booked status for each booking associated with the customer.</li></ol><h4>💠The code also handles database connections and disconnections, as well as server startup and graceful shutdown. It uses environment variables to configure the server port and MongoDB URI, allowing for easy deployment and management. Overall, this code provides a robust API for managing rooms and bookings, essential for a hall booking application.</h4></div>");
});

// Endpoint to create a new room
app.post('/rooms', async (req, res) => {
  try {
    const { roomName, seatsAvailable, amenities, pricePerHour } = req.body;
    const newRoom = { roomName, seatsAvailable, amenities, pricePerHour, bookings: [] };
    const result = await db.collection('rooms').insertOne(newRoom);
    res.status(201).json({ message: 'Room Created', roomId: result.insertedId });
  } catch (err) {
    console.error('Error creating room:', err);
    res.status(500).json({ message: 'Failed to create room.' });
  }
});

// Endpoint to create a new booking
app.post('/bookings', async (req, res) => {
  try {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const conflictingBooking = await db.collection('bookings').findOne({
      roomId: new ObjectId(roomId),
      date,
      $or: [
        { startTime: { $lt: endTime, $gt: startTime } },
        { endTime: { $gt: startTime, $lt: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    });
    if (conflictingBooking) {
      return res.status(400).json({ message: 'Room is already booked for the given date and time' });
    }

    const newBooking = { customerName, date, startTime, endTime, roomId: new ObjectId(roomId) };
    const result = await db.collection('bookings').insertOne(newBooking);
    res.status(201).json({ message: 'Room Booked', bookingId: result.insertedId });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Endpoint to get all rooms with booking status.
app.get('/rooms', async (req, res) => {
  try {
    const rooms = await db.collection('rooms').find().toArray();
    const roomsWithBookings = await Promise.all(rooms.map(async room => {
      const bookings = await db.collection('bookings').find({ roomId: room._id }).toArray();
      return {
        roomName: room.roomName,
        bookedStatus: bookings.length > 0 ? 'Booked' : 'Available',
        bookings
      };
    }));
    res.status(200).json(roomsWithBookings);
  } catch (err) {
    console.error('Error getting rooms:', err);
    res.status(500).json({ message: 'Failed to get rooms' });
  }
});

// Endpoint to get all customers with their bookings
app.get('/customers', async (req, res) => {
    try {
      const bookings = await db.collection('bookings').aggregate([
        {
          $lookup: {
            from: 'rooms',
            localField: 'roomId',
            foreignField: '_id',
            as: 'room'
          }
        },
        {
          $unwind: '$room'
        },
        {
          $project: {
            _id: 0,
            customerName: 1,
            roomName: '$room.roomName',
            date: 1,
            startTime: 1,
            endTime: 1
          }
        }
      ]).toArray();
      res.status(200).json(bookings);
    } catch (err) {
      console.error('Error getting customers:', err);
      res.status(500).json({ message: 'Failed to get customers' });
    }
  });
 
// Endpoint to get booking history for a specific customer
app.get('/customer/:customerName/booking-history', async (req, res) => {
  try {
    const { customerName } = req.params;
    const bookings = await db.collection('bookings').aggregate([
      { $match: { customerName: customerName } },
      { $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'room'
        }
      },
      { $unwind: '$room' },
      { $project: {
          _id: 0,
          customerName: 1,
          roomName: '$room.roomName',
          date: 1,
          startTime: 1,
          endTime: 1,
          bookingId: '$_id',
          bookingDate: '$date',
          bookingStatus: '$status',
          bookedStatus: { 
            $cond: { 
              if: { 
                $gt: [ 
                  { 
                    $size: { 
                      $filter: { 
                        input: '$room.bookings',
                        as: 'booking',
                        cond: { 
                          $and: [ 
                            { $eq: ['$$booking.date', '$date'] },
                            { $or: [ 
                              { $and: [ 
                                { $gte: ['$$booking.startTime', '$startTime'] },
                                { $lt: ['$$booking.startTime', '$endTime'] }
                              ]},
                              { $and: [ 
                                { $gt: ['$$booking.startTime', '$startTime'] },
                                { $lte: ['$$booking.startTime', '$endTime'] }
                              ]},
                              { $and: [ 
                                { $lte: ['$$booking.startTime', '$startTime'] },
                                { $gte: ['$$booking.endTime', '$endTime'] }
                              ]}
                            ]}
                          ]
                        }
                      }
                    }
                  },
                  0
                ]
              },
              then: 'Booked',
              else: 'Available'
            }
          }
        }
      }
    ]).toArray();

    res.status(200).json(bookings);
  } catch (err) {
    console.error('Error getting booking history:', err);
    res.status(500).json({ message: 'Failed to get booking history' });
  }
});
   
// Start the server
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log("running port on", PORT);
  });
});

// Graceful shutdown
// process.on('SIGINT', () => {
//   disconnectFromMongo().then(() => {
//     console.log('MongoDB connection closed');
//     process.exit();
//   });
// });
