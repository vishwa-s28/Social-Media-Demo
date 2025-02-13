"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("likes", "likes_user_id_key");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint("likes", {
      fields: ["user_id"],
      type: "unique",
      name: "likes_user_id_key",
    });
  },
};
