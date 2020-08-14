const config = {
  
    database: {
        connectionString: 'postgres://nrkkvdll:fRdN-DupkKbV1pE8rbn8QLE9nzPqf7r2@manny.db.elephantsql.com:5432/nrkkvdll',
    },

    tableNames: {
        roles: 'roles',
        users: 'users',
        courses: 'course',
        course_types: 'course_types',
        user_roles: 'user_roles'
    },

    tokenKey: "ekinturhanyardırıyoroye",

    materialTypes: { // Strict

        videoFile: 1,
        pdfFile: 2,
        youTubeFile: 3
    },

    permissionTypes: {
        crud_operations: 1,
        participate_course: 2,
        create_course: 3,
        manage_course: 4,
        manage_exam: 5
    },

    paths: {
        videoPath: "/videos/",
        pdfPath: "/documents/"
    },

    roles: {
        course_coordinator: 1,
        exam_coordinator: 2,
        exam_instructor: 3,
        admin: 4,
        human_resources: 6,
        course_participant: 7,
        exam_participant: 8
    }
};

module.exports = config;