const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const path = require('path');
const multer = require('multer');
const fs = require('fs'); //filesystem required to rename photo files
const Review = require('./models/Review.js');
const ChatModel = require('./models/ChatModel.js');
const Message = require('./models/Message.js');
const UserPlaceModel = require('./models/UserPlace.js');
const UserTopModel = require('./models/UserTop.js');
// const { default: Chat } = require('../client/src/pages/Chat.jsx');


require('dotenv').config()

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'randomstringhere';

//middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads')); //defining that everything that is inside /uploads should be displayed in the browser

// app.use(cors({
//     credentials: true,
//     origin: 'http://127.0.0.1:5173',
// }));

// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });


app.use((req, res, next) => {
    const allowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:4000', 'http://localhost:4000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    return next();
  });

// testing if it works
// console.log(process.env.MONGO_URL)

// connecting to database
mongoose.connect(process.env.MONGO_URL);

// function getUserDataFromReq(req){
//     return new Promise((resolve, reject) => {
//         jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
//             if (err) throw err;
//             resolve(userData);
//         });
//     }); 
// }

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
      const token = req.cookies.token;
  
      if (!token) {
        // If token is not provided, resolve with null user data
        resolve(null);
      } else {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
          if (err) {
            // If error occurred during verification, reject the promise with the error
            resolve(null);
          } else {
            // Resolve with the user data
            resolve(userData);
          }
        });
      }
    });
  }
  

app.get('/test', (req, res)=>{
    res.json('test ok');
});

app.post('/register', async (req, res)=>{
    const {username, password, passwordConfirmation, name, surname, email, tel, role} = req.body;
  
    try {
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password, bcryptSalt),
            passwordConfirmation:bcrypt.hashSync(password, bcryptSalt),
            name,
            surname,
            email,
            tel,
            role,
            isPendingApproval: role === 'host',
        });

        // if (userDoc.isPendingApproval) {
        //     alert('Your registration is pending approval.');
        // }

        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {email, password} = req.body;
    const userDoc = await User.findOne({email}); //User.findOne({username:username}) but because those two are the same it can be writen as ({username})
    if (userDoc) { //if userDoc is not null
        // res.json('found');
        // create a jwt and respond with a cookia and encrypted username
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({
                email:userDoc.email, 
                id:userDoc._id, 
                username:userDoc.username
            }, jwtSecret, {}, (err,token) => {
                if (err) throw err;
                //otherwise
                res.cookie('token', token).json(userDoc); //cookie(name, value). We get TOKEN from jwt.sign
            }); //3rd param: options, 4th param: using callback instead of await
            
        } else {
            res.status(422).json('pass not ok');
        }
    } else {
        res.json('not found');
    }
})

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const {username, email, _id} = await User.findById(userData.id);
            res.json({username, email, _id});
        });
    } else {
        res.json(null);
    }
})

app.post('/logout', (req, res)=>{
    res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req,res)=>{
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    const destinationPath = path.join(__dirname, 'uploads', newName);
    await imageDownloader.image({
        url: link,
        dest: destinationPath,
    });
    res.json(newName);
})

const photosMiddleware = multer({dest:'uploads'});
// I've set 'photos' in PlacesPage: data.set('photos', files);
// 100 = maximum photos accepted
app.post('/upload', photosMiddleware.array('photos', 100), (req,res)=>{
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const {path, originalname} = req.files[i]; //path & originalname are propertiese of the file, can finds them in 'network>preview'
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/',''));
    }
    res.json(uploadedFiles);
});

app.post('/places', (req,res) => {
    const {token} = req.cookies;
    const {
        title, address, addedPhotos, description,
        houseRules, minimumLengthStay, checkIn,
        checkOut, maxGuests, bedsNumber, bathroomsNumber,
        bedroomsNumber, squareMeters, spaceType, price,
     } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        //in the app.get('/profile') we have : 
        //const {username, email, _id} = await User.findById(userData.id);
        
        //new input
        const user = await User.findById(userData.id); // Retrieve the user object from the database
        //new input
        
        const placeDoc = await Place.create({
            owner:user,
            title, address, photos:addedPhotos, description,
            houseRules, minimumLengthStay, checkIn,
            checkOut, maxGuests, bedsNumber, bathroomsNumber,
            bedroomsNumber, squareMeters, spaceType, price,
        });
        res.json(placeDoc);
     }); 
});

