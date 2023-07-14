const axios = require('axios')

const service = axios.create({
  // baseURL: 'https://some-domain.com/api/',
  // headers: { 'X-Custom-Header': 'foobar' }
  timeout: 10000
})

service.interceptors.response.use(response => {
  return response.data
})

/**
 * 获取模板
 * @returns Promise 仓库信息
 *  */
async function getZhuRongRepo() {
  return service.get('https://api.github.com/orgs/zhurong-cli/repos')
}

/**
 * 获取仓库的版本信息
 * @param {string} repo 模板名称
 * @returns Promise 模板信息
 *  */
async function getTagsByRepo(repo) {
  return service.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
}

module.exports = { getZhuRongRepo, getTagsByRepo }
