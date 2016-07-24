'use strict';
let container = require('../lib/container');

class UserRepository {
    constructor(logger, currentUser) {
        this.logger = logger;
        this.currentUser = currentUser;
    }

    getCurrentUser() {
        if (this.currentUser === '3') {
            this.logger.info('Found Tim');
            return { name: 'Tim' };
        }
        this.logger.info('Found Bob');
        return { name: 'Bob' };
    }
}

module.exports = UserRepository;