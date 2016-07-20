'use strict';
let container = require('./container');

class UserRepository {
    getCurrentUser() {
        let logger = container.resolve('logger');
        let userId = container.resolve('currentUser');
        if (userId === '3') {
            logger.info('Found Tim');
            return { name: 'Tim' };
        }
        logger.info('Found Bob');
        return { name: 'Bob' };
    }
}

module.exports = UserRepository;