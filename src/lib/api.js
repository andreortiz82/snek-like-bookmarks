import axios from 'axios'

var Api = {
  bookmark: {
    get: function (callback) {
      var config = {
        timeout: 5000,
        headers: {
          'x-apikey': '5a20d44e7814ac5b3a05f509',
          'content-type': 'application/json',
          'cache-control': 'no-cache'
        },
      }

      axios({
        method: 'GET',
        url: 'https://bookmarks-d859.restdb.io/rest/bookmark',
        timeout: config.timeout,
        headers: config.headers,
        onUploadProgress: function (progressEvent) {
          // console.log(progressEvent.loaded)
        },
        onDownloadProgress: function (progressEvent) {
          // console.log(progressEvent.loaded)
        }
      }).then(function (response) {
        // console.log(response.status)
        callback(response)
      })
    },
    post: function (data, callback) {
      var config = {
        timeout: 5000,
        headers: {
          'x-apikey': '5a203ad27814ac5b3a05f4f7',
          'content-type': 'application/json',
          'cache-control': 'no-cache'
        },
      }

      axios({
        method: 'POST',
        url: 'https://bookmarks-d859.restdb.io/rest/bookmark',
        timeout: config.timeout,
        headers: config.headers,
        data: data,
        onUploadProgress: function (event) {
          // console.log('onUploadProgress', event)
        },
        onDownloadProgress: function (event) {
          // console.log('onDownloadProgress', event)
        }
      }).then(function (response) {
        // console.log(response)
        callback(response)
      })
    },
    remove: function (resource) {
      console.log(resource)
    },
    update: function (resource) {
      console.log(resource)
    },
  }
}

export default Api