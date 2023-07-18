const axios = require('axios')

const service = axios.create({
  // baseURL: 'https://some-domain.com/api/',
  // headers: { 'X-Custom-Header': 'foobar' }
  timeout: 10000
})

service.interceptors.response.use(response => {
  return response.data
})

async function getGitRepoList(user) {
  return new Promise((resolve, reject) => {
    service
      .get(`https://api.github.com/users/${user}/repos`)
      .then(res => {
        // 组合成模板需要的name，value结构
        resolve(
          res.map(item => {
            return {
              name: item.name,
              value: `https://github.com:${user}/${item.name}`
            }
          })
        )
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = { getGitRepoList }
