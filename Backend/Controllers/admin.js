const {StatusCodes} = require('http-status-codes')
const {BadRequestError, CantFindError} = require('../Errors')

const getDegreesDepartmentCourses= async(req, res) => {

}

const getDegreeCourses= async(req, res) => {

}

const createRequiredCourse= async(req, res) => {

}

const deleteRequiredCourse= async(req, res) => {

}

const getPrerequisitesAntirequisites= async(req, res) => {

}

const createAntirequisite= async(req, res) => {

}

const deleteAntirequisite= async(req, res) => {

}

const createPrerequisite= async(req, res) => {

}

const deletePrerequisite= async(req, res) => {

}

const createProf= async(req, res) => {

}

const deleteProf= async(req, res) => {

}


module.exports = {
    getDegreesDepartmentCourses,
    getDegreeCourses,
    createRequiredCourse,
    deleteRequiredCourse,
    getPrerequisitesAntirequisites,
    createAntirequisite,
    deleteAntirequisite,
    createPrerequisite,
    deletePrerequisite,
    createProf,
    deleteProf
}