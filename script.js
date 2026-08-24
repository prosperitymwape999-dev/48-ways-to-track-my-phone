// ========================================
// 48 WAYS TO TRACK MY PHONE
// WEBSITE LOGIC
// ========================================

let locationPermissionGranted = false;
let currentLocation = null;
let currentUser = null;


// ========================================
// SHOW DIFFERENT PAGES
// ========================================

function showPage(pageId) {

    // Hide every page
    const pages = document.querySelectorAll(".page");

    pages.forEach(function (page) {
        page.classList.remove("active");
    });

    // Show selected page
    document.getElementById(pageId).classList.add("active");
}


// ========================================
// SHOW SIGN IN OR CREATE ACCOUNT
// ========================================

function showForm(formName) {

    const signInForm = document.getElementById("signinForm");
    const signUpForm = document.getElementById("signupForm");

    // Hide both first
    signInForm.classList.remove("active");
    signUpForm.classList.remove("active");

    // Show selected form
    if (formName === "signin") {
        signInForm.classList.add("active");
    }

    if (formName === "signup") {
        signUpForm.classList.add("active");
    }
}


// ========================================
// ENABLE LOCATION
// ========================================

function enableLocation() {

    if (!navigator.geolocation) {
        alert("Location is not supported by this browser.");
        return;
    }

    alert(
        "The browser will now ask for permission to access your location. " +
        "Please press Allow."
    );

    navigator.geolocation.getCurrentPosition(

        function (position) {

            locationPermissionGranted = true;

            currentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            alert(
                "Location Protection Enabled Successfully! 📍"
            );
        },

        function (error) {

            locationPermissionGranted = false;

            alert(
                "Location permission was not granted. " +
                "You can still create your account."
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


// ========================================
// CREATE ACCOUNT
// ========================================

function createAccount() {

    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const serial = document.getElementById("serial").value.trim();
    const icloud = document.getElementById("icloud").value.trim();
    const password = document.getElementById("password").value.trim();
    const photoInput = document.getElementById("profilePhoto");

    // Check required information
    if (!email || !phone || !serial || !password) {

        alert(
            "Please fill in your Email, Phone Number, " +
            "Serial Number and Website Password."
        );

        return;
    }

    // Get old users from browser storage
    let users = JSON.parse(
        localStorage.getItem("users")
    ) || [];

    // Check if email already exists
    const existingUser = users.find(function (user) {
        return user.email === email;
    });

    if (existingUser) {

        alert(
            "An account with this email already exists. Please Sign In."
        );

        return;
    }

    // Create user
    const newUser = {

        id: Date.now(),

        email: email,

        phone: phone,

        serial: serial,

        icloud: icloud || "Not provided",

        password: password,

        photo: "",

        locationPermission: locationPermissionGranted,

        registeredAt: new Date().toLocaleString()

    };


    // ========================================
    // SAVE PROFILE PHOTO
    // ========================================

    if (photoInput.files.length > 0) {

        const reader = new FileReader();

        reader.onload = function (event) {

            newUser.photo = event.target.result;

            saveNewUser(newUser);
        };

        reader.readAsDataURL(photoInput.files[0]);

    } else {

        saveNewUser(newUser);
    }
}


// ========================================
// SAVE NEW USER
// ========================================

function saveNewUser(newUser) {

    let users = JSON.parse(
        localStorage.getItem("users")
    ) || [];

    users.push(newUser);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    currentUser = newUser;

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

    // Create admin notification
    createNotification(
        "NEW ACCOUNT",
        newUser.email,
        "A new user has created an account."
    );

    alert(
        "Account created successfully! Welcome to the 48 Gates of Heaven. 🔥"
    );

    openDashboard();
}


// ========================================
// SIGN IN
// ========================================

function signIn() {

    const email = document.getElementById("loginEmail").value.trim();

    const password = document.getElementById("loginPassword").value.trim();

    let users = JSON.parse(
        localStorage.getItem("users")
    ) || [];

    const user = users.find(function (account) {

        return account.email === email &&
               account.password === password;
    });

    if (!user) {

        alert(
            "Incorrect email or password. Please try again."
        );

        return;
    }

    currentUser = user;

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

    openDashboard();
}


// ========================================
// OPEN USER DASHBOARD
// ========================================

function openDashboard() {

    if (!currentUser) {
        return;
    }

    document.getElementById("userWelcome").textContent =
        "Welcome, " + currentUser.email;

    showPage("dashboardPage");
}


// ========================================
// MY PHONE
// ========================================

function myPhone() {

    if (!currentUser) {
        return;
    }

    const message =
        "MY REGISTERED PHONE\n\n" +
        "Email: " + currentUser.email + "\n" +
        "Phone Number: " + currentUser.phone + "\n" +
        "Serial Number: " + currentUser.serial + "\n" +
        "Apple ID / iCloud: " + currentUser.icloud;

    alert(message);
}


// ========================================
// SEND EMERGENCY ALERT
// ========================================

function sendAlert(alertType) {

    if (!currentUser) {

        alert("Please sign in first.");

        return;
    }

    document.getElementById("alertTitle").textContent =
        alertType === "LOST PHONE"
            ? "LOST PHONE ALERT SENT"
            : "HELP ALERT SENT";

    document.getElementById("alertText").textContent =
        "Your alert has been sent to the 48 Admin Dashboard.";

    document.getElementById("locationStatus").textContent =
        "📍 Checking your current location...";

    showPage("alertPage");


    // Get current location automatically
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const location = {
                    latitude: latitude,
                    longitude: longitude
                };

                currentLocation = location;

                document.getElementById(
                    "locationStatus"
                ).textContent =
                    "📍 Location attached to your alert.";

                saveAlert(
                    alertType,
                    location
                );
            },


            function (error) {

                document.getElementById(
                    "locationStatus"
                ).textContent =
                    "⚠️ Alert sent, but location is unavailable.";

                saveAlert(
                    alertType,
                    null
                );
            },


            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }

        );

    } else {

        document.getElementById(
            "locationStatus"
        ).textContent =
            "⚠️ Alert sent, but this browser does not support location.";

        saveAlert(
            alertType,
            null
        );
    }
}


