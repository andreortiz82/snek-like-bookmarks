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
          usersRef.child(userObject.uid).push(userObject)
        }
      })
      callback(userObject)
    }
  })
}

// Category API
// ====================================

// CREATE
// -------------
export const saveCategory = function(newCategoryObject, callback) {
  db.ref('/categories').push().then((category) => {
    newCategoryObject.key = category.key
    category.set(newCategoryObject)
    callback(category)
  })
}

// READ
// -------------
export const getAllCategories = function(user, callback) {
  db.ref('/categories').orderByChild('owner').equalTo(user.uid).on('value', (snapshot) => {
    var categories = []
    snapshot.forEach((child) => {
      categories.push({
        key: child.key,
        label: child.val().label,
        owner: child.val().owner,
        bookmarks: child.val().bookmarks,
        slug: child.val().slug })
    })
    callback(categories)
  })
}
export const getCategory = function(categoryKey) {
  return db.ref('/categories').child(categoryKey)
}

// UPDATE
// -------------
export const updateCategory = function(categoryKey, newCategoryObject, callback) {
  getCategory(categoryKey).update(newCategoryObject).then((category) => {
    callback(category)
  })
}

// DELETE
// -------------
export const deleteCategory = function(categoryKey, callback) {
  getCategory(categoryKey).remove()
  callback()
}

// Bookmark API
// ====================================

// CREATE
// -------------
export const saveBookmark = function(categoryKey, bookMarkObject, callback) {
  getCategory(categoryKey).child('bookmarks').push().then((bookmark) => {
    bookMarkObject.key = bookmark.key
    bookmark.set(bookMarkObject)
    callback()
  })
}

// READ
// -------------
export const getBookmark = function(categoryKey, bookmarkKey) {
  return getCategory(categoryKey).child('bookmarks').child(bookmarkKey)
}

// UPDATE
// -------------
export const updateBookmark = function(categoryKey, bookMarkObject, callback) {
  getBookmark(categoryKey, bookMarkObject.key).update(bookMarkObject).then((bookmark) => {
    callback(bookmark)
  })
}

// DELETE
// -------------
export const deleteBookmark = function(categoryKey, bookmarkKey, callback) {
  getBookmark(categoryKey, bookmarkKey).remove()
  callback()
}





