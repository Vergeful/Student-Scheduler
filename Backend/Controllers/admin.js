const {StatusCodes} = require('http-status-codes')
const { pool } = require('../Database/connect');
const {BadRequestError, CantFindError} = require('../Errors')

const getAdminInfo = async(req, res) => {
    const { adminId } = req.params;
    const [rows] = await pool.promise().query(`SELECT Dep_id FROM ADMIN WHERE Id = ?`, [adminId]);
    if (rows.length == 1) {
        res.status(StatusCodes.OK).json(rows[0]);
        console.log(rows[0]);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Admin not found' });
    }
};

const getDeptDegrees = async (req, res) => {
    const { depId } = req.params;
    const [degrees] = await pool.promise().query(`SELECT * FROM DEGREE WHERE Dep_id = ?`, [depId]);
    if (degrees.length != 0) {
        res.status(StatusCodes.OK).json(degrees);
        console.log(degrees);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Degrees not found' });
    }
};

const getDeptCourses = async(req, res) => {
    const { depId } = req.params;
    const [courses] = await pool.promise().query(`
        SELECT c.ID, c.Code, c.Name, c.Description, c.Prof_id
        FROM COURSE AS c
        WHERE c.Dep_id = ?
    `, [depId]);   
     if (courses.length != 0) {
        res.status(StatusCodes.OK).json(courses);
        console.log(courses);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Degrees not found' });
    }};

const getDegreeRequiredCourses = async(req, res) => {
    const { degreeId } = req.params;
    const [courses] = await pool.promise().query(`
        SELECT c.ID, c.Code, c.Name, c.Description, c.Prof_id
        FROM COURSE AS c
        JOIN DEGREE_REQUIRES_COURSE AS drc ON c.ID = drc.Course_id
        WHERE drc.Degree_id = ?
    `, [degreeId]);   
    res.status(StatusCodes.OK).json(courses);
    console.log(courses);
};

const addRequiredCourse = async(req, res) => {
    const { degreeId, courseId } = req.params;
    await pool.promise().query(`
        INSERT INTO DEGREE_REQUIRES_COURSE (Degree_id, Course_id)
        VALUES (?, ?)
    `, [degreeId, courseId]);
    res.status(StatusCodes.CREATED).json({ message: 'Course added to degree successfully' });
};

const deleteRequiredCourse = async(req, res) => {
    const { degreeId, courseId } = req.params; // assuming courseId is part of the route parameters
    await pool.promise().query(`
        DELETE FROM DEGREE_REQUIRES_COURSE
        WHERE Degree_id = ? AND Course_id = ?
    `, [degreeId, courseId]);
    res.status(StatusCodes.OK).json({ message: 'Course removed from degree successfully' });
};

const getPrerequisites = async(req, res) => {
    const { courseId } = req.params;
    const [rows] = await pool.promise().query(`
        SELECT c.*
        FROM DB.COURSE AS c
        JOIN DB.COURSE_PREREQS AS cp ON c.ID = cp.Prereq_id
        WHERE cp.Course_id = ?   
    `, [courseId]);
    res.status(StatusCodes.OK).json(rows); 
    console.log(rows);

};

const getAntirequisites = async(req, res) => {
    const { courseId } = req.params;
    const [rows] = await pool.promise().query(`
        SELECT c.*
        FROM DB.COURSE AS c
        JOIN DB.COURSE_ANTIREQS AS ca ON c.ID = ca.Antireq_id
        WHERE ca.Course_id = ?
    `, [courseId]);
    res.status(StatusCodes.OK).json(rows); 
    console.log(rows);
};

