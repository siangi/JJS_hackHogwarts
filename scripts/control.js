import * as LoadClean from "./loadClean.js";
import * as Model from "./model.js";
import * as View from "./view.js";

window.onload = async () => {
    init();
    View.setSortingChange(sortingChange);
    View.setSortingDirectionChange(sortingDirectionChange);
};

async function init() {
    let students = await LoadClean.loadAndCleanStudents("./resources/students.json");
    View.showStudentList(students);
    Model.setStudentList(students);
}

export function getClickedStudent(fullname) {
    return Model.getFirstStudentByName(fullname);
}

export function sortingChange(newSorting) {
    let newList = Model.changeSortingCriteria(newSorting);
    View.showStudentList(newList);
}

export function sortingDirectionChange() {
    let newSorting = Model.toggleSortingDirection();
    View.showStudentList(newSorting.list);

    return newSorting.newDirection;
}
