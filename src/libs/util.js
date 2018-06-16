import axios from 'axios'
import env from '../config/env'

let util = {}
util.title = function (title) {
  title = title ? title + ' - Home' : 'iView project'
  window.document.title = title
}
// 8688
console.log('config', env, process.env.NODE_ENV)
const ajaxUrl = process.env.NODE_ENV === 'development' ? 'http://nstart.cc:8688' : process.env.NODE_ENV === 'production' ? 'http://nstart.cc:80' : 'https://debug.url.com'

util.ajax = axios.create({
  baseURL: ajaxUrl,
  withCredentials: true,
  timeout: 30000
})

export default util

