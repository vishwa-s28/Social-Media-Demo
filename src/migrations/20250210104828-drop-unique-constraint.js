"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("tags", "tags_user_id_key");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint("tags", {
      fields: ["user_id"],
      type: "unique",
      name: "tags_user_id_key",
    });
  },
};
