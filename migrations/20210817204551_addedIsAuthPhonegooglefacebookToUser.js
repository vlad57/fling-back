const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addColumn(isAuthPhone) => "user"
 * addColumn(isAuthGoogle) => "user"
 * addColumn(isAuthFacebook) => "user"
 *
 */

const info = {
  revision: 2,
  name: "addedIsAuthPhonegooglefacebookToUser",
  created: "2021-08-17T20:45:51.651Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "user",
      "isAuthPhone",
      { type: Sequelize.BOOLEAN, field: "isAuthPhone" },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "user",
      "isAuthGoogle",
      { type: Sequelize.BOOLEAN, field: "isAuthGoogle" },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "user",
      "isAuthFacebook",
      { type: Sequelize.BOOLEAN, field: "isAuthFacebook" },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["user", "isAuthPhone", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["user", "isAuthGoogle", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["user", "isAuthFacebook", { transaction }],
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
