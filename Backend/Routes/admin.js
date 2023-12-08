const express = require('express');
const router = express.Router();

const {
    getAdminInfo,
    getDeptDegrees,
    getDeptCourses,
    getDegreeRequiredCourses,
    addRequiredCourse,
    deleteRequiredCourse,
    getPrerequisites,
    getAntirequisites,
    getProfs/*,
    updateCourse*/
} = require('../Controllers/admin');

router.get('/info/:adminId', getAdminInfo);
// Retrieve all degrees and their associated department courses
router.get('/departments/:depId/degrees', getDeptDegrees);
router.get('/departments/:depId/courses', getDeptCourses);
// Retrieve, add, or delete courses for a specific degree
router.get('/:degreeId/courses', getDegreeRequiredCourses);
router.route('/:degreeId/:courseId')
    .post(addRequiredCourse)
    .delete(deleteRequiredCourse);
 router.get('/:courseId/prerequisites', getPrerequisites);
router.get('/:courseId/antirequisites', getAntirequisites);
router.get('/:adminId/profs', getProfs);/*
router.put('/:depId/courses/:courseId', updateCourse);*/

module.exports = router;