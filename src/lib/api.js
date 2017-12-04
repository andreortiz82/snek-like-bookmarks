import axios from 'axios'

var config = {
  timeout: 5000,
  headers: {
    'x-apikey': '5a203ad27814ac5b3a05f4f7',
    'content-type': 'application/json',
    'cache-control': 'no-cache'
  }
}

var Api = {
  category: {
    // GET
    get: function (callback) {
      axios({
        method: 'GET',
        url: 'https://bookmarks-d859.restdb.io/rest/category',
        timeout: config.timeout,
        headers: config.headers,
      }).then(function (response) {
        console.log(response.data)
        callback(response)
      })
    },
    // POST
    post: function (data, callback) {
      axios({
        method: 'PUT',
        url: 'https://bookmarks-d859.restdb.io/rest/category/'+data.category._id,
        data: data,
      }).then(function (response) {
        callback(response)
      })
    },
    // DELETE
    remove: function (resource) {},
    // PUT
    update: function (resource) {}
  },
  bookmark: {
    // GET
    get: function (callback) {
      axios({
        method: 'GET',
        url: 'https://bookmarks-d859.restdb.io/rest/bookmark',
        timeout: config.timeout,
        headers: config.headers,
      }).then(function (response) {
        callback(response)
      })
    },
    // POST
    post: function (data, callback) {
      axios({
        method: 'POST',
        url: 'https://bookmarks-d859.restdb.io/rest/bookmark',
        data: data,
      }).then(function (response) {
        // console.log(response)
        callback(response)
      })
    },
    // DELETE
    remove: function (resource) {},
    // PUT
    update: function (resource) {}
  }
}

export default Api