import * as LoadClean from "./loadClean.js";
import * as Model from "./model.js";
import * as View from "./view.js";

window.onload = async () => {
    init();
    View.setSortingChange(sortingChange);
    View.setSortingDirectionChange(sortingDirectionChange);
    View.setFilterChange(filterChange);
};

async function init() {
    let students = await LoadClean.loadAndCleanStudents("./resources/students.json");
    Model.setStudentList(students);
    students = Model.changeFilter("expelled", false);
    View.showStudentList(students);
    View.showStats(Model.getStats());
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

export function filterChange(property, value) {
    let filteredList = Model.changeFilter(property, value);
    View.showStats(Model.getStats());
    View.showStudentList(filteredList);
}

function updateStudentsOnView(newList) {
    View.showStudentList(newList);
}