app.get('/user-places', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const {id} = userData;
        res.json( await Place.find({owner:id}) );
    });
        
});

app.get('/places/:id', async (req,res) => {

    const {id} = req.params;
    //new input
    const place = await Place.findById(id).populate('owner', 'username');
    // Check if the user is a registered one
    if (req.cookies.token) {
        try {
        const userData = await getUserDataFromReq(req);
        const userId = userData.id;

        const placeOwnerId = place.owner._id.toString();
        
        if (userId === placeOwnerId) {
            // Return the place data without creating or updating the UserPlace vector
            // console.log("registered user is also the owner of this place");
            // console.log(place.owner._id);
            return res.json(place);
        }

        // Create or update the UserPlace schema
        const userPlace = await UserPlaceModel.findOneAndUpdate(
            //searching for a document with a matching userId and placeId
            { userId, placeId: id },
            // This is the update object that specifies the new values for the document. 
            // It sets the userId, placeId, and clicked fields to the provided values.
            { userId, placeId: id, navigated: true },
            //  options for the findOneAndUpdate method:
            // 1) upsert: true means that if no document is found matching the filter, 
            // a new document will be created using the update object.
            // 2) new: true specifies that the updated document should be returned 
            // as the result of the findOneAndUpdate operation.
            { upsert: true, new: true }
        );

        if (userPlace && !userPlace.booked && userPlace.rating === null) {
            userPlace.rating = 2;
            await userPlace.save();
          }
        // console.log('UserPlace created/updated:', userPlace);
        } catch (err) {
        console.error('Error retrieving user data:', err);
        }
  }
  else {
    // console.log('User not registered');
  }
  
    res.json(place);
    //new input
    // res.json(await Place.findById(id));
});

// app.get('/places/:id', async (req,res) => {
//     const {id} = req.params;

//     //new input
//     const place = await Place.findById(id).populate('owner', 'username');
//   res.json(place);
//     //new input
//     // res.json(await Place.findById(id));
// });



//all places are public available, so no need to ensure that only owner can see them
app.put('/places', async (req, res) => {
    const {token} = req.cookies;
    const {
        id, title, address, addedPhotos, description,
        houseRules, minimumLengthStay, checkIn,
        checkOut, maxGuests, bedsNumber, bathroomsNumber,
        bedroomsNumber, squareMeters, spaceType, price,
     } = req.body;
     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos:addedPhotos, description,
                houseRules, minimumLengthStay, checkIn,
                checkOut, maxGuests, bedsNumber, bathroomsNumber,
                bedroomsNumber, squareMeters, spaceType, price,
            });
            await placeDoc.save();
            res.json('ok');
        }
     });
});


app.get('/places', async (req,res) => {
   res.json( await Place.find() ); 
})

app.post('/bookings', async (req,res) => {
   const userData = await getUserDataFromReq(req);
   const {place, checkIn, checkOut, numberOfGuests, price,} = req.body;
   Booking.create({
    place, 
    checkIn, 
    checkOut, 
    numberOfGuests, 
    user:userData.id, 
    price,
   }).then(async (booking) => {
    // Update the UserPlace vector to set "booked" as true
    const userPlace = await UserPlaceModel.findOneAndUpdate(
        { userId: userData.id, placeId: place },
        { userId: userData.id, placeId: place, booked: true, rating: 5},
        { upsert: true, new: true }
    );

    res.json(booking);

   }).catch((err) => {
    throw err;
   });
});

