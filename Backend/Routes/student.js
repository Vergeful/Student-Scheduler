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

router.route('/student/degrees').get(getMajorMinorConc)
router.route('/student/semesters').get(getSemesters)
router.route('student/major').patch(updateMajor)
router.route('student/minor').patch(updateMinor)
router.route('student/conc').patch(updateConc)
router.route('/student/courses').get(getAllCourses)
router.route('/student/course/:id').patch(createRating)
router.route('/student/semester-courses:id').get(getSemesterCourses)
router.route('/student/semester-uncompleted-degree:id').get(getUncompletedDegreeCoursesForSemester)
router.route('/student/semester-enrolled:id').get(getEnrolledCoursesForSemester)
router.route('student/semester/:id/course/:id').get(getSemesterCourse).patch(updateEnrollmentForCourse)
router.route('student/semester/:id/course-rating/:id').get(getCourseAvgRating)
router.route('student/semester/:id/course-pre-anti/:id').get(getPrerequisitesAntirequisites)

module.exports = router