// ========================================
// SAVE ALERT
// ========================================

function saveAlert(alertType, location) {

    const newAlert = {

        id: Date.now(),

        type: alertType,

        userEmail: currentUser.email,

        phone: currentUser.phone,

        serial: currentUser.serial,

        time: new Date().toLocaleString(),

        location: location,

        status: "NEW"

    };


    let alerts = JSON.parse(
        localStorage.getItem("alerts")
    ) || [];

    alerts.unshift(newAlert);

    localStorage.setItem(
        "alerts",
        JSON.stringify(alerts)
    );


    // Create admin notification
    createNotification(

        alertType,

        currentUser.email,

        alertType === "LOST PHONE"
            ? "A user has reported a lost phone."
            : "A user needs help."

    );


    // Browser notification
    sendBrowserNotification(
        alertType,
        currentUser.email
    );
}


// ========================================
// CREATE ADMIN NOTIFICATION
// ========================================

function createNotification(type, user, message) {

    const notification = {

        id: Date.now() + Math.floor(Math.random() * 1000),

        type: type,

        user: user,

        message: message,

        time: new Date().toLocaleString(),

        read: false

    };


    let notifications = JSON.parse(
        localStorage.getItem("notifications")
    ) || [];

    notifications.unshift(notification);

    localStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
    );
}


// ========================================
// BROWSER NOTIFICATIONS
// ========================================

function requestNotificationPermission() {

    if ("Notification" in window) {

        if (Notification.permission === "default") {

            Notification.requestPermission();

        }
    }
}


function sendBrowserNotification(title, user) {

    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification(
            "48 Ways to Track My Phone: " + title,
            {
                body: "Alert from: " + user
            }
        );
    }
}


// ========================================
// LOG OUT
// ========================================

function logOut() {

    currentUser = null;

    localStorage.removeItem("currentUser");

    showPage("welcomePage");
}


// ========================================
// CHECK FOR SAVED LOGIN
// ========================================

window.addEventListener(
    "load",

    function () {

        requestNotificationPermission();

        const savedUser = JSON.parse(
            localStorage.getItem("currentUser")
        );

        if (savedUser) {

            currentUser = savedUser;

        }

    }
);

// ========================================
// ADMIN DASHBOARD
// ========================================

function openAdmin() {

    loadAdminDashboard();

    showPage("adminPage");
}


// ========================================
// CLOSE ADMIN
// ========================================

function closeAdmin() {

    showPage("welcomePage");
}


// ========================================
// LOAD ADMIN DASHBOARD
// ========================================

function loadAdminDashboard() {

    const users = JSON.parse(
        localStorage.getItem("users")
    ) || [];

    const alerts = JSON.parse(
        localStorage.getItem("alerts")
    ) || [];

    const notifications = JSON.parse(
        localStorage.getItem("notifications")
    ) || [];


    // COUNT TOTAL ACCOUNTS
    document.getElementById("totalAccounts").textContent =
        users.length;


    // COUNT LOST PHONE ALERTS
    const lostPhoneAlerts = alerts.filter(function (alert) {

        return alert.type === "LOST PHONE";

    });

    document.getElementById("lostAlerts").textContent =
        lostPhoneAlerts.length;


    // COUNT HELP REQUESTS
    const helpAlerts = alerts.filter(function (alert) {

        return alert.type === "I NEED HELP";

    });

    document.getElementById("helpAlerts").textContent =
        helpAlerts.length;


    // COUNT UNREAD NOTIFICATIONS
    const unreadNotifications = notifications.filter(
        function (notification) {

            return notification.read === false;

        }
    );

    document.getElementById(
        "newNotifications"
    ).textContent =
        unreadNotifications.length;


    // DISPLAY EVERYTHING
    displayAlerts(alerts);

    displayUsers(users);

    displayNotifications(notifications);
}


// ========================================
// DISPLAY ALERTS
// ========================================

