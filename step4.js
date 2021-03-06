const Wit = require('./src/Wit')
const fs = require('fs')
const util = require('util');

async function run() {
  try {
    // Instantiation
    const wit = new Wit('LY3FY7QKWOROI6FB27N6HSNGPUYWIYX4', { debug: true })
    // Syncronize with remote
    await wit.sync()
    // Create entities
    // Trait
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
    // Free-text
    if (!wit.entities.quantity) {
      await wit.entities.add('quantity')
      await wit.entities.quantity.update({doc: 'Quantity', lookups: ['free-text']})
    }
    // Free-text & keywords
    if (!wit.entities.size) {
      await wit.entities.add('size')
      await wit.entities.size.update({
        doc: 'Size',
        lookups: ['free-text', 'keywords'],
        values: [
          {value: 'XS', expressions: ['36']},
          {value: 'S', expressions: ['37', '38']},
          {value: 'M', expressions: ['39', '40']},
          {value: 'L', expressions: ['41', '42']},
          {value: 'XL', expressions: ['43', '44']},
          {value: 'XXL', expressions: ['45', '46']}
        ]
      })
    }
    if (!wit.entities.color) {
      await wit.entities.add('color')
      await wit.entities.color.update({
        doc: 'color',
        lookups: ['free-text', 'keywords'],
        values: [
          {value: 'blue', expressions: ['azra9', 'turkoise'], metadata: '#000080'},
          {value: 'white', expressions: ['abyedh'], metadata: '#ffffff'},
          {value: 'grey', expressions: ['gris'], metadata: '#999999'},
          {value: 'black', expressions: ['ak7el'], metadata: '#000000'}
        ]
      })
    }
    // Keywords
    if (!wit.entities.product) {
      await wit.entities.add('product')
      await wit.entities.product.update({
        doc: 'A Coth',
        lookups: ['keywords'],
        values: [
          {value: 'pant', expressions: ['jean', 'short', 'pontacourt']},
          {value: 'shirt', expressions: ['t-shirt', 'chemise', 'maryoul']},
          {value: 'shoe', expressions: ['sebago', 'sabbat', 'sandal']}
        ]
      })
    }
    if (!wit.entities.pantBrand) {
      await wit.entities.add('pantBrand')
      await wit.entities.pantBrand.update({
        doc: 'Brand of a pant',
        lookups: ['keywords'],
        values: [
          {value: 'bull'},
          {value: 'fuel'},
          {value: 'murderer'}
        ]
      })
    }
    if (!wit.entities.shirtTextile) {
      await wit.entities.add('shirtTextile')
      await wit.entities.shirtTextile.update({
        doc: 'Textile of a shirt',
        lookups: ['keywords'],
        values: [
          {value: 'coton', expressions: ['coton', 'gton']},
          {value: 'nylon', expressions: ['nylon']}
        ]
      })
    }
    if (!wit.entities.shoesGendre) {
      await wit.entities.add('shoesGendre')
      await wit.entities.shoesGendre.update({
        doc: 'Gendre the shoe is destinated for',
        lookups: ['keywords'],
        values: [
          {value: 'male', expressions: ['sebago']},
          {value: 'female', expressions: ['talon']}
        ]
      })
    }
    const rawDataset = fs.readFileSync('./clothData.txt', {encoding: 'utf8'})
    const dataset = rawDataset.split('\n').map((line, i) => {
      let data = line.split('|')
      let text = data.shift()
      return {
        text,
        entities: data.map(datum => {
          let predicats = datum.split(' ')
          if (predicats.length === 2) {
            return {entity: predicats[0], value: predicats[1]}
          }
          if (predicats.length === 3) {
            const start = text.indexOf(predicats[2])
            const end = start + predicats[2].length
            return {entity: predicats[0], value: predicats[1], start, end}
          }
          console.error(new Error(`Malformed entry in dataset at line ${i+1}:\n${text}|${data.join('|')}\nSpecifically at:\n${datum}`))
          return undefined
        })
      }
    })

    console.log(util.inspect(dataset, false, null));

    await wit.services.sample.train(dataset)
    const validation = await wit.services.intent.message('enjareb maryoul gtonn ak7el taille 43', {n: 5})

    console.log(util.inspect(validation, false, null));

  } catch (e) {
    console.error(e)
  }
}

run()
