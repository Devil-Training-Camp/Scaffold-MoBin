#! /usr/bin/env node

const package = require('../package.json')
const { program } = require('commander')
const chalk = require('chalk')
// const createProject = require('../lib/create')
const inquirer = require('inquirer')
let prompt = inquirer.createPromptModule()
const templates = require('../lib/templates')
const path = require('path')
const downloadGitRepo = require('download-git-repo')
const ora = require('ora')

// 获取版本号
program.version(`training-cli ${package.version}`)
// 配置首行提示
program.name('training-cli').usage('<command> [option]')

// 配置create命令
program
  .command('create <project-name>')
  .description('create a new project')
  .option('-f --force', 'overwrite target directory if it exists')
  .action(async projectName => {
    // createProject(projectName, options)

    const { template } = await prompt([
      {
        name: 'template',
        type: 'list',
        choices: templates
      }
    ])
    console.log('template: ', template)

    let loading = ora('downloading...')
    loading.start()
    // 获取目标文件夹
    const dest = path.join(process.cwd(), projectName)
    // 下载模板
    downloadGitRepo(template, dest, err => {
      if (err) {
        loading.fail('create template failed: ' + err.message)
      } else {
        loading.succeed('create template successed')
      }
    })
  })

// 配置config命令
program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <key>', 'get value by key')
  .option('-s, --set <key> <value>', 'set option[key] is value')
  .option('-d, --delete <key>', 'delete option by key')
  .action((value, key) => {
    console.log(value, key)
  })

// 优化help提示
// 监听--help
program.on('--help', () => {
  console.log()
  console.log(
    `Run ${chalk.cyan(
      'training-cli <command> --help'
    )} for detailed usage of given command.`
  )
  console.log()
})

// 解析用户输入的参数
program.parse(process.argv)
