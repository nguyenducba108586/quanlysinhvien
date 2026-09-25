let studentModal;

document.addEventListener("DOMContentLoaded", () => {
    loadStudents();
    studentModal = new bootstrap.Modal(document.getElementById('studentModal'));
});

// Hàm gọi API lấy danh sách sinh viên
async function loadStudents(keyword = "") {
    try {
        let url = "http://localhost:8080/api/students";
        if (keyword) {
            url += `?keyword=${encodeURIComponent(keyword)}`;
        }
        const response = await fetch(url);
        const students = await response.json();
        renderStudents(students);
    } catch (error) {
        console.error("Lỗi khi tải danh sách sinh viên:", error);
    }
}

// Hàm render dữ liệu ra bảng HTML
function renderStudents(students) {
    const tbody = document.getElementById("studentTableBody");
    tbody.innerHTML = "";

    if (!students || students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Không tìm thấy sinh viên nào!</td></tr>`;
        return;
    }

    students.forEach(student => {
        const row = `
            <tr>
                <td><strong>${student.studentCode || ''}</strong></td>
                <td>${student.fullName || ''}</td>
                <td>${student.email || ''}</td>
                <td>${student.phone || ''}</td>
                <td><span class="badge bg-secondary">${student.className || ''}</span></td>
                <td class="text-center">
                    <div class="d-flex justify-content-center gap-1">
                        <button class="btn btn-info btn-sm text-white" onclick="viewStudent('${student.id}')" title="Xem">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm text-white" onclick="editStudent('${student.id}')" title="Sửa">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student.id}')" title="Xóa">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Tìm kiếm
function searchStudents() {
    const keyword = document.getElementById("searchInput").value;
    loadStudents(keyword);
}

// Mở Modal Thêm mới
function openModal() {
    document.getElementById("modalTitle").innerText = "Thêm sinh viên mới";
    document.getElementById("studentId").value = "";
    document.getElementById("studentForm").reset();
    studentModal.show();
}

// Mở Modal Sửa thông tin
async function editStudent(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/students/${id}`);
        const student = await response.json();

        document.getElementById("modalTitle").innerText = "Sửa thông tin sinh viên";
        document.getElementById("studentId").value = student.id;
        document.getElementById("studentCode").value = student.studentCode || "";
        document.getElementById("fullName").value = student.fullName || "";
        document.getElementById("email").value = student.email || "";
        document.getElementById("phone").value = student.phone || "";
        document.getElementById("className").value = student.className || "";

        studentModal.show();
    } catch (error) {
        console.error("Lỗi khi tải thông tin sinh viên:", error);
    }
}

// Lưu Sinh Viên (Thêm mới POST / Cập nhật PUT)
async function saveStudent() {
    const id = document.getElementById("studentId").value;
    const studentData = {
        studentCode: document.getElementById("studentCode").value,
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        className: document.getElementById("className").value
    };

    let url = "http://localhost:8080/api/students";
    let method = "POST";

    if (id) {
        url = `http://localhost:8080/api/students/${id}`;
        method = "PUT";
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            alert(id ? "Cập nhật thành công!" : "Thêm sinh viên thành công!");
            studentModal.hide();
            loadStudents();
        } else {
            alert("Thực hiện thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi lưu sinh viên:", error);
    }
}

// Xóa Sinh Viên
async function deleteStudent(id) {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này không?")) {
        try {
            const response = await fetch(`http://localhost:8080/api/students/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                alert("Xóa thành công!");
                loadStudents();
            } else {
                alert("Xóa thất bại!");
            }
        } catch (error) {
            console.error("Lỗi xóa sinh viên:", error);
        }
    }
}

// Xem chi tiết
async function viewStudent(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/students/${id}`);
        const student = await response.json();
        alert(`THÔNG TIN SINH VIÊN:\n\n- Mã SV: ${student.studentCode}\n- Họ tên: ${student.fullName}\n- Email: ${student.email}\n- SĐT: ${student.phone}\n- Lớp: ${student.className}`);
    } catch (error) {
        console.error("Lỗi xem thông tin:", error);
    }
}