console.log("JavaScript is working!");

document.addEventListener('DOMContentLoaded', function () {
    const heading = document.querySelector('h1');
    if (heading) {
        heading.addEventListener('click', function () {
            alert('Welcome to the Dashboard!');
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.login_box form');
    const rememberMe = document.getElementById('remember');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Handle form submission
    loginForm.addEventListener('submit', function () {
        if (!rememberMe.checked) {
            // Clear fields after successful submission
            setTimeout(() => {
                usernameInput.value = '';
                passwordInput.value = '';
            }, 100); // Small delay to ensure form is submitted
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const dragDropSection = document.getElementById('drag-drop-section');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');

    // Handle file input change
    fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            dragDropSection.innerHTML = `<p>Selected file: ${fileInput.files[0].name}</p>`;
        }
    });

    // Handle drag and drop
    dragDropSection.addEventListener('dragover', function (e) {
        e.preventDefault();
        dragDropSection.classList.add('dragover');
    });

    dragDropSection.addEventListener('dragleave', function () {
        dragDropSection.classList.remove('dragover');
    });

    dragDropSection.addEventListener('drop', function (e) {
        e.preventDefault();
        dragDropSection.classList.remove('dragover');

        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            dragDropSection.innerHTML = `<p>Dropped file: ${fileInput.files[0].name}</p>`;
        }
    });

    // Handle upload button click
    uploadBtn.addEventListener('click', function (e) {
        if (!fileInput.files || fileInput.files.length === 0) {
            e.preventDefault(); // Prevent form submission
            dragDropSection.innerHTML = `<p style="color: red;">Please select or drop a file first!</p>`;
        } else {
            // Redirect to the stamping page in a new tab
            window.open(stampDocumentUrl, '_blank');
        }
    });
});

