function matrixFactorisation(Ratings, features = 2, epochs = 4000, learningRate = 0.01, weightDecay = 0.0002, verbose = true) {
      const lenRatings = Ratings.length;
      const lenItems = Ratings[0].length;
    
      // Firstly, initialisation of the elements of the User and Item features matrices.
      const UserFeatures = [];
      const ItemFeatures = [];
      for (let i = 0; i < lenRatings; i++) {
        UserFeatures.push(new Array(features).fill(0));
      }
      for (let i = 0; i < lenItems; i++) {
        ItemFeatures.push(new Array(features).fill(0));
      }
    
      // I used a small range (up to 0.15 in this case)
      // seems to work better than the normal range of up to 1
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
    
      // To be used later on the stopping condition
      let bestRMSE = Infinity;
    
      // Not to be calculated over and over
      const invariant = learningRate * weightDecay;
      const normaliz = weightDecay / 2;
    
      for (let epoch = 0; epoch < epochs; epoch++) {
        for (let i = 0; i < lenRatings; i++) {
          for (let j = 0; j < lenItems; j++) {
            // Only if it is a known element
            // ie greater than zero
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
    
        // Stopping Condition as suggested in the course notes
        if (RMSE > bestRMSE) {
          break;
        }
    
        bestRMSE = RMSE;
      }
    
      const MatrixReversi = dotProduct(UserFeatures, ItemFeatures);
    
      return MatrixReversi;
    }

    
    
    // Helper function to calculate the dot product of two vectors
    function dotProduct(a, b) {
      let product = 0;
      for (let i = 0; i < a.length; i++) {
        product += a[i] * b[i];
      }
      return product;
    }
    
    // Helper function to transpose a matrix
    function transpose(matrix) {
      return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }
    
    // Connect to the database to get the data
    const mysql = require('mysql');
    
    const auctionDB = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'rb16bhonda',
      database: 'auctionDB'
    });
    
    // Fetch the three required tables
    auctionDB.connect((err) => {
      if (err) throw err;
      auctionDB.query('SELECT * FROM UserData', (err, userData) => {
        if (err) throw err;
        auctionDB.query('SELECT * FROM Users', (err, users) => {
          if (err) throw err;
          auctionDB.query('SELECT * FROM Items', (err, items) => {
            if (err) throw err;
    
            // Dictionary to keep search to O(1)
            const userIDs = {};
            let i = 0;
            for (const user of users) {
              userIDs[user[0]] = i;
              i++;
            }
    
            // Keep id and availability here
            const itemIDs = {};
            const itemList = [];
            const available = [];
            i = 0;
            for (const item of items) {
              itemIDs[item[0]] = i;
              itemList.push(item[0]);
              available.push(item[12]);
              i++;
            }
    
            // Initialisation of the Ratings Matrix
            const Ratings = Array.from({ length: users.length }, () => Array(items.length).fill(0));
    
            // Add the Ratings that come from the user history
            for (const ratingData of userData) {
              const row = userIDs[ratingData[5]];
              const column = itemIDs[ratingData[4]];
              Ratings[row][column] = ratingData[1];
            }
    
            // Calculate the predicted ratings for unknown elements
            const PredictedRatings = matrixFactorisation(Ratings, true);
    
            for (let i = 0; i < users.length; i++) {
              for (let j = 0; j < items.length; j++) {
                // Only keep the Unknown elements and those that are still Available and not theirs
                if (Ratings[i][j] > 0 || available[j] !== 'AVAILABLE' || items[j][16] === users[i][0]) {
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
            auctionDB.query('TRUNCATE TABLE UserTops', (err) => {
              if (err) throw err;
    
              for (const userID in userIDs) {
                if (Object.hasOwnProperty.call(userIDs, userID)) {
                  const userIndex = userIDs[userID];
    
                  // Get their top recommendations
                  const myPersonalRecommendations = PredictedRatings[userIndex]
                    .map((_, i) => i)
                    .sort((a, b) => PredictedRatings[userIndex][b] - PredictedRatings[userIndex][a])
                    .slice(0, top);
    
                  // And fill in the extreme case the rest with zeroes
                  if (itemList.length < 6) {
                    for (let i = 0; i < 6 - itemList.length; i++) {
                      myPersonalRecommendations.push(0);
                    }
                  }
    
                  const stmt = 'INSERT INTO UserTops (p1, p2, p3, p4, p5, p6, UserId) VALUES (?, ?, ?, ?, ?, ?, ?)';
                  const vals = [
                    itemList[myPersonalRecommendations[0]],
                    itemList[myPersonalRecommendations[1]],
                    itemList[myPersonalRecommendations[2]],
                    itemList[myPersonalRecommendations[3]],
                    itemList[myPersonalRecommendations[4]],
                    itemList[myPersonalRecommendations[5]],
                    userID
                  ];
    
                  auctionDB.query(stmt, vals, (err) => {
                    if (err) throw err;
                  });
                }
              }
            });
          });
        });
      });
    });