import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'

export class Schema {

  static parseSchema(norm, data, schema) {
    data = schema.setAssign(data)

    for(let name in schema.nestedSchema) {
      data[name] = Schema.parse(norm, data[name], schema.nestedSchema[name])
    }

    norm.entities[schema.key] = norm.entities[schema.key] || {}
    norm.entities[schema.key][data[schema.idKey]] = data

    return data[schema.idKey]
  }

  static parse(norm, data, schema) {
    if(Array.isArray(schema)) {
      schema = schema[0]
      return data.map(item => Schema.parseSchema(norm, item, schema))
    }

    return Schema.parseSchema(norm, data, schema)
  }

  static normalize(data, schema) {
    let norm = {
      entities: {}
    }

    norm.result = Schema.parse(norm, data, schema)

    return norm
  }

  constructor(key) {

    if(typeof key !== 'string') {
      throw new Error('A string non-empty key is required')
    }

    this._key = key
    this._nestedSchema = {}
    this.idKey = 'id'

    this.assign = {}
  }

  buildAssignLogic() {

    if(isFunction(this.assign)) {
      return data => {
        data = Object.assign({}, data)
        this.assign(data)
        return data
      }
    }

    if(isObject(this.assign)) {
      return data => Object.assign({}, this.assign, data)
    }

    throw new Error('assign is not an object and function')
  }

  get assign() {
    return this._assign
  }

  set assign(value) {
    this._assign = value
    this.setAssign = this.buildAssignLogic()
  }

  get key() {
    return this._key
  }

  get nestedSchema() {
    return this._nestedSchema
  }

  define(nestedSchema) {
    this._nestedSchema = nestedSchema
  }
}
