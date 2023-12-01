const express = require('express')
const router = express.Router()

const {
    getDegreesDepartmentCourses,
    getDegreeCourses,
    createRequiredCourse,
    deleteRequiredCourse,
    getPrerequisitesAntirequisites,
    createAntirequisite,
    deleteAntirequisite,
    createPrerequisite,
    deletePrerequisite,
    getProfs,
    addProf,
    deleteProf
} = require('../Controllers/admin')

router.route('/admin').get(getDegreesDepartmentCourses)
router.route('/admin/degree/:id').get(getDegreeCourses).post(createRequiredCourse).delete(deleteRequiredCourse)
router.route('/admin/degree/:id/course/:id').get(getPrerequisitesAntirequisites)
router.route('/admin/degree/:id/course/:id/anti/:id').post(createAntirequisite).delete(deleteAntirequisite)
router.route('/admin/degree/:id/course/:id/pre/:id').post(createPrerequisite).delete(deletePrerequisite)
router.route('/admin/dept-course/:id').get(getProfs).post(addProf).delete(deleteProf);

module.exports = router