// app.post('/bookings', async (req,res) => {
//     const userData = await getUserDataFromReq(req);
//     const {place, checkIn, checkOut, numberOfGuests, price,} = req.body;
//     Booking.create({
//      place, 
//      checkIn, 
//      checkOut, 
//      numberOfGuests, 
//      user:userData.id, 
//      price,
//     }).then((doc) => {
//      res.json(doc);
//     }).catch((err) => {
//      throw err;
//     });
//  });


//bookings are private so first will grab the token
app.get('/bookings', async (req,res) => {
    const userData = await getUserDataFromReq(req);
    res.json( await Booking.find({user:userData.id}).populate('place'));
});


//new input
app.get('/bookings/:id', async (req,res) => {
    const {id} = req.params;
    const booking = await Booking.findById(id).populate('place');
  res.json(booking);
  
});
//new input


app.post('/reviews', async (req,res) => {
    const {token} = req.cookies;
    const {
        hostRating, 
        hostComment, 
        placeRating, 
        placeComment, 
        date, 
        placeId
     } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        
        const user = await User.findById(userData.id); // Retrieve the user object from the database
        
        const reviewDoc = await Review.create({
            place_id:placeId,
            guest_id:user,
            hostRating, 
            hostComment, 
            placeRating, 
            placeComment, 
            date,
        });

        // Update the UserPlace vector to set the 'rating' value
        const userPlace = await UserPlaceModel.findOneAndUpdate(
            { userId: userData.id, placeId },
            { userId: userData.id, placeId, rating: placeRating },
            { upsert: true, new: true }
        );

        res.json(reviewDoc);
     }); 
});

// app.put('/reviews', async (req, res) => {
//     const {token} = req.cookies;
//     const {
//         id, hostRating, hostComment, placeRating, placeComment, date,
//      } = req.body;
//      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//         if (err) throw err;
//         const reviewDoc = await Review.findById(id);
//         if (userData.id === reviewDoc.guest_id.toString()) {
//             reviewDoc.set({
//                 hostRating, 
//                 hostComment, 
//                 placeRating, 
//                 placeComment, 
//                 date,
//             });
//             await reviewDoc.save();
//             res.json('ok');
//         }
//      });
// });


app.get('/reviews', async (req,res) => {
    const { place_id } = req.query;
    const reviews = await Review.find({ place_id });
    // console.log(reviews);
    res.json(reviews); 
 })

 app.get('/users', async (req, res) => {
    const { ids } = req.query;
    const users = await User.find({ _id: { $in: ids } });
    res.json(users);
  });

 app.get('/all-users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
      } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
 }) 

 app.get('/all-places', async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);
    } catch (error) {
        console.error('Error retrieving places:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
 })

 app.get('/all-bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        console.error('Error retrieving bookings:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
 })

 app.get('/all-reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
 })

 app.get('/searchPlaces', async (req, res) => {
    try{
        const { address, checkIn, checkOut } = req.query;
        const places = await Place.find({ address: { $regex: address, $options: 'i' } })
        .populate('owner', 'username')
        .exec();

        if (checkIn && checkOut) {
            const filteredPlaces = [];

            for (const place of places) {
                const bookings = await Booking.find({place: place._id}).exec();

                let isAvailable = true;
                for (const booking of bookings) {
                    const H_checkIn = new Date(checkIn);
                    const H_checkOut = new Date(checkOut);
                    const B_checkIn = new Date(booking.checkIn);
                    const B_checkOut = new Date(booking.checkOut);

                    if (
                        // (H_checkIn >= B_checkIn && H_checkIn <= B_checkOut) &&
                        // (H_checkOut >= B_checkIn && H_checkOut < B_checkOut)
                        (H_checkIn >= B_checkIn && H_checkIn < B_checkOut) ||
                        (H_checkOut > B_checkIn && H_checkOut <= B_checkOut) ||
                        (H_checkIn <= B_checkIn && H_checkOut >= B_checkOut)
                    ){
                        isAvailable = false;
                        break;
                    }
                }

                if (isAvailable) {
                    filteredPlaces.push(place);

                    const userData = await getUserDataFromReq(req);

                    // console.log('userData.id:', userData.id.toString());
                    // console.log('place.owner:', place.owner._id.toString());
                    
                    if(userData && userData.id.toString() !== place.owner._id.toString()){
  

                        // Update the UserPlace vector to set the 'searched' value
                        const userPlace = await UserPlaceModel.findOneAndUpdate(
                            { userId: userData.id, placeId: place._id, booked: false, rating: null },
                            { userId: userData.id, placeId: place._id, searched: true, rating: 2 },
                            { upsert: true, new: true }
                    );
                    }  
                }
            }

            res.json(filteredPlaces);
        } else {
            res.json(places);
        }
        // res.json(places);
    } catch (error) {
        console.error("Error searching places:", error);
        res.status(500).json({error: "An error occurred while searching for places"});

    }
 });

