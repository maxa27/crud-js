document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
    setupEventListeners();
});

function loadUsers() {
    fetch("/api/users")
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.getElementById("user-table-body");
            tableBody.innerHTML = ""; // Очистка таблицы

            data.forEach((user, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="delete-btn" data-email="${user.email}">Удалить</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Добавляем обработчики для кнопок удаления
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', handleDelete);
            });
        })
        .catch((error) => console.error("Ошибка загрузки пользователей:", error));
}

function setupEventListeners() {
    // Обработка формы добавления пользователя
    const addUserForm = document.getElementById("add-user-form");
    addUserForm.addEventListener("submit", handleFormSubmit);

    // Обработка поиска
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", handleSearch);
}

function handleDelete(event) {
    const email = event.target.dataset.email;
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        return;
    }

    fetch(`/api/users/${email}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при удалении пользователя');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            loadUsers(); // Перезагружаем список пользователей
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при удалении пользователя');
        });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        role: document.getElementById("role").value
    };

    fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then((data) => {
            alert(data.message);
            loadUsers(); // Перезагрузка списка пользователей
            event.target.reset(); // Очистка формы
        })
        .catch((error) => {
            console.error("Ошибка:", error);
            alert(error.error || "Произошла ошибка при добавлении пользователя");
        });
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const rows = document.querySelectorAll("#user-table-body tr");

    rows.forEach(row => {
        const name = row.children[1].textContent.toLowerCase();
        row.style.display = name.includes(searchTerm) ? "" : "none";
    });
}