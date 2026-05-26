// =========================
// SIMS MODERN SCRIPT
// =========================

// API URL
var API_URL = window.location.origin + '/api';

// STATE
var students = [];
var deleteTargetId = null;

// =========================
// INITIALIZE
// =========================

document.addEventListener('DOMContentLoaded', function () {

    // Register Form
    document
        .getElementById('register-form')
        .addEventListener('submit', handleRegister);

    // Navigation Links
    document
        .querySelectorAll('.nav-link')
        .forEach(function (link) {

            link.addEventListener('click', function (e) {

                e.preventDefault();

                navigateTo(link.dataset.page);

            });

        });

    // Load Students
    loadStudents();

});

// =========================
// NAVIGATION
// =========================

function navigateTo(page) {

    // Active Nav
    document
        .querySelectorAll('.nav-link')
        .forEach(function (link) {

            if (link.dataset.page === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }

        });

    // Active Page
    document
        .querySelectorAll('.page')
        .forEach(function (p) {

            p.classList.remove('active');

        });

    document
        .getElementById(page + '-page')
        .classList.add('active');

    // Reload Students
    if (page === 'students') {
        loadStudents();
    }

    // Close Mobile Menu
    document
        .querySelector('.nav-links')
        .classList.remove('active');

}

// Mobile Menu
function toggleMobileMenu() {

    document
        .querySelector('.nav-links')
        .classList.toggle('active');

}

// =========================
// CREATE STUDENT
// =========================

function handleRegister(e) {

    e.preventDefault();

    var data = {

        student_id:
            document
                .getElementById('reg-student-id')
                .value
                .trim(),

        full_name:
            document
                .getElementById('reg-full-name')
                .value
                .trim(),

        course:
            document
                .getElementById('reg-course')
                .value,

        year_level:
            parseInt(
                document
                    .getElementById('reg-year-level')
                    .value
            ),

        email:
            document
                .getElementById('reg-email')
                .value
                .trim()

    };

    fetch(API_URL + '/students', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)

    })

    .then(function (response) {

        return response.json();

    })

    .then(function (result) {

        if (result.success) {

            showToast(
                'success',
                'Student registered successfully!'
            );

            resetForm('register-form');

            navigateTo('students');

        } else {

            showToast(
                'error',
                result.message || 'Registration failed'
            );

        }

    })

    .catch(function (error) {

        console.error(error);

        showToast(
            'error',
            'Failed to connect to server'
        );

    });

}

// =========================
// LOAD STUDENTS
// =========================

function loadStudents() {

    fetch(API_URL + '/students')

    .then(function (response) {

        return response.json();

    })

    .then(function (result) {

        if (result.success) {

            students = result.data;

            renderStudents();

            updateStats();

        }

    })

    .catch(function (error) {

        console.error(error);

        showToast(
            'error',
            'Failed to load students'
        );

    });

}

// =========================
// SEARCH STUDENTS
// =========================

function searchStudents() {

    var query =
        document
            .getElementById('search-input')
            .value
            .trim();

    // Reload All
    if (!query) {

        loadStudents();

        return;

    }

    fetch(
        API_URL +
        '/students/search/' +
        encodeURIComponent(query)
    )

    .then(function (response) {

        return response.json();

    })

    .then(function (result) {

        if (result.success) {

            students = result.data;

            renderStudents();

        }

    })

    .catch(function (error) {

        console.error(error);

    });

}

// =========================
// DELETE STUDENT
// =========================

function deleteStudent() {

    if (!deleteTargetId) return;

    fetch(API_URL + '/students/' + deleteTargetId, {

        method: 'DELETE'

    })

    .then(function (response) {

        return response.json();

    })

    .then(function (result) {

        if (result.success) {

            showToast(
                'success',
                'Student deleted successfully'
            );

            closeDeleteModal();

            loadStudents();

        } else {

            showToast(
                'error',
                result.message || 'Delete failed'
            );

        }

    })

    .catch(function (error) {

        console.error(error);

        showToast(
            'error',
            'Failed to connect to server'
        );

    });

}

