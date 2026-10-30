(function () {
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const LETTER = /[A-Za-z]/;
    const NUMBER = /\d/;

    function $(id) {
        return document.getElementById(id);
    }

    function setError(input, message) {
        input.setAttribute("aria-invalid", message ? "true" : "false");
        const ids = (input.getAttribute("aria-describedby") || "").split(/\s+/);
        const errorId = ids.find(function (id) { return /-error$/.test(id); }) || ids[0];
        if (errorId) {
            const slot = document.getElementById(errorId);
            if (slot) slot.textContent = message || "";
        }
    }

    function passwordRules(value) {
        return {
            length: value.length >= 8,
            letter: LETTER.test(value),
            number: NUMBER.test(value)
        };
    }

    function passwordValid(value) {
        const rules = passwordRules(value);
        return rules.length && rules.letter && rules.number;
    }

    function updateRulePills(password) {
        const rules = passwordRules(password);
        const map = {
            "rule-length": rules.length,
            "rule-letter": rules.letter,
            "rule-number": rules.number
        };
        Object.keys(map).forEach(function (id) {
            const el = $(id);
            if (!el) return;
            el.classList.toggle("is-met", map[id]);
            el.classList.toggle("is-fail", password.length > 0 && !map[id]);
        });
    }

    function toast(message) {
        const stack = $("toast-stack");
        if (!stack) return;
        const note = document.createElement("div");
        note.className = "toast";
        note.setAttribute("role", "status");
        note.textContent = message;
        stack.appendChild(note);
        setTimeout(function () {
            note.remove();
        }, 2400);
    }

    document.querySelectorAll("[data-toggle-password]").forEach(function (button) {
        button.addEventListener("click", function () {
            const input = document.getElementById(button.getAttribute("data-toggle-password"));
            if (!input) return;
            const hidden = input.type === "password";
            input.type = hidden ? "text" : "password";
            button.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
            const icon = button.querySelector("i");
            if (icon) {
                icon.className = hidden ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
            }
        });
    });

    const loginForm = $("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = $("email");
            const password = $("password");
            const alertBox = $("form-alert");
            let valid = true;

            if (!EMAIL_PATTERN.test(email.value.trim())) {
                setError(email, "Enter a valid email.");
                valid = false;
            } else {
                setError(email, "");
            }

            if (!password.value) {
                setError(password, "Enter your password.");
                valid = false;
            } else {
                setError(password, "");
            }

            if (!valid) {
                alertBox.textContent = "Fix the highlighted fields.";
                alertBox.classList.add("is-visible");
                return;
            }

            alertBox.classList.remove("is-visible");
            toast("Signed in (UI mockup — no server).");
            window.setTimeout(function () {
                window.location.href = "../index.html";
            }, 700);
        });
    }

    const signupForm = $("signup-form");
    if (signupForm) {
        const password = $("password");
        ["input", "change"].forEach(function (eventName) {
            password.addEventListener(eventName, function () {
                updateRulePills(password.value);
            });
        });

        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = $("name");
            const email = $("email");
            const confirm = $("confirm");
            const alertBox = $("form-alert");
            let valid = true;

            if (name.value.trim().length < 2) {
                setError(name, "Enter your name (at least 2 characters).");
                valid = false;
            } else {
                setError(name, "");
            }

            if (!EMAIL_PATTERN.test(email.value.trim())) {
                setError(email, "Enter a valid email.");
                valid = false;
            } else {
                setError(email, "");
            }

            if (!passwordValid(password.value)) {
                setError(password, "Must be at least 8 characters and include a letter and a number.");
                valid = false;
            } else {
                setError(password, "");
            }

            if (confirm.value !== password.value || !confirm.value) {
                setError(confirm, "Passwords do not match.");
                valid = false;
            } else {
                setError(confirm, "");
            }

            updateRulePills(password.value);

            if (!valid) {
                alertBox.textContent = "Fix the highlighted fields.";
                alertBox.classList.add("is-visible");
                return;
            }

            alertBox.classList.remove("is-visible");
            toast("Account created (UI mockup — no server).");
            window.setTimeout(function () {
                window.location.href = "login.html";
            }, 700);
        });
    }
}());
