const express = require('express');
const router = express.Router();

const {
    getAdminInfo,
    getDepartmentCourses,
    getDeptDegrees,
    getDegreeCourses,
    addRequiredCourse,
    deleteRequiredCourse,
    getPrerequisites,
    getAntirequisites,
    getProfs,
    updateCourse
} = require('../Controllers/admin');

router.get('/info/:adminId', getAdminInfo);
// Retrieve all degrees and their associated department courses
router.get('/department/:depId/courses', getDepartmentCourses);
router.get('/departments/:depId/degrees', getDeptDegrees);
// Retrieve, add, or delete courses for a specific degree
router.route('/:degreeId/courses')
      .get(getDegreeCourses)
      .post(addRequiredCourse)
      .delete(deleteRequiredCourse);
router.get('/:courseId/prerequisites', getPrerequisites);
router.get('/:courseId/antirequisites', getAntirequisites);
router.get('/:adminId/profs', getProfs);
router.put('/:depId/courses/:courseId', updateCourse);

module.exports = router;