import 'dotenv/config'
import { QuackJS, QuackJSUtils } from '@n-f9/quack.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const Quack = new QuackJS(process.env.TOKEN as string, {})

const files = QuackJSUtils.GetFiles('./out/modules')

const getModules = async () => {
	for (const file of files) {
		const execute = (await import(path.join(__dirname, '../', file))).default
		await execute(Quack)
	}
}

await getModules()
await Quack.Start(Quack)