// creating or fetching 1-1 chat
app.post('/accessChat', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    // const currentUserId = userData.id;

    const { userId } = req.body; //the userId that we provided, not of the current user
    // if a chat with that userId exists return it, otherwise create it
    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await ChatModel.find({
        //trying to find both users: the current user that is logged in and the userId that we provided
        $and: [ //both of these conditions should be satisfied for chat to exist 
            { users: { $elemMatch: { $eq:userData.id} } }, //current user that is logged in
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password").populate("latestMessage"); // return everything except for password

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email", //or username instead
    });

    // checking if the chat exists
    if(isChat.length>0){
        res.send(isChat[0]); //only one result, because no other chat can exist with these two users
    } else { // if it doesn't exist, it is created
        var chatData = {
            chatName: "sender",
            users: [userData.id, userId],
        };

        try {
            const createdChat = await ChatModel.create(chatData);

            // take that chat and send it to the user
            // finding the chat with the id of the createdChat
            const FullChat = await ChatModel.findOne({ _id: createdChat._id }).populate("users", "-password");

            res.status(200).send(FullChat);

        } catch (error) {
            res.status(400);
            throw new Error(error.message);

        }
    }

});

app.get('/fetchChats', async (req, res) => {
    try {
        // returning all the chats the user is a part of
        ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("latestMessage")
            .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name email",
            });
            res.status(200).send(results);
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

app.post('/sendMessage', async (req, res) => {

    const { content, chatId} = req.body;

    const userData = await getUserDataFromReq(req);
    // const currentUserId = userData.id;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: userData.id,
        content: content,
        chat: chatId
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name"); //execPopulate because we populate the instance of mongoose class
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email",
        });

        // find by id and update the latest message
        await ChatModel.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        })

        res.json(message);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

});

