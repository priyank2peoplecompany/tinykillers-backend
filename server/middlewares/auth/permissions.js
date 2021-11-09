const All = ['admin', 'superadmin', 'student', 'faculty'];
const [Admin, SuperAdmin, Student, Faculty] = All;

module.exports = {
    'permissions': [

        //College
        { method: 'post', 'api': "/college/add", 'allowed': [SuperAdmin] },

        //Faculty
        { method: 'post', 'api': "/faculty/add", 'allowed': [Admin] },
        { method: 'post', 'api': "/faculty/list", 'allowed': [Admin] },
        { method: 'post', 'api': "/faculty/update", 'allowed': [Faculty] },

        //Role
        { method: 'post', 'api': "/role/create", 'allowed': [...All] },
        { method: 'post', 'api': "/role/list", 'allowed': [...All] },

        //Student
        { method: 'post', 'api': "/student/add", 'allowed': [Admin] },
        { method: 'post', 'api': "/student/list", 'allowed': [Admin] },
        { method: 'post', 'api': "/student/update", 'allowed': [Student] },

        //User
        { method: 'post', 'api': "/file/upload", 'allowed': [...All] },
        { method: 'post', 'api': "/user/changepwd", 'allowed': [Admin, Student, Faculty] },
    ]
};