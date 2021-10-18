const chalk = require('chalk');

class Logger {

    static init() {
        this.loadClass('Logger')
    }

    static loadClass(loadedClass) {
        let logArr = [
            chalk.bgGray(` ${new Date().toLocaleTimeString()} `),
            chalk.bgGreenBright.whiteBright(` ✓ `),
            ` Loaded class${chalk.hex('ffaabb')('➜')} ${chalk.white(loadedClass)} `
        ]
        console.log(logArr.join(''))
    }

    static load(loadedClass, msg = null) {
        let logArr = [
            chalk.bgGray(` ${new Date().toLocaleTimeString()} `),
            chalk.bgGreenBright.whiteBright(` ✓ `),
            ` Loaded ${chalk.white(loadedClass)}${msg ? `${chalk.hex('ffaabb')('➜')}` : ''}`,
				msg ? ` ${chalk.white(msg)} ` : ''
		]
		console.log(logArr.join(''))
	}

	static request(endpoint, user = null) {
		let logArr = [
			chalk.bgGray(` ${new Date().toLocaleTimeString()} `),
			chalk.bgGreenBright.whiteBright(` ✓ `),
			` Endpoint req${chalk.hex('ffaabb')('➜')} ${chalk.white(endpoint)} ${chalk.hex('ffaabb')('[')}${chalk.white(user)}${chalk.hex('ffaabb')(']')}`,
		]
		console.log(logArr.join(''))
	}

}

module.exports = Logger;