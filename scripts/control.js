import * as LoadClean from "./loadClean.js";
import * as Model from "./model.js";
import * as View from "./view.js";
import * as Objects from "./Student.js";

window.onload = async () => {
    init();
    View.setSortingChange(sortingChange);
    View.setSortingDirectionChange(sortingDirectionChange);
    View.setFilterChange(filterChange);
    View.setRoleChanged(handleRoleChange);
    View.setExpelStudent(expelStudent);
    View.setSearch(search);
};

async function init() {
    let students = await LoadClean.loadAndCleanStudents("http://petlatkea.dk/2021/hogwarts/students.json ", "http://petlatkea.dk/2021/hogwarts/families.json ");
    Model.setStudentList(students);

    View.showStudentList(Model.getDisplayedList());
    View.showStats(Model.getStats());
}

export function search(searchString) {
    let newList = Model.search(searchString);
    View.showStudentList(newList);
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

// takes some info about the student and the toggled role. If the change is allowed, it will return true.
export function handleRoleChange(changedRole, firstname, middlename, lastname) {
    let student = Model.getFirstStudentByName(Objects.createFullnameFromParts(firstname, middlename, lastname));

    if (changedRole === Objects.ROLES.inquisitor) {
        inquisitorChanged(student);
    } else if (changedRole === Objects.ROLES.prefect) {
        prefectChanged(student);
    } else if (changedRole === Objects.ROLES.captain) {
        Model.toggleCaptainStatus(student);
    } else {
        console.error("unsupported role: " + changedRole);
    }

    return student.roles;
}

function expelStudent(firstname, middlename, lastname) {
    let fullname = Objects.createFullnameFromParts(firstname, middlename, lastname);
    let student = Model.getFirstStudentByName(fullname);
    // implement expel student, strip him of all jobs
    Model.expelStudent(student);
    View.showStudentList(Model.getDisplayedList());
    View.showStats(Model.getStats());
    return student;
}

function inquisitorChanged(student) {
    Model.toggleInquisitorStatus(student, View.InquisitorNotAllowed, View.showUnInquistored);
}

function prefectChanged(student) {
    Model.togglePrefectStatus(student, View.showPrefectDialog);
}

export function hackTheSystem() {
    Model.hackTheSystem();
    View.showStudentList(Model.getDisplayedList());
    View.showStats(Model.getStats());
}
