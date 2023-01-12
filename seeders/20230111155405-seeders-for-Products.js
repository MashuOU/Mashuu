'use strict';
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
    *
    * Example:
    * await queryInterface.bulkInsert('People', [{
    *   name: 'John Doe',
    *   isBetaMember: false
    * }], {});
    */
    const dataProducts = JSON.parse(fs.readFileSync('./product.json', 'utf-8'))
      .map(el => {
        el.createdAt = new Date()
        el.updatedAt = new Date()

        return el
      })
    // console.log(dataProducts);
    return queryInterface.bulkInsert('Products', dataProducts, {});
  },

  down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Products', null, {});
  }
};
