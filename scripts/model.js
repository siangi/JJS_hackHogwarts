"use strict";
import * as Student from "./Student.js";

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

let sorting = {
    ASCENDING_STRING: "asc",
    DESCENDING_STRING: "desc",
    criteria: "firstname",
    direction: "asc",
};

export function setStudentList(list) {
    studentList = list;
    displayedStudents = list;
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
