// Clear session — must login every time
localStorage.removeItem('isLoggedIn');
localStorage.removeItem('currentUser');

let verifiedUsername = null; // holds username once identity is confirmed during password reset

/* ============ LOGIN ============ */

function login() {
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value;
  const err = document.getElementById('errMsg');
  const errText = document.getElementById('errText');

  err.classList.remove('show');

  if (!u || !p) {
    errText.textContent = 'Please fill in both fields.';
    err.classList.add('show');
    return;
  }

  // Check default admin
  if (u === 'admin' && p === 'admin123') {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', 'Admin');
    location.href = 'Dashboard/';
    return;
  }

  // Check registered users
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const found = users.find(user => user.username === u && user.password === p);

  if (found) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', found.name);
    location.href = 'Dashboard/';
  } else {
    errText.textContent = 'Invalid username or password. Try again.';
    err.classList.add('show');
    document.getElementById('password').value = '';
  }
}

/* ============ FORGOT PASSWORD ============ */

function showForgotForm(e) {
  e.preventDefault();

  document.getElementById('errMsg').classList.remove('show');
  document.getElementById('successMsg').classList.remove('show');

  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('verifyForm').style.display = 'block';
  document.getElementById('resetForm').style.display = 'none';

  document.getElementById('formTitle').textContent = 'Reset Password 🔒';
  document.getElementById('formSubtitle').textContent = 'Step 1: Verify your identity';
  document.getElementById('heroTitle').innerHTML = 'Forgot your<br>password <span>?</span> 🔑';
  document.getElementById('heroText').textContent = 'No worries — verify your username and email to set a new password.';
}

function showLoginForm(e) {
  e.preventDefault();

  document.getElementById('errMsg').classList.remove('show');
  document.getElementById('successMsg').classList.remove('show');

  document.getElementById('verifyForm').style.display = 'none';
  document.getElementById('resetForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';

  document.getElementById('formTitle').textContent = 'Welcome back 👋';
  document.getElementById('formSubtitle').textContent = 'Sign in to continue to your dashboard';
  document.getElementById('heroTitle').innerHTML = 'Track your<br>learning <span>journey</span> 🌿';
  document.getElementById('heroText').textContent = 'Stay on top of your study goals, manage topics, and build unstoppable streaks.';

  // Clear reset fields for next time
  document.getElementById('vUsername').value = '';
  document.getElementById('vEmail').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmNewPassword').value = '';
}

function verifyIdentity() {
  const username = document.getElementById('vUsername').value.trim();
  const email     = document.getElementById('vEmail').value.trim();
  const err       = document.getElementById('errMsg');
  const errText   = document.getElementById('errText');

  err.classList.remove('show');

  if (!username || !email) {
    errText.textContent = 'Please fill in both fields.';
    err.classList.add('show');
    return;
  }

  if (username === 'admin') {
    errText.textContent = 'Admin password cannot be reset here.';
    err.classList.add('show');
    return;
  }

  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const found = users.find(u => u.username === username && u.email === email);

  if (!found) {
    errText.textContent = 'No account found with that username and email.';
    err.classList.add('show');
    return;
  }

  // Identity verified — move to step 2
  verifiedUsername = username;
  document.getElementById('verifyForm').style.display = 'none';
  document.getElementById('resetForm').style.display = 'block';
  document.getElementById('formSubtitle').textContent = 'Step 2: Set your new password';
}

function resetPassword() {
  const newPassword     = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmNewPassword').value;
  const err             = document.getElementById('errMsg');
  const errText         = document.getElementById('errText');
  const success         = document.getElementById('successMsg');
  const successText     = document.getElementById('successText');

  err.classList.remove('show');
  success.classList.remove('show');

  if (!newPassword || !confirmPassword) {
    errText.textContent = 'Please fill in both password fields.';
    err.classList.add('show');
    return;
  }
  if (newPassword.length < 6) {
    errText.textContent = 'Password must be at least 6 characters.';
    err.classList.add('show');
    return;
  }
  if (newPassword !== confirmPassword) {
    errText.textContent = 'Passwords do not match.';
    err.classList.add('show');
    document.getElementById('confirmNewPassword').value = '';
    return;
  }

  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const idx = users.findIndex(u => u.username === verifiedUsername);

  if (idx === -1) {
    errText.textContent = 'Something went wrong. Please try again.';
    err.classList.add('show');
    return;
  }

  users[idx].password = newPassword;
  localStorage.setItem('registeredUsers', JSON.stringify(users));

  // Back to login form, with a success message and username pre-filled
  showLoginForm({ preventDefault: () => {} });
  document.getElementById('username').value = verifiedUsername;
  successText.textContent = 'Password updated! You can now sign in.';
  success.classList.add('show');
  verifiedUsername = null;
}

/* ============ SHARED UI BEHAVIOR ============ */

// Enter key — routes to whichever form is currently visible
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (document.getElementById('resetForm').style.display === 'block') {
    resetPassword();
  } else if (document.getElementById('verifyForm').style.display === 'block') {
    verifyIdentity();
  } else {
    login();
  }
});

// Toggle password (login form)
document.getElementById('eyeBtn').addEventListener('click', function () {
  const input = document.getElementById('password');
  const icon  = document.getElementById('eyeIcon');
  const show  = input.type === 'password';
  input.type  = show ? 'text' : 'password';
  icon.className = show ? 'ti ti-eye-off' : 'ti ti-eye';
});

// Toggle new password (reset form)
document.getElementById('eyeBtn3').addEventListener('click', function () {
  const input = document.getElementById('newPassword');
  const icon  = document.getElementById('eyeIcon3');
  const show  = input.type === 'password';
  input.type  = show ? 'text' : 'password';
  icon.className = show ? 'ti ti-eye-off' : 'ti ti-eye';
});

// Toggle confirm new password (reset form)
document.getElementById('eyeBtn4').addEventListener('click', function () {
  const input = document.getElementById('confirmNewPassword');
  const icon  = document.getElementById('eyeIcon4');
  const show  = input.type === 'password';
  input.type  = show ? 'text' : 'password';
  icon.className = show ? 'ti ti-eye-off' : 'ti ti-eye';
});

// Clear error on typing — login fields
['username', 'password'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById('errMsg').classList.remove('show');
  });
});

// Clear error on typing — verify + reset fields
['vUsername', 'vEmail', 'newPassword', 'confirmNewPassword'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById('errMsg').classList.remove('show');
  });
});