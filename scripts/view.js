"use strict";

import { Person, HOUSES, ROLES } from "./Student.js";

export function showStudentList(students) {
    let container = document.querySelector("#studentList");
    container.replaceChildren(...[]);

    students.forEach(showStudent);
}

function showStudent(student) {
    let clone = document.querySelector("#studentTemplate").content.cloneNode(true);
    let parent = document.querySelector("#studentList");

    clone.querySelector("[data-field='portrait']").setAttribute("src", student.filename);
    clone.querySelector("[data-field='fullname']").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
    clone.querySelector("[data-field='roles']").textContent = buildRolesString(student.roles);
    setHouseClass(clone.querySelector("[data-field='housecolor'"), student.house);

    parent.appendChild(clone);
}

function buildRolesString(roles) {
    let allRoles = "";
    roles.forEach((role) => {
        allRoles += role + ", ";
    });
    if (allRoles.endsWith(", ")) {
        allRoles.substring(0, allRoles.length - 1);
    }

    return allRoles;
}

// gives the student html object the proper class, so the proper housecolor is displayed
function setHouseClass(houseColorNode, house) {
    houseColorNode.classList.add(house.toLowerCase());
}
