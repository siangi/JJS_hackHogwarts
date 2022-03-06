"use strict";
const BASE_RESOURCES_PATH = "...\\..\\resources";
import { Person, HOUSES, ROLES, BLOODSTATUS } from "./Student.js";

export async function loadAndCleanStudents(url, bloodStatusUrl) {
    let families = await loadJsonData(bloodStatusUrl).then(createFamiliesList);
    let studentList = await loadJsonData(url).then((peopleJSon) => createPeopleList(peopleJSon, families));
    return studentList;
}

async function loadJsonData(url) {
    const response = await fetch(url).then((data) => {
        return data.json();
    });

    return response;
}

function createPeopleList(jsonPeople, familyStatus) {
    let peopleObjects = [];
    jsonPeople.forEach((jsonObj) => {
        let person = Object.create(Person);
        fillNames(jsonObj.fullname.trim(), person);
        person.house = capitalStartRestSmall(jsonObj.house);
        person.crestFilename = getHouseCrestPath(person.house);
        person.filename = getImagePath(person.lastname, person.firstname);
        person.bloodstatus = getBloodstatus(person.lastname, familyStatus);
        person.gender = jsonObj.gender;
        person.roles = [];
        peopleObjects.push(person);
    });

    return peopleObjects;
}

function getBloodstatus(lastname, familyStatuses) {
    if (familyStatuses.halfblood.indexOf(lastname) >= 0) {
        return BLOODSTATUS.halfBlood;
    }

    if (familyStatuses.pureblood.indexOf(lastname) >= 0) {
        return BLOODSTATUS.pureblood;
    }

    return BLOODSTATUS.muggleBorn;
}

function createFamiliesList(jsonData) {
    let families = {};
    families.pureblood = jsonData.pure;
    families.halfblood = jsonData.half;
    return families;
}

// TODO: make less hacky
function getImagePath(lastname, firstname) {
    let filename = lastname.toLowerCase() + "_" + firstname.substring(0, 1).toLowerCase();
    if (firstname === "Parvati") {
        filename = "patil_parvati";
    } else if (firstname === "Padma") {
        filename = "patil_padma";
    } else if (firstname === "Justin") {
        filename = "fletchley_j";
    }

    return `${BASE_RESOURCES_PATH}\\students\\${filename}.png`;
}

function getHouseCrestPath(house) {
    return `${BASE_RESOURCES_PATH}\\crests\\${house.toLowerCase()}.png`;
}

function fillNames(fullname, personToFill) {
    let withoutNickname = fullname;

    if (fullname.includes('"')) {
        let startIdx = fullname.indexOf('"');
        let endIdx = fullname.indexOf('"', startIdx + 1);
        personToFill.nickname = capitalStartRestSmall(fullname.substring(startIdx + 1, endIdx));
        withoutNickname = fullname.substring(0, startIdx) + fullname.substring(endIdx + 1, fullname.length);
    }

    let namesArr = withoutNickname.split(" ");
    personToFill.firstname = capitalStartRestSmall(namesArr[0]);

    // add middle names in a loop, because there can be multiple
    // skip first an lastname
    for (let i = 1; i <= namesArr.length - 2; i++) {
        personToFill.middlename += ` ${capitalStartRestSmall(namesArr[i])}`;
    }
    personToFill.middlename.trim();
    personToFill.lastname = capitalStartRestSmall(namesArr[namesArr.length - 1]);

    return personToFill;
}

function capitalStartRestSmall(fullname) {
    let trimmed = fullname.trim();
    return trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1, trimmed.length).toLowerCase();
}

export function createHacker() {
    let hacker = Object.create(Person);
    hacker.firstname = "Simon";
    hacker.middlename = "your doom";
    hacker.lastname = "Gisler";
    hacker.nickname = "Hackerman";
    hacker.gender = "boy";
    hacker.bloodstatus = BLOODSTATUS.muggleBorn;
    hacker.filename = getImagePath(hacker.lastname, hacker.firstname);
    hacker.house = HOUSES.hufflepuff;
    hacker.crestFilename = getHouseCrestPath(hacker.house);
    hacker.roles = [];
    hacker.expelled = false;

    return hacker;
}
