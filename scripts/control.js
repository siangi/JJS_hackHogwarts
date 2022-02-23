import { loadAndCleanStudents } from "./loadClean.js";

window.onload = async () => {
    console.log("in control");
    let students = await loadAndCleanStudents("./resources/students.json");
    console.log("promiseorResult", students);
};
