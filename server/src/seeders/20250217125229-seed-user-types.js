"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          user_id: 1,
          email: "applicant1@example.com",
          identity_number: "A1001",
          first_name: "Alice",
          last_name: "Applicant",
          phone: "1234567890",
          password: "hashedpassword1", // Use hashed passwords in production!
          role: "applicant",
          created_at: new Date(),
          validity: true,
          address: "123 Main St",
        },
        {
          user_id: 2,
          email: "reviewer1@example.com",
          identity_number: "R1001",
          first_name: "Bob",
          last_name: "Reviewer",
          phone: "2345678901",
          password: "hashedpassword2",
          role: "reviewer",
          created_at: new Date(),
          validity: true,
          address: "456 Elm St",
        },
        {
          user_id: 3,
          email: "committee1@example.com",
          identity_number: "C1001",
          first_name: "Carol",
          last_name: "Committee",
          phone: "3456789012",
          password: "hashedpassword3",
          role: "committee",
          created_at: new Date(),
          validity: true,
          address: "789 Oak St",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Users",
      {
        email: [
          "applicant1@example.com",
          "reviewer1@example.com",
          "committee1@example.com",
        ],
      },
      {}
    );
  },
};
