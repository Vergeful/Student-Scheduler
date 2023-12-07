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

router.get('/admin/info/:adminId', getAdminInfo);
// Retrieve all degrees and their associated department courses
router.get('/department/:depId/courses', getDepartmentCourses);
router.get('/departments/:depId/degrees', getDeptDegrees);
// Retrieve, add, or delete courses for a specific degree
router.route('/admin/:degreeId/courses')
      .get(getDegreeCourses)
      .post(addRequiredCourse)
      .delete(deleteRequiredCourse);
router.get('/admin/:courseId/prerequisites', getPrerequisites);
router.get('/admin/:courseId/antirequisites', getAntirequisites);
router.get('/admin/:adminId/profs', getProfs);
router.put('/admin/:depId/courses/:courseId', updateCourse);

module.exports = router;