export function getUserData() {
    return JSON.parse(localStorage.getItem('user'));
}

export function setUserData(data) {
    if (data.code === 403) {
        return alert(data.message);
    }

    localStorage.setItem('user', JSON.stringify(data));
}

export function clearUserData() {
    localStorage.removeItem('user')
}