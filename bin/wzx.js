#!/usr/bin/env node

// 核心处理命令行(TJ大神开发)
const program = require('commander')

// 处理当用户进行版本号控制的时候
const Printer = require('@darkobits/lolcatjs')

// 粉笔 跟用户用文字对话
const chalk = require('chalk')

// 与用户交互
const inquirer = require('inquirer')

// loading模块
const ora = require('ora')

// 需要准备模版文件地址
const templateUrl = 'github:wzx365/Babel-about'

// download 
const download = require('download-git-repo') 

// shell库
const shelljs = require('shelljs')

//当前命令行路径
const processCwdPath = process.cwd()

// 用户根目录
// const userHome = require('user-home')

console.log('welcome to use wzx-cli')

program.version(Printer.default.fromString('0.0.1'), '-v --version')

// program.command('init', '初始化我们的项目')

const binHandlers = {
    init(params) {
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: '请选择项目模版类型',
                    choices: ['babel-about', 'react-webpack', 'vue-webpack'],
                    name: 'templateName'
                },
                {
                    type: 'text',
                    message: '请输入新建项目名称',
                    name: 'projectName'
                }
            ])
            .then(answers => {
                console.log(answers)
                const { templateName, projectName } = answers
                if (projectName) {
                    
                    // shelljs创建文件夹
                    const _projectPath = `${processCwdPath}/${projectName}`
                    console.log('')
                    console.log('该项目路径为: ', _projectPath)
                    shelljs.rm('-rf', _projectPath)

                    const spinner = ora('加载初始模版')
                    spinner.start()

                    // 下载github的对应模块
                    // { clone: true } 所有的分支 不写就是false 默认拉master分支模版，并不初始化仓库
                    // [github/gitlab/Bitbucket]:[账户名]/[仓库名]
                    download(templateUrl, _projectPath, {clone: false}, err => {
                        spinner.stop()
                        if (err) {
                            console.error('💔 下载失败', err.message)
                        } else {
                            // 要对用户整体安装过的项目进行核心数据的替换
                            shelljs.sed('-i', templateName, projectName, _projectPath + '/package.json')
                            console.log(chalk.green('💖 创建成功!'))
                        }
                    })
                }
            })
    }
}

program
    .usage('[cmd] <options>')
    .arguments('<cmd> [env]')
    .action((cmd, otherParms) => {
        console.log(cmd)
        const handler = binHandlers[cmd]
        if (handler) {
            handler(otherParms)
        } else {
            console.log(chalk.yellow('遗憾! ') + chalk.red(`目前没有${cmd}这个命令`))
            process.exit(1)
        }
    })

program.parse(process.argv)
