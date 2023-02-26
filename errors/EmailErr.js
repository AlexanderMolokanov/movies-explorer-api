const { ERROR_CODE_CONFLICT } = require('../utils/constants');

class EmailErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_CONFLICT; // 409
  }
}

module.exports = EmailErr;
