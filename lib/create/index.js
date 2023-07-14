const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
let prompt = inquirer.createPromptModule()
const Creator = require('./Creator')

module.exports = async function (projectName, options) {
  // 获取当前工作目录
  const cwd = process.cwd()
  // 拼接得到项目目录
  const targetDirectory = path.join(cwd, projectName)
  // 判断目录是否存在
  if (fs.existsSync(targetDirectory)) {
    // 判断是否使用--force
    if (options.force) {
      // 删除重名目录
      await fs.remove(targetDirectory)
    } else {
      let { isOverwrite } = await prompt([
        {
          name: 'isOverwrite', // 与返回值对应
          type: 'list',
          message: 'Target directory exists, please choose an action',
          choices: [
            { name: 'Overwrite', value: true },
            { name: 'Cancel', value: false }
          ]
        }
      ])

      if (isOverwrite) {
        console.log('\r\nRemoving')
        await fs.remove(targetDirectory)
      } else {
        console.log('\r\nCancel')
        return
      }
    }
  }

  const creator = new Creator(projectName, targetDirectory)
  creator.create()
}