// =========================
// RENDER TABLE
// =========================

function renderStudents() {

    var tbody =
        document.getElementById('students-tbody');

    var emptyState =
        document.getElementById('empty-state');

    var tableContainer =
        document.querySelector('.table-container');

    document.getElementById('student-count')
        .textContent = students.length;

    // Empty State
    if (students.length === 0) {

        tableContainer.classList.add('hidden');

        emptyState.classList.remove('hidden');

        return;

    }

    tableContainer.classList.remove('hidden');

    emptyState.classList.add('hidden');

    var html = '';

    for (var i = 0; i < students.length; i++) {

        var student = students[i];

        html += '<tr>';

        // Student ID
        html +=
            '<td>' +
            '<span class="student-id-badge">' +
            escapeHtml(student.student_id) +
            '</span>' +
            '</td>';

        // Name
        html +=
            '<td>' +
            '<div class="student-name-cell">' +

            '<div class="student-avatar">' +
            student.full_name.charAt(0).toUpperCase() +
            '</div>' +

            escapeHtml(student.full_name) +

            '</div>' +
            '</td>';

        // Course
        html +=
            '<td>' +
            escapeHtml(student.course) +
            '</td>';

        // Year
        html +=
            '<td>' +

            '<span class="year-badge year-' +
            student.year_level +
            '">' +

            getYearLabel(student.year_level) +

            '</span>' +

            '</td>';

        // Email
        html +=
            '<td>' +
            escapeHtml(student.email) +
            '</td>';

        // Actions
        html += '<td>';

        html += '<div class="action-buttons">';

        html +=
            '<button ' +
            'class="action-btn delete" ' +
            'onclick="openDeleteModal(' +
            student.id +
            ')" ' +
            'title="Delete">' +
            '🗑️' +
            '</button>';

        html += '</div>';

        html += '</td>';

        html += '</tr>';

    }

    tbody.innerHTML = html;

}

// =========================
// UPDATE STATS
// =========================

function updateStats() {

    document
        .getElementById('total-students')
        .textContent = students.length;

}

// =========================
// DELETE MODAL
// =========================

function openDeleteModal(id) {

    deleteTargetId = id;

    document
        .getElementById('delete-modal')
        .classList.remove('hidden');

    document
        .getElementById('confirm-delete-btn')
        .onclick = deleteStudent;

}

function closeDeleteModal() {

    deleteTargetId = null;

    document
        .getElementById('delete-modal')
        .classList.add('hidden');

}

// =========================
// CLEAR SEARCH
// =========================

function clearSearch() {

    document
        .getElementById('search-input')
        .value = '';

    loadStudents();

}

// =========================
// RESET FORM
// =========================

function resetForm(formId) {

    document
        .getElementById(formId)
        .reset();

}

// =========================
// TOAST NOTIFICATION
// =========================

function showToast(type, message) {

    var toast =
        document.getElementById('toast');

    var icon =
        document.getElementById('toast-icon');

    var msg =
        document.getElementById('toast-message');

    var icons = {

        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'

    };

    toast.className = 'toast ' + type;

    icon.textContent = icons[type];

    msg.textContent = message;

    toast.classList.remove('hidden');

    setTimeout(function () {

        toast.classList.add('hidden');

    }, 3500);

}

// =========================
// YEAR LABEL
// =========================

function getYearLabel(year) {

    var labels = {

        1: '1st Year',
        2: '2nd Year',
        3: '3rd Year',
        4: '4th Year'

    };

    return labels[year] || year;

}

// =========================
// ESCAPE HTML
// =========================

function escapeHtml(text) {

    var div = document.createElement('div');

    div.textContent = text;

    return div.innerHTML;

}

// =========================
// CLOSE MODAL OUTSIDE CLICK
// =========================

document.addEventListener('click', function (e) {

    if (e.target.id === 'delete-modal') {

        closeDeleteModal();

    }

});

// =========================
// ESC KEY
// =========================

document.addEventListener('keydown', function (e) {

    if (e.key === 'Escape') {

        closeDeleteModal();

    }

});
