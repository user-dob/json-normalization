import chai, { expect } from 'chai'
import { Schema } from '../src'

describe('json-normalization', () => {

  it('fails creating nameless schema', () => {
    expect(() => new Schema()).to.throw()
  })

  it('fails creating entity with non-string name', () => {
    expect(() => new Schema(12)).to.throw()
  })

  it('can normalize single entity', () => {
    const article = new Schema('articles')

    const input = {
      id: 1,
      title: 'Some Article',
      isFavorite: false
    }

    const output = {
      entities: {
        articles: {
          1: {
            id: 1,
            title: 'Some Article',
            isFavorite: false
          }
        }
      },
      result: 1
    }

    Object.freeze(input)

    expect(Schema.normalize(input, article)).to.deep.equal(output)
  })

  it('can provide assign values for a single entity', () => {
    const article = new Schema('articles')

    article.assign = {
      isFavorite: false
    }

    const input = {
      id: 1,
      title: 'Some Article'
    }

    const output = {
      entities: {
        articles: {
          1: {
            id: 1,
            title: 'Some Article',
            isFavorite: false
          }
        }
      },
      result: 1
    }

    Object.freeze(input)

    expect(Schema.normalize(input, article)).to.deep.equal(output)
  })

  it('can provide assign function for a single entity', () => {
    const article = new Schema('articles')

    article.assign = data => {
      data.isFavorite = false
    }

    const input = {
      id: 1,
      title: 'Some Article'
    }

    const output = {
      entities: {
        articles: {
          1: {
            id: 1,
            title: 'Some Article',
            isFavorite: false
          }
        }
      },
      result: 1
    }

    Object.freeze(input)

    expect(Schema.normalize(input, article)).to.deep.equal(output)
  })


  it('can normalize single entity', () => {
    const article = new Schema('articles')
    const author = new Schema('authors')
    const post = new Schema('posts')

    article.define({
      author
    })

    author.define({
      posts: [post]
    })

    const input = {
      id: 1,
      title: 'Some Article',
      author: {
        id: 1,
        name: 'Name 1',
        posts: [
          {id: 1, title: 'title 1'},
          {id: 2, title: 'title 2'}
        ]
      }
    }

    const output = {
      entities: {
        articles: {
          1: {
            id: 1,
            title: 'Some Article',
            author: 1
          }
        },
        authors: {
          1: {
            id: 1,
            name: 'Name 1',
            posts: [1, 2]
          }
        },
        posts: {
          1: {
            id: 1,
            title: 'title 1'
          },
          2: {
            id: 2,
            title: 'title 2'
          }
        }
      },
      result: 1
    }

    Object.freeze(input)

    expect(Schema.normalize(input, article)).to.deep.equal(output)
  })



})