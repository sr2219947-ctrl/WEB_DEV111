 // Clear session — must login every time
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');

    function login() {
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value;
      const err = document.getElementById('errMsg');
      const errText = document.getElementById('errText');

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

    // Enter key
    document.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });

    // Toggle password
    document.getElementById('eyeBtn').addEventListener('click', function () {
      const input = document.getElementById('password');
      const icon  = document.getElementById('eyeIcon');
      const show  = input.type === 'password';
      input.type  = show ? 'text' : 'password';
      icon.className = show ? 'ti ti-eye-off' : 'ti ti-eye';
    });

    // Clear error on typing
    ['username', 'password'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        document.getElementById('errMsg').classList.remove('show');
      });
    });
