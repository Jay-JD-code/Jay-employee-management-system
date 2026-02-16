

document.getElementById("loginForm")?.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:19179/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
        

    });

    const data = await response.json();
    


    if (response.ok) {
        localStorage.setItem("token", data.token);
   
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("message").innerHTML = data.error || "Login failed";
    }
   

});

document.getElementById("registerForm")?.addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("http://localhost:19179/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            document.getElementById("message").innerText = data.error || "Registration failed";
            return;
        }

        document.getElementById("message").innerText = "Registration successful! Redirecting to login...";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {
        console.error("Network error:", error);
        alert("Unable to connect to server.");
    }
});



async function loadEmployees() {

    const token = localStorage.getItem("token");

    // 🚨 If no token → redirect to login
    if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:19179/api/employees", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        // 🚨 If Unauthorized → token expired
     if (response.status === 401) {
       alert("Session expired. Please login again.");
       localStorage.removeItem("token");
       window.location.href = "index.html";
       return;
     }

     if (response.status === 403) {
       alert("Access denied.");
       return;
     }


        if (!response.ok) {
            alert(data.error || "Failed to load employees");
            return;
        }

        if (!Array.isArray(data)) {
            console.error("Expected array but got:", data);
            return;
        }

        const tableBody = document.querySelector("#employeeTable tbody");
        tableBody.innerHTML = "";

        data.forEach(emp => {
            const row = `
                <tr>
                    <td>${emp.id}</td>
                    <td>${emp.name}</td>
                    <td>${emp.department}</td>
                    <td>${emp.salary}</td>
                    <td>
                        <button onclick="editEmployee(${emp.id}, '${emp.name}', '${emp.department}', ${emp.salary})">
                            Edit
                        </button>
                        <button onclick="deleteEmployee(${emp.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Network error:", error);
        alert("Unable to connect to server.");
    }
    if (getUserRole() === "user" && data.length > 0) {
    document.querySelector(".top-bar button").style.display = "none";
}

}


function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

function showAddForm() {
    document.getElementById("addForm").style.display = "block";
}

async function addEmployee() {

    const token = localStorage.getItem("token");

    const name = document.getElementById("empName").value;
    const department = document.getElementById("empDept").value;
    const salary = document.getElementById("empSalary").value;

    await fetch("http://localhost:19179/api/employees", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name, department, salary })
    });

    loadEmployees();
    document.getElementById("addForm").style.display = "none";
}

async function deleteEmployee(id) {

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:19179/api/employees/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    loadEmployees();
}

function editEmployee(id, name, department, salary) {

    document.getElementById("addForm").style.display = "block";

    document.getElementById("empName").value = name;
    document.getElementById("empDept").value = department;
    document.getElementById("empSalary").value = salary;

    const saveBtn = document.querySelector("#addForm button");

    saveBtn.onclick = async function () {

        const token = localStorage.getItem("token");

        await fetch(`http://localhost:19179/api/employees/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                name: document.getElementById("empName").value,
                department: document.getElementById("empDept").value,
                salary: document.getElementById("empSalary").value
            })
        });

        loadEmployees();
        document.getElementById("addForm").style.display = "none";
    };
}

function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (err) {
        console.error("Invalid token format");
        return null;
    }
}


if (window.location.pathname.includes("dashboard.html")) {
    window.addEventListener("load", () => {
        const role = getUserRole();

        if (!role) {
            window.location.href = "index.html";
            return;
        }

        loadEmployees(); // 👈 Always call this
    });
}



