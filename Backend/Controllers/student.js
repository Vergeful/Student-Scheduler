const {StatusCodes} = require('http-status-codes')
const { pool } = require('../Database/connect');

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

const getAllDegrees= async(req, res) => {
    const [rows] = await pool.promise().query(`
        SELECT  ID AS DEGREE_ID, Name AS DEGREE_NAME
        FROM    DEGREE`);
    
    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows);
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
        SET		STUDENT.Conc_id = ?
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
            return res.json("Rating could not be created.");
        });
    res.status(StatusCodes.CREATED).json();
}

const getSemesterCourses= async(req, res) => {
    const { semId } = req.params;
    const [rows] = await pool.promise().query(`
        SELECT	C.ID AS COURSE_ID, C.Code AS COURSE_CODE, C.Name AS COURSE_NAME, C.Description AS COURSE_DESCRIPTION,
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
    const {studentId, semId } = req.params;
    const [rows] = await pool.promise().query(`
            SELECT	    C.ID AS COURSE_ID, C.Code AS COURSE_CODE, C.Name AS COURSE_NUMBER
            FROM		COURSE AS C, SEMESTER_OFFERS_COURSE AS T,
                        STUDENT AS S, DEGREE_REQUIRES_COURSE AS R
            WHERE	    T.Semester_id = ? AND C.ID = T.Course_id	
            AND		    S.ID = ? AND S.Major_id = R.Degree_id
            AND		    C.ID = R.Course_id
            AND     C.ID NOT IN
                    (   SELECT	    C.ID
                        FROM		STUDENT AS S, ENROLLED_IN AS E, COURSE AS C
                        WHERE 	    S.ID = ? AND S.ID = E.Student_id
                        AND		    C.ID = E.Course_id)`, 
        [semId, studentId, studentId]);
    console.log(rows);
    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Uncompleted degree-required courses offered during semester could not be found' });
    }
}

const getEnrolledCoursesForSemester= async(req, res) => {
    const {studentId, semId } = req.params;
    const [rows] = await pool.promise().query(`
        SELECT	    C.ID AS COURSE_ID, C.Code AS COURSE_CODE, C.Name AS COURSE_NUMBER
        FROM		COURSE AS C, SEMESTER_OFFERS_COURSE AS T, ENROLLED_IN AS E
        WHERE	    T.Semester_id = ? AND C.ID = T.Course_id	
        AND		    E.Student_id = ? AND E.Course_id = C.ID`, 
    [semId, studentId]);
    console.log(rows);
    if (rows.length > 0) {
    res.status(StatusCodes.OK).json(rows);
    } else {
    res.status(StatusCodes.NOT_FOUND).json({ error: 'Enrolled courses for selected semester could not be found' });
    }
}

const getSemesterCourse= async(req, res) => {
    const {courseId } = req.params;
    const [rows] = await pool.promise().query(`
        SELECT  ID AS COURSE_ID, Code AS COURSE_CODE, Name AS COURSE_NAME
        FROM    COURSE
        WHERE   ID = ?`,
    [courseId]);
    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Course could not be found' });
    }
}

const getCourseAvgRating= async(req, res) => {
    const {courseId } = req.params;
    const [rows] = await pool.promise().query(`
        SELECT	    AVG(Difficulty) AS AVERAGE_COURSE_DIFFICULTY
        FROM 		RATING
        WHERE	    Course_id = ?`, 
    [courseId]);

    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows[0]);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Average rating for course could not be found.' });
    }
}

const enrollInCourse= async(req, res) => {
    const { studentId, courseId } = req.params;

    const insertQuery = `INSERT INTO ENROLLED_IN VALUES (?, ?)`;
    const insertValues = [studentId, courseId];

    await pool.promise().query
        (insertQuery, insertValues, (err, data) => {
            if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
            return res.json("Course could not be enrolled into");
        });
    res.status(StatusCodes.OK).json();

}

const unenrollInCourse= async(req, res) => {
    const { studentId, courseId } = req.params;

    const deleteQuery = `DELETE FROM	ENROLLED_IN
                                WHERE	Student_id = ?
                                AND		Course_id = ?`;
    const deleteValues = [studentId, courseId];

    await pool.promise().query
        (deleteQuery, deleteValues, (err, data) => {
            if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
            return res.json("Course could not be unenrolled from");
        });
    res.status(StatusCodes.OK).json();
}

const getPrerequisites= async(req, res) => {
    const {courseId } = req.params;
    const [rows] = await pool.promise().query(`
        SELECT	    C.Code AS COURSE_CODE, C.Name AS COURSE_NAME
        FROM		COURSE AS C, COURSE_PREREQS AS P
        WHERE	    P.Course_id = ?
        AND 		C.ID = P.Prereq_id `, 
    [courseId]);

    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows[0]);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Course prereqs could not be found' });
    }
}

const getAntirequisites= async(req, res) => {
    const {courseId } = req.params;
    const [rows] = await pool.promise().query(`
        SELECT	    C.Code AS COURSE_CODE, C.Name AS COURSE_NAME
        FROM		COURSE AS C, COURSE_ANTIREQS AS A
        WHERE	    A.Course_id = ?
        AND 		C.ID = A.Antireq_id `, 
    [courseId]);

    if (rows.length > 0) {
        res.status(StatusCodes.OK).json(rows[0]);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Course antireqs could not be found' });
    }
}

module.exports = {
    getMajorMinorConc,
    getAllDegrees,
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
    getPrerequisites,
    getAntirequisites
}

