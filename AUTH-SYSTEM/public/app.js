const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const registerMessage = document.getElementById("registerMessage");
const loginMessage = document.getElementById("loginMessage");
const profileContainer = document.getElementById("profile");
const welcomeHeading = document.getElementById("welcome");
const logoutBtn = document.getElementById("logoutBtn");

const showMessage = (element, message, isError = true) => {
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? "#c0392b" : "#1f7a3f";
};

const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem("accessToken", token);
  }
};

const getAccessToken = () => localStorage.getItem("accessToken");

const refreshAccessToken = async () => {
  const response = await fetch("/api/refresh", { method: "POST" });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  if (data.accessToken) {
    setAccessToken(data.accessToken);
    return data.accessToken;
  }
  return null;
};

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(registerForm);
    const payload = Object.fromEntries(formData.entries());

    if (!payload.email.includes("@")) {
      showMessage(registerMessage, "Enter a valid email address.");
      return;
    }
    if ((payload.password || "").length < 8) {
      showMessage(registerMessage, "Password must be at least 8 characters.");
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      showMessage(registerMessage, data.message || "Registration failed.");
      return;
    }

    showMessage(registerMessage, "Registration successful. You can log in.", false);
    registerForm.reset();
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      showMessage(loginMessage, data.message || "Login failed.");
      return;
    }
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }
    window.location.href = "/dashboard";
  });
}

if (profileContainer) {
  const loadProfile = async () => {
    let token = getAccessToken();
    if (!token) {
      token = await refreshAccessToken();
    }
    if (!token) {
      window.location.href = "/login.html";
      return;
    }

    let response = await fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
      token = await refreshAccessToken();
      if (!token) {
        window.location.href = "/login.html";
        return;
      }
      response = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (!response.ok) {
      window.location.href = "/login.html";
      return;
    }

    const data = await response.json();
    welcomeHeading.textContent = `Welcome, ${data.firstName}!`;
    profileContainer.innerHTML = `
      <div>
        <span>Name</span>
        <strong>${data.firstName} ${data.lastName}</strong>
      </div>
      <div>
        <span>Email</span>
        <strong>${data.email}</strong>
      </div>
      <div>
        <span>Member since</span>
        <strong>${new Date(data.createdAt).toLocaleDateString()}</strong>
      </div>
    `;
  };

  loadProfile();
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("accessToken");
    window.location.href = "/login.html";
  });
}
