function login() {
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value;
  const err = document.getElementById('errMsg');

  if (u === 'admin' && p === 'admin123') {

    // store login
    localStorage.setItem('isLoggedIn', 'true');

    location.href = 'dashboard.html';

  } else {
    err.classList.add('show');
    document.getElementById('password').value = '';
  }
}


// Enter key to submit
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') login();
});


// Toggle password visibility
document.getElementById('eyeBtn').addEventListener('click', function () {

  const input = document.getElementById('password');
  const icon = document.getElementById('eyeIcon');

  const show = input.type === 'password';

  input.type = show ? 'text' : 'password';

  icon.className = show ? 'ti ti-eye-off' : 'ti ti-eye';

});


// Clear error on typing
['username', 'password'].forEach(id => {

  document.getElementById(id).addEventListener('input', () => {

    document.getElementById('errMsg').classList.remove('show');

  });

});