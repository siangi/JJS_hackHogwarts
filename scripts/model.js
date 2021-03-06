"use strict";
import * as Objects from "./Student.js";
import * as loadClean from "./loadClean.js";

// the enum values correspond to the property names on the student object
// if they change, we only have to change them here for sorting.
const SORT_PROPERTIES = {
    FIRST_NAME: "firstname",
    LAST_NAME: "lastname",
    HOUSE: "house",
    JOBS: "roles",
};

let studentList = [];
let displayedStudents = [];
let systemHacked = false;

let sorting = {
    ASCENDING_STRING: "asc",
    DESCENDING_STRING: "desc",
    criteria: "firstname",
    direction: "asc",
};

export function setStudentList(list) {
    studentList = list;

    // for initialList, filter out all expelled students
    changeFilter("expelled", false);
    changeSortingCriteria("firstname");
}

export function getDisplayedList() {
    return displayedStudents;
}

export function getFirstStudentByName(fullname) {
    let possibles = filterListByfullName(fullname);
    if (possibles.length === 0) {
        return null;
    } else {
        return possibles[0];
    }
}

export function hackTheSystem() {
    if (systemHacked) {
        return;
    }

    let hacker = loadClean.createHacker();
    studentList.push(hacker);
    displayedStudents.push(hacker);
    initOldBloodStatus();
    randomizeBloodstatus();
    systemHacked = true;
}

// we need to remember the original Bloodstatus so we create a new property called oldBLoodstatus
function initOldBloodStatus() {
    studentList.forEach((student) => {
        student.oldBloodstatus = student.bloodstatus;
    });
}

function randomizeBloodstatus() {
    studentList.forEach((student) => {
        if (student.oldBloodstatus === Objects.BLOODSTATUS.pureblood) {
            let randomVal = Math.random();
            if (randomVal > 0.5) {
                student.bloodstatus = Objects.BLOODSTATUS.halfBlood;
            } else {
                student.bloodstatus = Objects.BLOODSTATUS.muggleBorn;
            }
        } else {
            student.bloodstatus = Objects.BLOODSTATUS.pureblood;
        }
    });
}

function filterListByfullName(fullname) {
    return studentList.filter(compareFullname);

    function compareFullname(student) {
        let studentfullname = Objects.createFullnameFromParts(student.firstname, student.middlename, student.lastname);

        return studentfullname === fullname;
    }
}

function sortBy(property, direction) {
    // flag if we need to call property.toString() before comparing
    let stringify = false;

    // check if allowed property, set stringify
    switch (property) {
        case SORT_PROPERTIES.FIRST_NAME:
        case SORT_PROPERTIES.LAST_NAME:
        case SORT_PROPERTIES.HOUSE:
            break;
        case SORT_PROPERTIES.JOBS:
            stringify = true;
            break;
        default:
            console.error("list not sortable by: " + property);
            break;
    }

    let sorterFunc = sortByWithProperty;
    if (stringify) {
        sorterFunc = sortByWithPropertyStringify;
    }

    if (direction === sorting.DESCENDING_STRING) {
        displayedStudents.sort((studentA, studentB) => descendingModifier(sorterFunc(studentA, studentB)));
    } else {
        displayedStudents.sort(sorterFunc);
    }

    return displayedStudents;

    function sortByWithProperty(studentA, studentB) {
        return studentA[property].localeCompare(studentB[property]);
    }

    function sortByWithPropertyStringify(studentA, studentB) {
        return studentA[property].toString().localeCompare(studentB[property].toString());
    }

    function descendingModifier(sortResult) {
        return sortResult * -1;
    }
}

// sort the displayed List with the same criteria, but in the other direction, returns the list and new direction
export function toggleSortingDirection() {
    if (sorting.direction === sorting.ASCENDING_STRING) {
        sorting.direction = sorting.DESCENDING_STRING;
    } else {
        sorting.direction = sorting.ASCENDING_STRING;
    }

    let sorted = sortBy(sorting.criteria, sorting.direction);
    return { list: sorted, newDirection: sorting.direction };
}

// sort the displayed List by new Criteria, returns the list
export function changeSortingCriteria(newCriteria) {
    sorting.criteria = newCriteria;
    return sortBy(sorting.criteria, sorting.direction);
}

export function changeFilter(newCategory, newCriteria) {
    let filteredList;
    if (newCategory === "none") {
        filteredList = filter("expelled", false, studentList);
    } else if (newCategory === "expelled") {
        filteredList = filter(newCategory, newCriteria, studentList);
    } else {
        // if we arent filtering to show the expelled students, always exclude them.
        filteredList = filter(newCategory, newCriteria, studentList);
        filteredList = filter("expelled", false, filteredList);
    }

    displayedStudents = filteredList;
    return filteredList;
}

