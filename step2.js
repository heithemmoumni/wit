const Wit = require('./src/Wit')

async function run() {
  try {
    // Instantiation
    const wit = new Wit('LY3FY7QKWOROI6FB27N6HSNGPUYWIYX4', { debug: true })
    // Syncronize with remote
    await wit.sync()
    // Create entities
    if (!wit.entities.intent) {
      await wit.entities.add('intent')
      await wit.entities.intent.update({ doc: 'Global intent', lookups: ['trait'] })
    }
    if (!wit.entities.intent.values.length) {
      await wit.entities.intent.update({
        values: [
          { value: 'try' }, { value: 'order' }, {value: 'cost'}, { value: 'isAvailable' }
        ]
      })
    }
  } catch (e) {
    console.error(e)
  }
}

run()
