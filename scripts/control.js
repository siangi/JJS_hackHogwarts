import * as LoadClean from "./loadClean.js";
import * as Model from "./model.js";
import * as View from "./view.js";

window.onload = async () => {
    init();
};

async function init() {
    let students = await LoadClean.loadAndCleanStudents("./resources/students.json");
    View.showStudentList(students);
    Model.setStudentList(students);
}

export function getClickedStudent(fullname) {
    return Model.getFirstStudentByName(fullname);
}
