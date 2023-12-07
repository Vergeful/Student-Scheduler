const {StatusCodes} = require('http-status-codes')
const { pool } = require('../Database/connect');
const {BadRequestError, CantFindError} = require('../Errors')

const getMajorMinorConc= async(req, res) => {
    const { studentId } = req.params;
    const [rows] = await pool.promise().query(`
        SELECT  MAJ.Name AS MAJOR, MIN.Name AS MINOR, C.Name AS CONCENTRATION
        FROM    STUDENT AS S JOIN DEGREE AS MAJ JOIN DEGREE AS MIN JOIN DEGREE AS C
        WHERE   S.ID = ? AND S.Major_id = MAJ.ID 
        AND     S.Minor_id = MIN.ID AND S.Conc_id = C.ID`, 
    [studentId]);
    
    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows[0]);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Student degree information could not be found' });
    }
}

const updateMajor= async(req, res) => {
    const { studentId, majId } = req.params;
    const [rows] = await pool.promise().query(`
        UPDATE	STUDENT
        SET		STUDENT.Major_id = ?
        WHERE	STUDENT.Id = ?`, 
    [majId, studentId]);
    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows[0]);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Major could not be updated' });
    }
}

const updateMinor= async(req, res) => {
    const { studentId, minId } = req.params;
    const [rows] = await pool.promise().query(`
        UPDATE	STUDENT
        SET		STUDENT.Minor_id = ?
        WHERE	STUDENT.Id = ?`, 
    [minId, studentId]);
    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows[0]);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Minor could not be updated' });
    }
}

const updateConc= async(req, res) => {
    const { studentId, concId} = req.params;
    const [rows] = await pool.promise().query(`
        UPDATE	STUDENT
        SET		STUDENT.Minor_id = ?
        WHERE	STUDENT.Id = ?`, 
    [concId, studentId]);
    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Concentration could not be updated' });
    }
}

const getSemesters= async(req, res) => {
    const [rows] = await pool.promise().query(`
        SELECT  ID AS SEMESTER_ID, Name AS SEMESTER_NAME, Year AS SEMESTER_YEAR
        FROM    SEMESTER`);
    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Semesters could not be found' });
    }
}

const getAllCourses= async(req, res) => {
    const [rows] = await pool.promise().query(`
        SELECT  ID AS COURSE_ID, Code AS COURSE_CODE, Name AS COURSE_NAME
        FROM    COURSE`);
    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Courses could not be found' });
    }
}

const createRating= async(req, res) => {
    const { studentId, courseId } = req.params;
    const { difficulty, comment} = req.body;

    const insertQuery = `INSERT INTO RATING VALUES (?, ?, ?, ?)`;
    const insertValues = [studentId, courseId, difficulty, comment];

    await pool.promise().query
        (insertQuery, insertValues, (err, data) => {
            if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
            return res.json("Post has been created.");
        });

    res.status(StatusCodes.OK).json();
}

const getSemesterCourses= async(req, res) => {
    const { semId } = req.params;
    const [rows] = await pool.promise().query(`
        SELECT	C.ID AS COURSE_ID, C.Code AS COURSE_CODE, C.Name AS COURSE_NUMBER, C.Description AS COURSE_DESCRIPTION,
                P.FName AS PROFESSOR_FIRST_NAME, P.LName AS PROFESSOR_LAST_NAME
        FROM	COURSE AS C, SEMESTER_OFFERS_COURSE AS S, PROFESSOR AS P
        WHERE	S.Semester_id = ?
        AND 	C.ID = S.Course_id
        AND     C.Prof_id = P.ID`, 
    [semId]);

    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Semester courses could not be found' });
    }
}

const getUncompletedDegreeCoursesForSemester= async(req, res) => {
    
}

const getEnrolledCoursesForSemester= async(req, res) => {
    
}

const getSemesterCourse= async(req, res) => {
    
}

const getCourseAvgRating= async(req, res) => {
    
}

const updateEnrollmentForCourse= async(req, res) => {
    
}

const getPrerequisitesAntirequisites= async(req, res) => {
    
}

module.exports = {
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
}


