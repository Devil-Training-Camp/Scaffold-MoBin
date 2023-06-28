#!/usr/bin/env node

const { program } = require('commander')

// name 是配置脚手架名称
// usage 是配置命令格式
// 取出package.json的版本号
program
  .name('training-cli')
  .usage('<command> [option]')
  .version(`training-cli ${require('../package.json').version}`)

program.parse()
