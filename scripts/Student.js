export const Person = {
    firstname: "",
    lastname: "",
    middlename: "",
    nickname: "",
    filename: "",
    crestFilename: "",
    bloodstatus: "",
    house: "",
    roles: [],
    expelled: false,
};

export const ROLES = {
    prefect: "prefect",
    captain: "captain",
    inquisitor: "inquistitor",
};

export const HOUSES = {
    gryffindor: "Gryffindor",
    ravenclaw: "Ravenclaw",
    hufflepuff: "Hufflepuff",
    slytherin: "Slytherin",
};

export function createFullnameFromParts(firstname, middlename, lastname) {
    let fullname = firstname + " ";

    if (middlename !== " ") {
        fullname += middlename + " ";
    }

    fullname += lastname;

    return fullname;
}