function displayAlerts(alerts) {

    const alertsList =
        document.getElementById("alertsList");

    alertsList.innerHTML = "";


    if (alerts.length === 0) {

        alertsList.innerHTML =
            '<div class="empty-message">' +
            'No emergency alerts yet.' +
            '</div>';

        return;
    }


    alerts.forEach(function (alert) {

        let locationText =
            "Location not available";

        let mapLink = "";


        if (alert.location) {

            locationText =
                "Latitude: " +
                alert.location.latitude +
                " | Longitude: " +
                alert.location.longitude;

            mapLink =
                '<br><br>' +
                '<a href="https://www.google.com/maps?q=' +
                alert.location.latitude +
                ',' +
                alert.location.longitude +
                '" target="_blank">' +
                '📍 VIEW LOCATION ON MAP' +
                '</a>';
        }


        const alertClass =
            alert.type === "LOST PHONE"
                ? "alert-new"
                : "help-new";


        alertsList.innerHTML +=

            '<div class="admin-item ' +
            alertClass +
            '">' +

            '<h3>🚨 ' +
            alert.type +
            '</h3>' +

            '<p><strong>User:</strong> ' +
            alert.userEmail +
            '</p>' +

            '<p><strong>Phone:</strong> ' +
            alert.phone +
            '</p>' +

            '<p><strong>Serial Number:</strong> ' +
            alert.serial +
            '</p>' +

            '<p><strong>Time:</strong> ' +
            alert.time +
            '</p>' +

            '<p><strong>Location:</strong> ' +
            locationText +
            '</p>' +

            mapLink +

            '</div>';
    });
}


// ========================================
// DISPLAY USERS
// ========================================

function displayUsers(users) {

    const usersList =
        document.getElementById("usersList");

    usersList.innerHTML = "";


    if (users.length === 0) {

        usersList.innerHTML =
            '<div class="empty-message">' +
            'No registered users yet.' +
            '</div>';

        return;
    }


    users.forEach(function (user) {

        usersList.innerHTML +=

            '<div class="admin-item">' +

            '<h3>👤 ' +
            user.email +
            '</h3>' +

            '<p><strong>Phone:</strong> ' +
            user.phone +
            '</p>' +

            '<p><strong>Serial Number:</strong> ' +
            user.serial +
            '</p>' +

            '<p><strong>Apple ID / iCloud:</strong> ' +
            user.icloud +
            '</p>' +

            '<p><strong>Registered:</strong> ' +
            user.registeredAt +
            '</p>' +

            '</div>';
    });
}


// ========================================
// DISPLAY NOTIFICATIONS
// ========================================

function displayNotifications(notifications) {

    const notificationsList =
        document.getElementById("notificationsList");

    notificationsList.innerHTML = "";


    if (notifications.length === 0) {

        notificationsList.innerHTML =
            '<div class="empty-message">' +
            'No notifications yet.' +
            '</div>';

        return;
    }


    notifications.forEach(
        function (notification) {

            notificationsList.innerHTML +=

                '<div class="admin-item notification-item">' +

                '<h3>🔔 ' +
                notification.type +
                '</h3>' +

                '<p><strong>User:</strong> ' +
                notification.user +
                '</p>' +

                '<p>' +
                notification.message +
                '</p>' +

                '<p><strong>Time:</strong> ' +
                notification.time +
                '</p>' +

                '</div>';
        }
    );
}


// ========================================
// SWITCH ADMIN SECTIONS
// ========================================

function showAdminSection(sectionName) {

    const sections =
        document.querySelectorAll(".admin-section");


    sections.forEach(function (section) {

        section.classList.remove(
            "active-admin-section"
        );
    });


    if (sectionName === "alerts") {

        document.getElementById(
            "adminAlerts"
        ).classList.add(
            "active-admin-section"
        );
    }


    if (sectionName === "users") {

        document.getElementById(
            "adminUsers"
        ).classList.add(
            "active-admin-section"
        );
    }


    if (sectionName === "notifications") {

        document.getElementById(
            "adminNotifications"
        ).classList.add(
            "active-admin-section"
        );

        markNotificationsAsRead();
    }
}


// ========================================
// MARK NOTIFICATIONS AS READ
// ========================================

function markNotificationsAsRead() {

    let notifications = JSON.parse(
        localStorage.getItem("notifications")
    ) || [];


    notifications = notifications.map(
        function (notification) {

            notification.read = true;

            return notification;
        }
    );


    localStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
    );


    loadAdminDashboard();
}


// ========================================
// SECURE ADMIN KEYBOARD SHORTCUT
// ========================================

document.addEventListener(
    "keydown",

    function (event) {

        // Press Ctrl + Shift + A
        if (
            event.ctrlKey &&
            event.shiftKey &&
            event.key.toLowerCase() === "a"
        ) {

            event.preventDefault();

            // Ask for the admin password
            const adminPassword = prompt(
                "🔐 ENTER ADMIN PASSWORD"
            );

            // CHANGE 48ADMIN to your own password
            if (adminPassword === "48ADMIN") {

                openAdmin();

            } else if (adminPassword !== null) {

                alert(
                    "❌ ACCESS DENIED. Incorrect admin password."
                );
            }
        }
    }
);