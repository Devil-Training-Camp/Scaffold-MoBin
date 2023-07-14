const inquirer = require('inquirer')
let prompt = inquirer.createPromptModule()
const { getZhuRongRepo, getTagsByRepo } = require('../http/api')

class Creator {
  // 项目名称，路径
  constructor(name, target) {
    this.name = name
    this.target = target
  }

  // 创建项目
  async create() {
    let repo = await this.getRepoInfo()
    let tag = await this.getTagInfo(repo)
    console.log()
    console.log('choosed', repo, tag)
    console.log()
    console.log(this.name, this.target)
    console.log()
  }

  // 获取模板信息
  async getRepoInfo() {
    let repoList = await getZhuRongRepo()
    // 获取仓库名
    let repos = repoList.map(item => item.name)
    let { repo } = await prompt([
      {
        name: 'repo',
        type: 'list',
        message: 'Please choose a template',
        choices: repos
      }
    ])
    return repo
  }

  // 获取版本信息
  async getTagInfo(repo) {
    let tagList = await getTagsByRepo(repo)
    const tags = tagList.map(item => item.name)
    let { tag } = await prompt([
      {
        name: 'tag',
        type: 'list',
        message: 'Please choose a version',
        choices: tags
      }
    ])
    return tag
  }
}

module.exports = Creator
