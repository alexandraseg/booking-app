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

function getUserDataFromReq(req){
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        });
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
  res.json(place);
    //new input
    // res.json(await Place.findById(id));
});

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
    place, checkIn, checkOut, numberOfGuests, user:userData.id, price,
   }).then((doc) => {
    res.json(doc);
   }).catch((err) => {
    throw err;
   });
});


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
        hostRating, hostComment, placeRating, placeComment, date, placeId
     } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        
        const user = await User.findById(userData.id); // Retrieve the user object from the database
        
        const reviewDoc = await Review.create({
            place_id:placeId,
            guest_id:user,
            hostRating, hostComment, placeRating, placeComment, date,
        });
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



app.listen(4000);