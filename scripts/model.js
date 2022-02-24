import * as Student from "./Student.js";
let studentList = [];

export function setStudentList(list) {
    studentList = list;
}

export function getFirstStudentByName(fullname) {
    let possibles = filterListByfullName(fullname);
    if (possibles.length === 0) {
        return null;
    } else {
        return possibles[0];
    }
}

function filterListByfullName(fullname) {
    return studentList.filter(compareFullname);

    function compareFullname(student) {
        let studentfullname = Student.createFullnameFromParts(student.firstname, student.middlename, student.lastname);

        return studentfullname === fullname;
    }
}
