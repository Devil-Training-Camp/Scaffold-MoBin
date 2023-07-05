#!/usr/bin/env node

const chalk = require('chalk')
const { program } = require('commander')
const createProject = require('../lib/create')

// 设置首行提示
program.name('training').usage('<command> [option]')

// 获取版本号
program.version(`training-cli ${require('../package.json').version}`)

// 配置create命令
program
  .command('create <project-name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite target directory if it exists')
  .action((projectName, cmd) => {
    createProject(projectName, cmd)
  })

// 配置config命令
program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <key>', 'get value by key')
  .option('-s, --set <key> <value>', 'set option[key] is value')
  .option('-d, --delete <key>', 'delete option by key')
  .action((value, keys) => {
    console.log(value, keys)
  })

// on监听help指令
program.on('--help', function () {
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