export function filter(newCategory, newCriteria, list) {
    if (newCategory === "roles") {
        return list.filter(filterWithPropAndValContains);
    } else if (newCategory === "expelled") {
        return list.filter(filterWithPropAndValDirect);
    } else {
        return list.filter(filterWithPropAndVal);
    }

    function filterWithPropAndVal(student) {
        return student[newCategory].toLowerCase() === newCriteria.toLowerCase();
    }

    function filterWithPropAndValContains(student) {
        return student[newCategory].indexOf(newCriteria) > -1;
    }

    function filterWithPropAndValDirect(student) {
        return student[newCategory] === newCriteria;
    }
}

export function search(searchString) {
    let lower = searchString.toLowerCase();
    displayedStudents = studentList.filter(checkAllNames);

    function checkAllNames(person) {
        return (
            person.nickname.toLowerCase().indexOf(searchString) >= 0 ||
            Objects.createFullnameFromParts(person.firstname, person.middlename, person.lastname).toLowerCase().indexOf(lower) >= 0
        );
    }

    return displayedStudents;
}

export function getStats() {
    let displayed = displayedStudents.length;
    let gryffindor = filter("house", Objects.HOUSES.gryffindor, studentList).length;
    let ravenclaw = filter("house", Objects.HOUSES.ravenclaw, studentList).length;
    let hufflepuff = filter("house", Objects.HOUSES.hufflepuff, studentList).length;
    let slytherin = filter("house", Objects.HOUSES.slytherin, studentList).length;
    let expelled = filter("expelled", true, studentList).length;

    return { displayed, gryffindor, ravenclaw, hufflepuff, slytherin, expelled };
}

export function expelStudent(student) {
    if (systemHacked && student.nickname === "Hackerman") {
        return;
    }
    // an expelled students cant take any additional responsibilities
    student.roles = [];

    student.expelled = true;

    // filter the expelled student out.
    displayedStudents = filter("expelled", false, displayedStudents);
}

export function toggleCaptainStatus(student) {
    let index = student.roles.indexOf(Objects.ROLES.captain);
    if (index >= 0) {
        student.roles.splice(index, 1);
    } else {
        student.roles.push(Objects.ROLES.captain);
    }
}

export function toggleInquisitorStatus(student, notAllowedFunc, removedAgainFunc) {
    let index = student.roles.indexOf(Objects.ROLES.inquisitor);
    if (index >= 0) {
        student.roles.splice(index, 1);
    } else {
        if (isStudentAllowedInquisitor(student)) {
            student.roles.push(Objects.ROLES.inquisitor);

            if (systemHacked) {
                setTimeout(() => {
                    student.roles.splice(index, 1);
                    removedAgainFunc(`${student.firstname} ${student.lastname}`);
                }, 10000);
            }
        } else {
            notAllowedFunc();
        }
    }
}

export function isStudentAllowedInquisitor(student) {
    return student.bloodstatus === Objects.BLOODSTATUS.pureblood || student.house === Objects.HOUSES.slytherin;
}

function tryGetOtherPrefect(student) {
    let onlyHouse = filter("house", student.house, studentList);
    let onlyPrefect = filter("roles", Objects.ROLES.prefect, onlyHouse);
    let sameGender = filter("gender", student.gender, onlyPrefect);

    if (sameGender.length === 0) {
        return null;
    } else {
        return sameGender[0];
    }
}

export function togglePrefectStatus(student, removeAnotherFunc) {
    let index = student.roles.indexOf(Objects.ROLES.prefect);

    // if he already is a prefect we can just remove th role and leave
    if (index >= 0) {
        student.roles.splice(index, 1);
        return;
    }

    let otherPrefect = tryGetOtherPrefect(student);
    if (otherPrefect == null) {
        student.roles.push(Objects.ROLES.prefect);
        return;
    }

    //there already is another prefect so we need to either remove one or abort
    // if removeAnotherFunc returns true, the other one was removed
    let removed = removeAnotherFunc(student, otherPrefect, changePrefects);

    function changePrefects() {
        let otherIndex = otherPrefect.roles.indexOf(Objects.ROLES.prefect);
        otherPrefect.roles.splice(otherIndex, 1);
        student.roles.push(Objects.ROLES.prefect);
        console.log("called RemoveListener, " + student.firstname);
    }
}
