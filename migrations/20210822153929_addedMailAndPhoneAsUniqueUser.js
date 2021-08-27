const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(phone) => "user"
 * changeColumn(email) => "user"
 *
 */

const info = {
  revision: 4,
  name: "addedMailAndPhoneAsUniqueUser",
  created: "2021-08-22T15:39:29.105Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "user",
      "phone",
      { type: Sequelize.STRING, field: "phone", unique: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "user",
      "email",
      { type: Sequelize.STRING, field: "email", unique: true },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "user",
      "phone",
      { type: Sequelize.STRING, field: "phone" },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "user",
      "email",
      { type: Sequelize.STRING, field: "email" },
      { transaction },
    ],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
