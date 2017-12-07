import fb from 'firebase'
const config = {
  apiKey: "AIzaSyB9A1p-gf3ktvQ1XDmfs0jOVtUyV2e14MI",
  authDomain: "andreortiz-6755d.firebaseapp.com",
  databaseURL: "https://andreortiz-6755d.firebaseio.com",
  projectId: "andreortiz-6755d",
  storageBucket: "andreortiz-6755d.appspot.com",
  messagingSenderId: "496275504776"
}

const app = fb.initializeApp(config)

export const firebase = app
export const db = app.database()
export const usersRef = db.ref('/users')
export const categoriesRef = db.ref('/categories')
export const bookmarksRef = db.ref('/bookmarks')

export const userCategories = function(userID, callback){
  categoriesRef.orderByChild('owner').equalTo(userID).on('value', (snapshot) => {
    callback(snapshot.val())
  });
}

export const heyGoogleLogin = function (callback) {
  var provider = new fb.auth.GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
  firebase.auth().signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;

    callback({
      token: token,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL })

  }).catch(function(error) {
    console.log('error => ',error)
  });
}

export const heyGoogleLogout = function (callback) {
  firebase.auth().signOut().then(function(signOut) {
    callback(null)
  }).catch(function(error) {
    console.log('error => ',error)
  });
}

export const heyGoogleWhatsMyAuthState = function(callback) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var userObject = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL }

      usersRef.orderByChild('uid').equalTo(userObject.uid).on('value', (snapshot) => {
        var exists = (snapshot.val() !== null)
        if(!exists){
          usersRef.child(userObject.uid).set(userObject)
        }
      })
      callback(userObject)
    }

  })
}