const expect = require('chai').expect
const { insert } = require('./../actions')
const db = require('./../knexfile')
const knex = require('knex')(db['development'])

describe('Should test the actions function', function() {
    after('Clear Database', function() {
        knex.raw('delete from tbl_listing').then(function(data) {
            process.exit()
        })
    })
    describe('This function insert a row in the database', function() {
        beforeEach('Delete Database Rows', function() {
            knex.raw('delete from tbl_listing;').then(function(data) {})
        })
        it('should be true', async function() {
            let obj1 = { id: 1 }
            let result = await insert(obj1)
            expect(result).to.be.true
        })

        it('should be an error', async function() {
            let obj1 = { id: 1 }
            let result = await insert(obj1)
            result = await insert(obj1).catch(err => expect(err).to.not.be.true)
        })

        it('Should return true', async function() {
            for (let x; x < 10; x++) {
                let result = await insert(x)
                expect(result).to.be.true
            }
        })
    })
})
