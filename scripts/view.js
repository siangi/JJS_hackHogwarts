"use strict";

import { Person, HOUSES, ROLES } from "./Student.js";
import * as Controller from "./control.js";

export function showStudentList(students) {
    let container = document.querySelector("#studentList");
    container.replaceChildren(...[]);

    students.forEach(showStudent);
}

export function setSortingChange(sortFunc) {
    let radioBtns = document.querySelectorAll("[data-action=sortCriteria]");
    radioBtns.forEach((radioBtn) => {
        radioBtn.addEventListener("change", () => {
            let value = getSelectedSorting();
            sortFunc(value);
        });
    });
}

export function setSortingDirectionChange(sortFunc) {
    let button = document.querySelector("[data-field=sortDirection]");
    button.addEventListener("click", (event) => {
        const newDirection = sortFunc();
        if (newDirection == "asc") {
            event.target.textContent = "ascending";
        } else {
            event.target.textContent = "descending";
        }
    });
}

export function setFilterChange(filterFunc) {
    let radioBtns = document.querySelectorAll("[data-action=filterCategory]");
    radioBtns.forEach((radioBtn) => {
        radioBtn.addEventListener("change", () => {
            let filter = getFilterPropAndValue();
            filterFunc(filter.property, filter.value);
        });
    });

    let dropdowns = document.querySelectorAll("[data-value=filterVal]");
    dropdowns.forEach((dropdown) => {
        dropdown.addEventListener("change", () => {
            let filter = getFilterPropAndValue();
            filterFunc(filter.property, filter.value);
        });
    });
}

function getFilterPropAndValue() {
    let propertyNode = document.querySelector("input[name=filterCategory]:checked");
    let label = document.querySelector(`label[for=${propertyNode.id}]`);
    let valueNode = label.querySelector("[data-value=filterVal]");

    return { property: propertyNode.value, value: valueNode.value };
}

function getSelectedSorting() {
    return document.querySelector("input[name=sorting]:checked").value;
}

function showStudent(student) {
    let clone = document.querySelector("#studentTemplate").content.cloneNode(true);
    let parent = document.querySelector("#studentList");

    clone.querySelector("[data-field='portrait']").setAttribute("src", student.filename);
    clone.querySelector("[data-field='fullname']").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
    clone.querySelector("[data-field='roles']").textContent = buildRolesString(student.roles);
    setHouseClass(clone.querySelector("[data-field='housecolor'"), student.house);
    clone.querySelector(".student").onclick = onStudentClick;

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

function onStudentClick(event) {
    openModal(event.target);
}

export function openModal(clickedStudent) {
    let studentNode = getActualStudentNode(clickedStudent);
    let modal = document.querySelector(".modal");

    let student = Controller.getClickedStudent(studentNode.querySelector("[data-field=fullname]").textContent);
    fillModal(student, modal);
    modal.querySelector(".closeModal").onclick = closeModal;

    document.querySelector("body").style.overflowY = "hidden";
    modal.classList.add("show");
}

function fillModal(student, modal) {
    modal.querySelector(["[data-field=profilepicture]"]).setAttribute("src", student.filename);
    modal.querySelector(["[data-field=housecrest"]).setAttribute("src", student.crestFilename);
    modal.querySelector(["[data-field=firstname"]).textContent = student.firstname;
    modal.querySelector(["[data-field=middlename"]).textContent = student.middlename;
    modal.querySelector(["[data-field=lastname"]).textContent = student.lastname;
    modal.querySelector(["[data-field=nickname"]).textContent = student.nickname;
    modal.querySelector(["[data-field=blood-status]"]).textContent = student.bloodstatus;
    modal.querySelector(["[data-field=roles]"]).textContent = student.roles.toString();
    modal.querySelector(["[data-field=expelled]"]).textContent = student.expelled;
    modal.querySelector(["[data-field=houseColor]"]).classList.add(student.house.toLowerCase());
}

export function closeModal() {
    document.querySelector("body").style.overflowY = "scroll";

    let modal = document.querySelector(".modal");

    modal.classList.remove("show");
    removeHouseColorFromModal(HOUSES, modal.querySelector("[data-field=houseColor]"));
}

// returns the actual student div, in case the clicks is triggered by a subelement.
function getActualStudentNode(clickedNode) {
    if (clickedNode.classList.contains("student")) {
        return clickedNode;
    }

    return clickedNode.closest(".student");
}

function removeHouseColorFromModal(houses, houseColorNode) {
    for (const house in houses) {
        houseColorNode.classList.remove(house.toLowerCase());
    }
}

function sortByFirstName() {
    Controller.sortingChange("fistname");
}