app.get('/allMessages/:chatId', async (req, res) => {
    try {
        const messages = await Message.find({chat:req.params.chatId})
        .populate("sender", "name email")
        .populate("chat");

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Recommendation system

// Helper function to transpose a matrix
function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function dotProduct(a, b) {
    let product = 0;
    for (let i = 0; i < a.length; i++) {
        product += a[i] * b[i];
    }
    return product;
}

function matrixFactorisation(
    Ratings, features = 2, 
    epochs = 4000, learningRate = 0.01, 
    weightDecay = 0.0002, verbose = true) {

    const lenRatings = Ratings.length;
    const lenItems = Ratings[0].length;

    // initialization of the elements of the User and Item features matrices
    let UserFeatures = [];
    let ItemFeatures = [];
    
    for (let i = 0; i < lenRatings; i++) {
        UserFeatures.push(new Array(features).fill(0));
    }
    for (let i = 0; i < lenItems; i++) {
        ItemFeatures.push(new Array(features).fill(0));
    }

    for (let i = 0; i < lenRatings; i++) {
        for (let j = 0; j < features; j++) {
            UserFeatures[i][j] = Math.random() * 0.15;
        }
    }
    for (let i = 0; i < lenItems; i++) {
        for (let j = 0; j < features; j++) {
            ItemFeatures[i][j] = Math.random() * 0.15;
        }
    }
    ItemFeatures = transpose(ItemFeatures);

    let bestRMSE = Infinity;

    const invariant = learningRate * weightDecay;
    const normaliz = weightDecay / 2;

        
    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let i = 0; i < lenRatings; i++) {
            for (let j = 0; j < lenItems; j++) {
                // Only if it is a known element i.e. greater than zero
                if (Ratings[i][j] > 0) {
                    // Prediction is the dot product
                    const prediction = dotProduct(UserFeatures[i], ItemFeatures[j]);
                    
                    // Compute the error
                    const error = Ratings[i][j] - prediction;
                    
                    // Compute the gradient of error squared and update the
                    // features with regularization to prevent large weights
                    for (let w = 0; w < features; w++) {
                        UserFeatures[i][w] += 2 * learningRate * error * ItemFeatures[j][w] - invariant * UserFeatures[i][w];
                        ItemFeatures[j][w] += 2 * learningRate * error * UserFeatures[i][w] - invariant * ItemFeatures[j][w];
                    }
                }
            }
        }
        
        // Calculate the RMSE
        let MSE = 0;
        let count = 0;
        for (let i = 0; i < lenRatings; i++) {
            for (let j = 0; j < lenItems; j++) {
                if (Ratings[i][j] > 0) {
                    count++;
                    // Loss function error sum
                    MSE += Math.pow(Ratings[i][j] - dotProduct(UserFeatures[i], ItemFeatures[j]), 2);
                    // Regularization
                    for (let w = 0; w < features; w++) {
                        MSE += normaliz * (Math.pow(UserFeatures[i][w], 2) + Math.pow(ItemFeatures[j][w], 2));
                    }
                }
            }
        }
        
        const RMSE = Math.sqrt(MSE / count);
        
        if (verbose) {
        console.log("Epoch: ", epoch, "\nRMSE: ", RMSE, "\n__________________________\n");
        }
        
        // Stopping Condition
        if (RMSE > bestRMSE) {
            break;
        }
        
       bestRMSE = RMSE;
    }
        
    const MatrixReversi = dotProduct(UserFeatures, ItemFeatures);
        
    return MatrixReversi;
}

app.get('/recommendations', async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({});
      
        // Fetch all places from the database
        const items = await Place.find({});
      
        // Fetch all userplaces from the database
        const userPlaces = await UserPlaceModel.find({});

        // Dictionary
        const userIDs = {};
        let i = 0;
        for (const user of users) {
            userIDs[user[0]] = i;
            i++;
        }

        // Keep id 
        const itemIDs = {};
        const itemList = [];
        // const available = [];
        i = 0;
        for (const item of items) {
            itemIDs[item[0]] = i;
            itemList.push(item[0]);
            // available.push(item[12]);
            i++;
        }

        // Initialisation of the Ratings Matrix
        const Ratings = Array.from({ length: users.length }, () => Array(items.length).fill(0));
        
         // Add the Ratings that come from the user history
         for (const userPlace of userPlaces) {
          const row = userIDs[userPlace.userId];
          const column = itemIDs[userPlace.placeId];
          Ratings[row][column] = userPlace.rating;
         }
        
         // Calculate the predicted ratings for unknown elements
         const PredictedRatings = matrixFactorisation(Ratings, true);
        
         for (let i = 0; i < users.length; i++) {
          for (let j = 0; j < items.length; j++) {
           // Only keep the Unknown elements and those that are not theirs
           if (Ratings[i][j] > 0 || items[j].owner.toString() === users[i]._id.toString()) {
            // By making the known in predicted 0
            PredictedRatings[i][j] = 0;
           }
          }
         }
        
         let top = 6;
        
         // If the item pool is less than 6 keep just the top len
         if (itemList.length < 6) {
          top = itemList.length;
         }

         // Remove past recommendations
         await UserTopModel.deleteMany({});

            if (err) throw err;

            for (const userID in userIDs) {
                if (Object.hasOwnProperty.call(userIDs, userID)) {
                    const userIndex = userIDs[userID];
                        
                    // Get their top recommendations
                    const myPersonalRecommendations = PredictedRatings[userIndex]
                        .map((_, i) => i)
                        .sort((a, b) => PredictedRatings[userIndex][b] - PredictedRatings[userIndex][a])
                        .slice(0, top);
                        
                    // Fill the remaining slots with zeroes if necessary
                    if (itemList.length < 6) {
                        for (let i = 0; i < 6 - itemList.length; i++) {
                            myPersonalRecommendations.push(0);
                        }
                    }
                        
                    const recommendations = myPersonalRecommendations.map(index => itemList[index]);
                    await UserTopModel.create({
                        p1: recommendations[0],
                        p2: recommendations[1],
                        p3: recommendations[2],
                        p4: recommendations[3],
                        p5: recommendations[4],
                        p6: recommendations[5],
                        UserId: user._id
                    });
                }
            }
        


      } catch (error) {
        console.error('Error fetching data:', error);
      }
})

