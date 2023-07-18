#! /usr/bin/env node

const package = require('../package.json')
const { program } = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')
let prompt = inquirer.createPromptModule()
// const templates = require('../lib/templates')
const { getGitRepoList } = require('../lib/api')
const path = require('path')
const downloadGitRepo = require('download-git-repo')
const ora = require('ora')
const fs = require('fs-extra')

// 获取版本号
program.version(`training-cli ${package.version}`)
// 配置首行提示
program.name('training-cli').usage('<command> [option]')

// 配置create命令[project-name]是可选 <project-name>是必填
program
  .command('create [project-name]')
  .description('create a new project')
  .option('-f, --force', 'overwrite target directory if it exists')
  .option('-t, --template <template>', 'assign template')
  .action(async (projectName, options) => {
    // 获取模板列表
    const getTmpLoading = ora('getting templates...')
    getTmpLoading.start()
    const templates = await getGitRepoList('guojiongwei').catch(() => {
      getTmpLoading.fail('get templates failed')
    })
    getTmpLoading.succeed('get templates succeed')

    // 1.从模板列表中找到对应的模板
    let project = templates.find(tpl => tpl.name === options.template)

    // 2.如果匹配到模板就赋值，没有就是undefined
    let projectTemplate = project ? project.value : undefined
    console.log('命令行参数：', projectName, projectTemplate)

    // 3.如果用户没有传入参数就交互输入
    if (!projectName) {
      const { name } = await prompt([
        {
          name: 'name',
          type: 'input',
          message: 'Please input your projectName: '
        }
      ])
      projectName = name
    }
    console.log('projectName: ', projectName)

    // 获取目标文件夹
    const dest = path.join(process.cwd(), projectName)
    // 判断文件夹是否存在，存在就询问用户是否覆盖
    if (fs.existsSync(dest)) {
      const { force } = await prompt([
        {
          name: 'force',
          type: 'confirm',
          message: 'directory exists, overwrite it?'
        }
      ])
      // 如果覆盖就删除文件夹继续执行，否则退出进程
      force ? fs.removeSync(dest) : process.exit(1)
    }

    // 4.如果用户没有传入模板就交互输入
    if (!projectTemplate) {
      const { template } = await prompt([
        {
          name: 'template',
          type: 'list',
          choices: templates
        }
      ])
      projectTemplate = template
    }
    console.log('projectTemplate: ', projectTemplate)

    let loading = ora('downloading...')
    loading.start()
    // 下载模板
    downloadGitRepo(projectTemplate, dest, err => {
      if (err) {
        loading.fail('create template failed: ' + err.message)
      } else {
        loading.succeed('create template succeed')
        console.log(`\ncd ${projectName}`)
        console.log('npm install')
        console.log('npm start\n')
      }
    })
  })

// 优化help提示
// 监听--help
program.on('--help', () => {
  console.log(
    `\nRun ${chalk.cyan(
      'scaffold <command> --help'
    )} for detailed usage of given command.\n`
  )
})

// 解析用户输入的参数
program.parse(process.argv)