const getProfs = async(req, res) => {
    const { adminId } = req.params; // You need to pass the adminId to this function.
    
    const [profRows] = await pool.promise().query(`
        SELECT p.Id, p.FName, p.LName
        FROM DB.PROFESSOR AS p
        INNER JOIN DB.ADD_PROFESSOR AS ap ON p.Id = ap.Prof_id
        WHERE ap.Admin_id = ?
    `, [adminId]);

    if (profRows.length === 0) {
        return res.status(404).json({ error: 'No professors found for this admin' });
    }

    console.log(profRows)

    res.status(200).json(profRows);
};

const updateCoursePrereqs = async(req, res) => {
    const { courseId } = req.params;
    const { prerequisites } = req.body;

     // Validate the provided courseId
     const [courseRows] = await pool.promise().query('SELECT * FROM COURSE WHERE ID = ?', [courseId]);
     if (courseRows.length === 0) {
         return res.status(404).json({ error: 'Course not found with provided ID.' });
     }
 
     // Delete existing prerequisites
     await pool.promise().query('DELETE FROM COURSE_PREREQS WHERE Course_id = ?', [courseId]);
 
     // Validate and insert new prerequisites
     for (const prereq of prerequisites) {
         const [prereqRows] = await pool.promise().query('SELECT ID FROM COURSE WHERE Code = ?', [prereq]);
         if (prereqRows.length > 0) {
             const prereqId = prereqRows[0].ID;
             await pool.promise().query('INSERT INTO COURSE_PREREQS (Course_id, Prereq_id) VALUES (?, ?)', [courseId, prereqId]);
         } else {
             console.error(`Prerequisite course code ${prereq} does not exist.`);
         }
     }
     console.log("Updated successfully");
     res.status(200).json({ message: 'Prerequisites updated successfully' });
};  

const updateCourseAntireqs = async(req, res) => {
    const { courseId } = req.params;
    const { antirequisites } = req.body;

    console.log("Entered func")
     const [courseRows] = await pool.promise().query('SELECT * FROM COURSE WHERE ID = ?', [courseId]);
     if (courseRows.length === 0) {
         return res.status(404).json({ error: 'Course not found with provided ID.' });
     }
 
     await pool.promise().query('DELETE FROM COURSE_ANTIREQS WHERE Course_id = ?', [courseId]);
 
     console.log("Deleted")

     for (const antireq of antirequisites) {
         const [antireqRows] = await pool.promise().query('SELECT ID FROM COURSE WHERE Code = ?', [antireq]);
         if (antireqRows.length > 0) {
             const antireqId = antireqRows[0].ID;
             await pool.promise().query('INSERT INTO COURSE_ANTIREQS (Course_id, Antireq_id) VALUES (?, ?)', [courseId, antireqId]);
         } else {
             console.error(`Prerequisite course code ${antireq} does not exist.`);
         }
     }
     console.log("Updated successfully");
     res.status(200).json({ message: 'Antirequisites updated successfully' });
};  

const updateCourseProf = async(req, res) => {
    const { courseId, profId } = req.params;
    const [courseRows] = await pool.promise().query('SELECT * FROM COURSE WHERE ID = ?', [courseId]);
    if (courseRows.length === 0) {
        return res.status(404).json({ error: 'Course not found with provided ID.' });
    }

    const [professorRows] = await pool.promise().query('SELECT * FROM PROFESSOR WHERE ID = ?', [profId]);
    if (professorRows.length === 0) {
        return res.status(404).json({ error: 'Professor not found with provided ID.' });
    }

    // Update the course with the new professor ID
    await pool.promise().query('UPDATE COURSE SET Prof_id = ? WHERE ID = ?', [profId, courseId]);

    console.log("Professor " + profId + " updated successfully");
    res.status(200).json({ message: 'Course updated successfully with new professor.' });
};  

module.exports = {
    getAdminInfo,
    getDeptDegrees,
    getDeptCourses,
    getDegreeRequiredCourses,
    addRequiredCourse,
    deleteRequiredCourse,
    getPrerequisites,
    getAntirequisites,
    getProfs,
    updateCoursePrereqs,
    updateCourseAntireqs,
    updateCourseProf
}