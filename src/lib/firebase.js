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


export const FB = fb
export const firebase = app
export const db = app.database()
export const bookmarksRef = db.ref('bookmarks')
export const categoriesRef = db.ref('categories')
export const usersRef = db.ref('users')
