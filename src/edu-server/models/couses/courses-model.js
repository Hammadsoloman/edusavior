'use strict';

const coursesSchema = require('./courses-schema');
const mongoCourses = require('../mongo');

class Courses extends mongoCourses {
    constructor() {
        super(coursesSchema);
    }
}

module.exports = new Courses(coursesSchema);
