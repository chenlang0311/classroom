'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_ROOT_CRM: '"http://172.16.99.224:8001/crm/v1"',
  //祥哥
  // API_ROOT_CRM: '"http://172.16.99.99:8002/crm/v1"',
  API_ROOT_CRM: '"http://127.0.0.1:8021/crm/v1"'
})
