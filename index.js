#!/usr/bin/env node

// Next time, DONT FORGET THE SHEBANG... NICK

import pc from 'picocolors'
import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'
import fs from 'fs'
import path from 'path'
import boxen from 'boxen'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const pwd = process.cwd()

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))

console.log(boxen(pc.bold(pc.yellow('Quack.js CLI')) + '\n' + pc.black('http://quack.nickf.me/'), {
	padding: 1,
	margin: 1,
	borderStyle: 'round',
	dimBorder: true,
	borderColor: 'black',
	width: 30,
	textAlignment: 'center'
}));

const { name, type } = await inquirer
	.prompt([
		{
			type: 'input',
			name: 'name',
			message: 'What is the name of your project?',
			default: 'quack',
			validate(value) {
				if (value == null || new RegExp('[/\\?%*:|"<>]', 'g').test(value)) {
					return 'Invalid name!'
				}
				if (fs.existsSync(path.join(pwd, value))) {
					return 'A folder already has the project name!'
				}
				return true
			},
			filter(value) {
				return value.toLowerCase()
			}
		},
		{
			type: 'list',
			name: 'type',
			message: 'What language support do you need?',
			choices: ['TypeScript', 'JavaScript'],
			filter(value) {
				return value.toLowerCase()
			},
		},
	])
	.catch((error) => {
		console.log(pc.red('Oh no! An error occurred!'))
		process.exit(1)
	})

const createDir = (p) => {
	if (!fs.existsSync(p)) {
		fs.mkdirSync(p)
	}
}

const copyFile = (file) => {
	fs.writeFileSync(path.join(pwd, name, file), fs.readFileSync(path.join(__dirname, 'template', (type == 'typescript') ? 'ts' : 'js', file)).toString())
}

const spinner = createSpinner('Creating Project...').start()

createDir(path.join(pwd, name))
createDir(path.join(pwd, name, 'src'))
createDir(path.join(pwd, name, 'src', 'modules'))

if (type == 'typescript') {
	copyFile('tslint.json')
	copyFile('tsconfig.json')
	copyFile('package.json')
	copyFile('.prettierrc')
	copyFile('src/index.ts')
	copyFile('src/modules/template.ts') 
	copyFile('.env')
	copyFile('.disabled.gitignore')
} else {
	copyFile('package.json')
	copyFile('src/index.js')
	copyFile('src/modules/template.js') 
	copyFile('.env')
	copyFile('.disabled.gitignore')
}

const pack = JSON.parse(fs.readFileSync(path.join(pwd, name, 'package.json')).toString())
pack.name = name
fs.writeFileSync(path.join(pwd, name, 'package.json'), JSON.stringify(pack, null, 2))

await sleep()

spinner.success({ text: 'Enjoy your Quack.js project!' })