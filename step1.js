const Wit = require('./src/Wit')

async function run() {
  try {
    // Instantiation
    const wit = new Wit('LY3FY7QKWOROI6FB27N6HSNGPUYWIYX4', { debug: true })
    // Syncronize with remote
    await wit.sync()
    console.log(wit)
  } catch (e) {
    console.error(e)
  }
}

run()
