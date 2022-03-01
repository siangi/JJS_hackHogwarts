export const Person = {
    firstname: "",
    lastname: "",
    middlename: "",
    nickname: "",
    filename: "",
    crestFilename: "",
    bloodstatus: "",
    gender: "",
    house: "",
    roles: [],
    expelled: false,
};

export const ROLES = {
    prefect: "prefect",
    captain: "captain",
    inquisitor: "inquisitor",
};

export const HOUSES = {
    gryffindor: "Gryffindor",
    ravenclaw: "Ravenclaw",
    hufflepuff: "Hufflepuff",
    slytherin: "Slytherin",
};

export const BLOODSTATUS = {
    pureblood: "pureblood",
    halfBlood: "halfblood",
    muggleBorn: "muggleborn",
};

export function createFullnameFromParts(firstname, middlename, lastname) {
    let fullname = firstname + " ";

    if (middlename !== " ") {
        fullname += middlename + " ";
    }

    fullname += lastname;

    return fullname;
}
