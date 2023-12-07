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

router.route('/degrees').get(getMajorMinorConc)
router.route('/semesters').get(getSemesters)
router.route('/major').patch(updateMajor)
router.route('/minor').patch(updateMinor)
router.route('/conc').patch(updateConc)
router.route('/courses').get(getAllCourses)
router.route('/course/:id').patch(createRating)
router.route('/semester-courses:id').get(getSemesterCourses)
router.route('/semester-uncompleted-degree:id').get(getUncompletedDegreeCoursesForSemester)
router.route('/semester-enrolled:id').get(getEnrolledCoursesForSemester)
router.route('/semester/:id/course/:id').get(getSemesterCourse).patch(updateEnrollmentForCourse)
router.route('/semester/:id/course-rating/:id').get(getCourseAvgRating)
router.route('/semester/:id/course-pre-anti/:id').get(getPrerequisitesAntirequisites)

module.exports = router
