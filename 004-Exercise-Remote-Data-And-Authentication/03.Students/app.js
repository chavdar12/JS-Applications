function solve() {
    const baseUrl = 'http://localhost:3030/jsonstore/collections/students';

    let submitButtonElement = document.getElementById('submit');
    submitButtonElement.addEventListener('click', createStudent);

    getAllStudents();

    function getAllStudents() {
        fetch(baseUrl)
            .then((res) => res.json())
            .then((res) => showStudents(res))
            .catch((err) => console.error(err));
    }

    function showStudents(students) {
        let tBodyElement = document.querySelector('table#results tbody');
        tBodyElement.innerHTML = '';

        Object.values(students).forEach((student) => {
            const { firstName, lastName, facultyNumber, grade } = student;

            let trElement = document.createElement('tr');

            trElement.insertCell(0).textContent = firstName;
            trElement.insertCell(1).textContent = lastName;
            trElement.insertCell(2).textContent = facultyNumber;
            trElement.insertCell(3).textContent = grade;

            tBodyElement.appendChild(trElement);
        });
    }

    function createStudent(e) {
        e.preventDefault();

        let firstNameInputElement = document.querySelector('input[name="firstName"]');
        let lastNameInputElement = document.querySelector('input[name="lastName"]');
        let facultyNumberInputElement = document.querySelector('input[name="facultyNumber"]');
        let gradeInputElement = document.querySelector('input[name="grade"]');

        if (!firstNameInputElement.value ||
            !lastNameInputElement.value ||
            !facultyNumberInputElement.value ||
            !gradeInputElement.value) {
            return alert('All fields are required!');
        }

        if (isNaN(Number(gradeInputElement.value))) {
            return alert('Grade must be a number');
        }

        const student = {
            firstName: firstNameInputElement.value,
            lastName: lastNameInputElement.value,
            facultyNumber: facultyNumberInputElement.value,
            grade: gradeInputElement.value,
        };

        firstNameInputElement.value = '';
        lastNameInputElement.value = '';
        facultyNumberInputElement.value = '';
        gradeInputElement.value = '';

        fetch(baseUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(student)
        })
            .then(() => getAllStudents())
            .catch((err) => console.error(err));
    }
}

solve();