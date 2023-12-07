const {StatusCodes} = require('http-status-codes')
const { db } = require('../Database/connect');
const {BadRequestError, CantFindError} = require('../Errors')

const getAdminInfo = async(req, res) => {
    let connection;
    try {
        const { adminId } = req.params;
        connection = await db.getConnection();
        const [rows] = await connection.query(`
            SELECT Dep_id FROM ADMIN WHERE Id = ?
        `, [adminId]);
        if (rows.length > 0) {
            res.status(StatusCodes.OK).json(rows[0]);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Admin not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getDepartmentCourses = async(req, res) => {
    let connection;
    try {
        const { depId } = req.params;
        connection = await db.getConnection();
        const [courses] = await connection.query(`
            SELECT COURSE.Id, COURSE.Code, COURSE.Name, COURSE.Description
            FROM COURSE
            WHERE COURSE.Dep_id = ?
        `, [depId]);
        res.status(StatusCodes.OK).json(courses);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getDeptDegrees = async (req, res) => {
    let connection;
    try {
        console.log(req.params)
        const { depId } = req.params;
        connection = await db.getConnection();
        const [degrees] = await connection.query(`SELECT * FROM DEGREE WHERE Dep_id = ?`, [depId]);
        res.status(StatusCodes.OK).json(degrees);
    } catch (error) {
        console.error('Error fetching degrees:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getDegreeCourses = async(req, res) => {
    let connection;
    try {
        const { degreeId } = req.params;
        connection = await db.getConnection();
        const [rows] = await connection.query(`
            SELECT c.* FROM COURSE c
            JOIN DEGREE_REQUIRES_COURSE drc ON c.Id = drc.Course_id
            WHERE drc.Degree_id = ?
        `, [degreeId]);
        res.status(StatusCodes.OK).json(rows);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const addRequiredCourse = async(req, res) => {
    let connection;
    try {
        const { degreeId } = req.params;
        const { courseId } = req.body; // assuming the courseId is sent in the request body
        connection = await db.getConnection();
        await connection.query(`
            INSERT INTO DEGREE_REQUIRES_COURSE (Degree_id, Course_id)
            VALUES (?, ?)
        `, [degreeId, courseId]);
        res.status(StatusCodes.CREATED).json({ message: 'Course added to degree successfully' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const deleteRequiredCourse = async(req, res) => {
    let connection;
    try {
        const { degreeId, courseId } = req.params; // assuming courseId is part of the route parameters
        connection = await db.getConnection();
        await connection.query(`
            DELETE FROM DEGREE_REQUIRES_COURSE
            WHERE Degree_id = ? AND Course_id = ?
        `, [degreeId, courseId]);
        res.status(StatusCodes.OK).json({ message: 'Course removed from degree successfully' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getPrerequisites = async(req, res) => {
    let connection;
    try {
        const { courseId } = req.params;
        connection = await db.getConnection();
        const [rows] = await connection.query(`
            SELECT Prereq_id FROM COURSE_PREREQS WHERE Course_id = ?
        `, [courseId]);
        res.status(StatusCodes.OK).json(rows);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getAntirequisites = async(req, res) => {
    let connection;
    try {
        const { courseId } = req.params;
        connection = await db.getConnection();
        const [rows] = await connection.query(`
            SELECT Antireq_id FROM COURSE_ANTIREQS WHERE Course_id = ?
        `, [courseId]);
        res.status(StatusCodes.OK).json(rows);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getProfs = async(req, res) => {
    let connection;
    try {
        const { adminId } = req.params; // You need to pass the adminId to this function.
        connection = await db.getConnection();

        // First, get the department ID associated with the admin.
        const [adminRows] = await connection.query(`
            SELECT Dep_id FROM ADMIN WHERE Id = ?
        `, [adminId]);

        // Check if the admin has a department id associated.
        if (adminRows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Admin not found or has no department' });
        }

        const departmentId = adminRows[0].Dep_id;

        // Now, get all professors from the same department.
        const [profRows] = await connection.query(`
            SELECT Id, FName, LName FROM PROFESSOR WHERE Dep_id = ?
        `, [departmentId]);

        res.status(StatusCodes.OK).json(profRows);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Helper function for selective update of prerequisites and antirequisites
async function selectiveUpdate(connection, courseId, newRequirements, tableName, columnIdName) {
    const [existingRequirements] = await connection.query(`
        SELECT ${columnIdName} FROM ${tableName} WHERE Course_id = ?
    `, [courseId]);

    const existingReqIds = existingRequirements.map(req => req[columnIdName]);

    const reqsToRemove = existingReqIds.filter(id => !newRequirements.includes(id));
    const reqsToAdd = newRequirements.filter(id => !existingReqIds.includes(id));

    for (const reqId of reqsToRemove) {
        await connection.query(`
            DELETE FROM ${tableName} WHERE Course_id = ? AND ${columnIdName} = ?
        `, [courseId, reqId]);
    }

    for (const reqId of reqsToAdd) {
        await connection.query(`
            INSERT INTO ${tableName} (Course_id, ${columnIdName}) VALUES (?, ?)
        `, [courseId, reqId]);
    }
};


const updateCourse = async(req, res) => {
    let connection;

    try {
        const { courseId } = req.params;
        const { newPrerequisites, newAntirequisites, newProfId } = req.body;

        // Connect to the database
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Update Prof_id if it's different from the current one
        if (newProfId) {
            const [currentProf] = await connection.query(`
                SELECT Prof_id FROM COURSE WHERE Id = ?
            `, [courseId]);

            if (currentProf[0].Prof_id !== newProfId) {
                await connection.query(`
                    UPDATE COURSE SET Prof_id = ? WHERE Id = ?
                `, [newProfId, courseId]);
            }
        }

        // Selective update for prerequisites
        await selectiveUpdate(connection, courseId, newPrerequisites, 'COURSE_PREREQS', 'Prereq_id');

        // Selective update for antirequisites
        await selectiveUpdate(connection, courseId, newAntirequisites, 'COURSE_ANTIREQS', 'Antireq_id');

        // Commit the transaction
        await connection.commit();
        res.status(StatusCodes.OK).json({ message: 'Course updated successfully' });
    } catch (error) {
        // If we catch an error, we rollback any changes made during the transaction
        if (connection) {
            await connection.rollback();
        }

        // Close the database connection if it was opened
        if (connection && connection.end) {
            await connection.end();
        }

        // Error handling
        if (error instanceof BadRequestError) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        } else if (error instanceof CantFindError) {
            res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
        } else {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
        }
    }
};


module.exports = {
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
}