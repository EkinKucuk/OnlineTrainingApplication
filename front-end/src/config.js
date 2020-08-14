const config = {

    dbPath: "http://localhost:3010",

    roles: {
        course_coordinator: 1,
        exam_coordinator: 2,
        exam_instructor: 3,
        admin: 4,
        human_resources: 6,
        course_participant: 7,
        exam_participant: 8
    },

    permissionTypes: {
        crud_operations: 1,
        participate_course: 2,
        create_course: 3,
        manage_course: 4,
        manage_exam: 5
    },
}

export default config;