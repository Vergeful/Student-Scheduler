const express = require('express')
const router = express.Router()

const {
    getMajorMinorConc,
    updateMajor,
    updateMinor,
    updateConc,
    getSemesters,
    getAllCourses,
    createRating,
    getSemesterCourses,
    getUncompletedDegreeCoursesForSemester,
    getEnrolledCoursesForSemester,
    getSemesterCourse,
    getCourseAvgRating,
    updateEnrollmentForCourse,
    getPrerequisitesAntirequisites

} = require('../Controllers/student')

router.get('/:studentId/degrees', getMajorMinorConc)
router.get('/semesters', getSemesters)

router.patch('/:studentId/major/:majId', updateMajor)
router.patch('/:studentId/minor/:minId', updateMinor)
router.patch('/:studentId/conc/:concId', updateConc)

router.get('/courses', getAllCourses)
router.post('/:studentId/course/:id', createRating)

router.get('/semester-courses:id', getSemesterCourses)
router.get('/:studentId/semester-uncompleted-degree/:id', getUncompletedDegreeCoursesForSemester)
router.get('/:studentId/semester-enrolled:id', getEnrolledCoursesForSemester)

router.route('/semester/:id/course/:id')
    .get(getSemesterCourse)
    .patch(updateEnrollmentForCourse)

router.get('/semester/:id/course-rating/:id', getCourseAvgRating)
router.get('/semester/:id/course-pre-anti/:id', getPrerequisitesAntirequisites)

module.exports = router
