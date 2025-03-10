const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent } = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const queryStr = req.url.split('?')[1] || '';

    const filters = {};

    if (queryStr.includes('class=')) {
        const classVal = queryStr.match(/class=([^,&]+)/);
        if (classVal) filters.className = classVal[1];
    }

    if (queryStr.includes('name=')) {
        const nameVal = queryStr.match(/name=([^,&]+)/);
        if (nameVal) filters.name = decodeURIComponent(nameVal[1]);
    }

    if (queryStr.includes('section=')) {
        const sectionVal = queryStr.match(/section=([^,&]+)/);
        if (sectionVal) filters.section = sectionVal[1];
    }

    if (queryStr.includes('roll=')) {
        const rollVal = queryStr.match(/roll=([^,&]+)/);
        if (rollVal) filters.roll = rollVal[1];
    }

    const students = await getAllStudents(filters);
    res.json({ students });
})

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await getStudentDetail(id);
    res.json(student);
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const message = await addNewStudent(req.body);
    res.json(message);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = {
        ...req.body,
        userId: id
    };
    const message = await updateStudent(payload);
    res.json(message);
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { status, reviewerId } = req.body;

    const message = await setStudentStatus({ userId, reviewerId, status });
    res.json(message);
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};
