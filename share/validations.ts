function matchObjRefWith(str: string) {
    let test = str.match(/\w+(?=\.)/);
    if (test && test[0]) {
        return test;
    }
    return null;
}

function matchObjMethodRefWith(str: string) {
    let test = str.match(/[^.]*$/gm);
    if (test && test[0]) {
        return test;
    }
    return null;
}

function isPlainAction(actionString: string | null): boolean {
    return actionString === null ? true : false;
}

export { matchObjMethodRefWith, matchObjRefWith, isPlainAction };