// app.get('/recommendations', async (req, res) => {
//     try {
//         function randomInitialization(rows, cols, distribution) {
//             const matrix = [];
//             for (let i = 0; i < rows; i++) {
//               const row = [];
//               for (let j = 0; j < cols; j++) {
//                 // Generate a random value based on the specified distribution
//                 const value = distribution();
//                 row.push(value);
//               }
//               matrix.push(row);
//             }
//             return matrix;
//           }

//         function multiplyMatrices(a, b) {
//             const rowsA = a.length;
//             const colsA = a[0].length;
//             const colsB = b[0].length;

//             const result = [];

//             for (let i = 0; i < rowsA; i++) {
//                 result[i] = [];
//                 for (let j = 0; j < colsB; j++) {
//                 result[i][j] = 0;
//                 for (let k = 0; k < colsA; k++) {
//                     result[i][j] += a[i][k] * b[k][j];
//                 }
//                 }
//             }

//             return result;
//         }
    
//         const K = 2; // Number of latent dimensions based on the desired number of latent factors: budget preference, location preference, property type)
        
//         let F;
//         let V;

       
//         // Initializing F matrix (K x N-users)
//         try{
//             // Fetch all users from the database
//             const users = await User.find({});
//             const N = users.length; // Number of users
    
//             F = randomInitialization(K, N, () => Math.random() * 0.15);
    
//             console.log('F matrix (K x N-users) initialized randomly successfully.');
    
//         } catch (error) {
//             console.error('Error initializing F matrix: ', error);
//         }
    
//         // Initializing V matrix (M-places x K)
//         try{
//             // Fetch all places from the database
//             const places = await Place.find({});
//             const M = places.length; // Number of places
    
//             // // Random initialization of matrix V (MxK)
//             V = randomInitialization(M, K, () => Math.random() * 0.15);
//             // V = randomInitialization(M, K, () => Math.floor(Math.random() * 5) + 1);
//             console.log('V matrix (M-places x K) initialized randomly successfully.');
    
//         } catch (error) {
//             console.error('Error initializing V matrix: ', error);
//         }

//         const X = multiplyMatrices(V, F);

//         if (X) {
//             console.log("multiplied matrices");
//             console.log('X matrix: ', X);
//         }

//         //res.json();
//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message);
//     }
// });

// UserPlaceModel.find({})
//   .then(async (userPlaces) => {
//     for (const userPlace of userPlaces) {
//       // Check if navigated or searched is true and booked is false
//       if ((userPlace.navigated || userPlace.searched) && !userPlace.booked) {
//         // If rating is null, set it to 2
//         if (userPlace.rating === null) {
//           userPlace.rating = 2;
//           await userPlace.save();
//           console.log(`Rating set to 2 for UserPlace ${userPlace._id}`);
//         }
//       }
//       // Check if booked is true and rating is null
//       else if (userPlace.booked && userPlace.rating === null) {
//         // Set rating to 5
//         userPlace.rating = 5;
//         await userPlace.save();
//         console.log(`Rating set to 5 for UserPlace ${userPlace._id}`);
//       }
//     }

//     console.log('Rating update process completed.');
//   })
//   .catch((error) => {
//     console.error('Error retrieving UserPlaces:', error);
//   });

app.listen(4000);


