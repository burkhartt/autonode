'use strict';

class CircularDepencencyException extends Error {
    constructor() {
        super('A circular dependency was encountered.');
    }
}

module.exports = CircularDepencencyException;