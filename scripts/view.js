"use strict";

import { Person, HOUSES, ROLES, createFullnameFromParts } from "./Student.js";
import * as Controller from "./control.js";

export function showStudentList(students) {
    let container = document.querySelector("#studentList");
    container.replaceChildren(...[]);

    students.forEach(showStudent);
}

export function setSearch(searchFunc) {
    let input = document.querySelector("[data-action=search");
    input.addEventListener("change", (event) => {
        searchFunc(event.target.value);
    });
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

export function setRoleChanged(roleChangedfunc) {
    let rolesCheckboxes = document.querySelectorAll("[data-action=roleChanged]");

    rolesCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", onRoleChange);
    });

    function onRoleChange(event) {
        let changedRole = event.target.getAttribute("data-field");
        let names = getNamesFromModal();
        let newRoles = roleChangedfunc(changedRole, names.firstname, names.middlename, names.lastname);

        let modal = document.querySelector(".modal");
        fillModalRoles(newRoles, modal);

        updateStudentNodeRoles(createFullnameFromParts(names.firstname, names.middlename, names.lastname), newRoles);
    }
}

export function setExpelStudent(expelFunc) {
    let expelBtn = document.querySelector("[data-action=expel]");
    expelBtn.addEventListener("click", () => {
        let names = getNamesFromModal();
        expelFunc(names.firstname, names.middlename, names.lastname);
        let modal = document.querySelector(".modal");
        modal.querySelector("[data-field=expelled]").textContent = getExpelledString(true);
        fillModalRoles([], modal);
        setExpelledBtnStatus(true);
    });
}

export function InquisitorNotAllowed() {
    alert("This student is not allowed to be an Inquisitor! \r\n A student must be pureblood or in Slytherin to be an Inquisitor");
}

function setExpelledBtnStatus(expelled) {
    document.querySelector("[data-action=expel]").disabled = expelled;
}

function updateStudentNodeRoles(fullname, roles) {
    let node = getStudentListNode(fullname);
    if (node !== null) {
        node.querySelector("[data-field=roles]").textContent = roles.toString();
    }
}

function getStudentListNode(fullname) {
    let studentNodes = document.querySelectorAll(".student");
    let searchResult;
    console.log("student list node _" + fullname + "_");

    for (const studentNode of studentNodes) {
        const nodeName = studentNode.querySelector("[data-field=fullname]").textContent;
        if (nodeName === fullname) {
            searchResult = studentNode;
            console.log(studentNode);
            break;
        }
    }

    return searchResult;
}

function getNamesFromModal() {
    let modal = document.querySelector(".modal");
    let firstname = modal.querySelector("[data-field=firstname]").textContent;
    let middlename = modal.querySelector("[data-field=middlename]").textContent;
    let lastname = modal.querySelector("[data-field=lastname]").textContent;

    return { firstname, middlename, lastname };
}

function getFilterPropAndValue() {
    let propertyNode = document.querySelector("input[name=filterCategory]:checked");
    let label = document.querySelector(`label[for=${propertyNode.id}]`);
    let valueNode = label.querySelector("[data-value=filterVal]");

    if (valueNode === null) {
        return { property: propertyNode.value, value: true };
    } else {
        return { property: propertyNode.value, value: valueNode.value };
    }
}

function getSelectedSorting() {
    return document.querySelector("input[name=sorting]:checked").value;
}

function showStudent(student) {
    let clone = document.querySelector("#studentTemplate").content.cloneNode(true);
    let parent = document.querySelector("#studentList");

    clone.querySelector("[data-field='portrait']").setAttribute("src", student.filename);
    clone.querySelector("[data-field='fullname']").textContent = createFullnameFromParts(student.firstname, student.middlename, student.lastname);
    clone.querySelector("[data-field='roles']").textContent = student.roles.toString();
    setHouseClass(clone.querySelector("[data-field='housecolor'"), student.house);
    clone.querySelector(".student").onclick = onStudentClick;

    parent.appendChild(clone);
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
    modal.querySelector(["[data-field=expelled]"]).textContent = getExpelledString(student.expelled);
    if (student.expelled) {
        setExpelledBtnStatus(student.expelled);
    }
    modal.querySelector(["[data-field=houseColor]"]).classList.add(student.house.toLowerCase());
    fillModalRoles(student.roles, modal);
}

function fillModalRoles(roles, modal) {
    modal.querySelector("[data-field=inquisitor]").checked = roles.indexOf(ROLES.inquisitor) >= 0;
    modal.querySelector("[data-field=prefect]").checked = roles.indexOf(ROLES.prefect) >= 0;
    modal.querySelector("[data-field=captain").checked = roles.indexOf(ROLES.captain) >= 0;
}

function getExpelledString(expelled) {
    if (expelled) {
        return "expelled";
    } else {
        return "enrolled";
    }
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

export function showStats(stats) {
    document.querySelector("[data-field=currentlyDisplayed]").textContent = stats.displayed;
    document.querySelector("[data-field=gryffindorCount]").textContent = stats.gryffindor;
    document.querySelector("[data-field=hufflepuffCount]").textContent = stats.hufflepuff;
    document.querySelector("[data-field=ravenclawCount]").textContent = stats.ravenclaw;
    document.querySelector("[data-field=slytherinCount]").textContent = stats.slytherin;
    document.querySelector("[data-field=expelledCount]").textContent = stats.expelled;
}

export function showPrefectDialog(newPrefect, oldPrefect, onRemove) {
    let dialog = document.querySelector("#prefectDialog");
    let closeBtn = dialog.querySelector("[data-action=close]");
    closeBtn.addEventListener("click", () => {
        closePrefectDialog();
    });

    let removeBtn = dialog.querySelector("[data-action=remove]");
    removeBtn.addEventListener("click", () => {
        onRemove();
        updateStudentNodeRoles(createFullnameFromParts(oldPrefect.firstname, oldPrefect.middlename, oldPrefect.lastname), oldPrefect.roles);
        closePrefectDialog();
    });

    dialog.querySelector("[data-field=conflictName]").textContent = `${oldPrefect.firstname} ${oldPrefect.lastname}`;
    dialog.querySelector("[data-field=title]").textContent = `You cannot make ${newPrefect.firstname} ${newPrefect.lastname} a prefect!`;
    dialog.classList.add("show");
}

function closePrefectDialog(onClose, onRemove) {
    let dialog = document.querySelector("#prefectDialog");
    dialog.querySelector("[data-action=close]").onclick = null;
    dialog.querySelector("[data-action=remove]").onclick = null;
    dialog.classList.remove("show");
}
