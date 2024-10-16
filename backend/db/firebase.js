const admin = require('firebase-admin');
var serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sambag2-8663a-default-rtdb.firebaseio.com"
});

// Get references to the database and auth
const database = admin.database();
const auth = admin.auth();

module.exports = { database, auth };
