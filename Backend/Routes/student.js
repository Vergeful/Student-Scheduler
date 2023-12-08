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
    enrollInCourse,
    unenrollInCourse,
    getPrerequisitesAntirequisites
} = require('../Controllers/student')

router.get('/:studentId/degrees', getMajorMinorConc)
router.get('/semesters', getSemesters)

router.patch('/:studentId/major/:majId', updateMajor)
router.patch('/:studentId/minor/:minId', updateMinor)
router.patch('/:studentId/conc/:concId', updateConc)

router.get('/courses', getAllCourses)
router.post('/:studentId/course/:courseId', createRating)

router.get('/semester-courses/:semId', getSemesterCourses)
router.get('/:studentId/semester-uncompleted-degree/:semId', getUncompletedDegreeCoursesForSemester)
router.get('/:studentId/semester-enrolled/:semId', getEnrolledCoursesForSemester)

router.route('/:studentId/:id/course-enroll/:id')
    .get(getSemesterCourse)
    .post(enrollInCourse)
    .delete(unenrollInCourse)

router.get('/semester/:id/course-rating/:id', getCourseAvgRating)
router.get('/semester/:id/course-pre-anti/:id', getPrerequisitesAntirequisites)

module.exports = router
