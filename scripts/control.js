import * as LoadClean from "./loadClean.js";
import * as Model from "./model.js";
import * as View from "./view.js";

window.onload = async () => {
    let students = await LoadClean.loadAndCleanStudents("./resources/students.json");
    console.log("inController", students);

    View.showStudentList(students);
};
