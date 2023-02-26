const { ERROR_CODE_BAD_REQUEST } = require('../utils/constants');

class DataErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_BAD_REQUEST; // 400
  }
}

module.exports = DataErr;
