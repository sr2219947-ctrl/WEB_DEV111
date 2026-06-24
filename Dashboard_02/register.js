 function register() {
      const name     = document.getElementById('fullname').value.trim();
      const username = document.getElementById('username').value.trim();
      const email =    document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirm  = document.getElementById('confirm').value;
      const err      = document.getElementById('errMsg');
      const errText  = document.getElementById('errText');
      const success  = document.getElementById('successMsg');

      err.classList.remove('show');
      success.classList.remove('show');

      // Validations
      if (!name || !username ||!email|| !password || !confirm) {
        errText.textContent = 'Please fill in all fields.';
        err.classList.add('show');
        return;
      }
      if (username.length < 3) {
        errText.textContent = 'Username must be at least 3 characters.';
        err.classList.add('show');
        return;
      }
      if (password.length < 6) {
        errText.textContent = 'Password must be at least 6 characters.';
        err.classList.add('show');
        return;
      }
      if (password !== confirm) {
        errText.textContent = 'Passwords do not match.';
        err.classList.add('show');
        document.getElementById('confirm').value = '';
        return;
      }
      if (username === 'admin') {
        errText.textContent = 'Username "admin" is reserved. Choose another.';
        err.classList.add('show');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        errText.textContent = 'Please enter a valid email address.';
        err.classList.add('show');
        return;

      }

      // Check if username already taken
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (users.find(u => u.username === username)) {
        errText.textContent = 'Username already taken. Try a different one.';
        err.classList.add('show');
        return;
      }
     //check duplicate email 

     if (users.find(u => u.email === email)) {

      errText.textContent = 'Email already registered.';
      err.classList.add('show');
      return;

     }

      // Save user
      users.push({ name, username,email, password });
      localStorage.setItem('registeredUsers', JSON.stringify(users));

      // Show success and redirect
      success.classList.add('show');
      setTimeout(() => { location.href = 'index.html'; }, 1800);
    }

    // Enter key
    document.addEventListener('keydown', e => { if (e.key === 'Enter') register(); });

    // Toggle password
    document.getElementById('eyeBtn').addEventListener('click', function () {
      const input = document.getElementById('password');
      const icon  = document.getElementById('eyeIcon');
      const show  = input.type === 'password';
      input.type  = show ? 'text' : 'password';
      icon.className = show ? 'ti ti-eye-off' : 'ti ti-eye';
    });

    // Toggle confirm password
    document.getElementById('eyeBtn2').addEventListener('click', function () {
      const input = document.getElementById('confirm');
      const icon  = document.getElementById('eyeIcon2');
      const show  = input.type === 'password';
      input.type  = show ? 'text' : 'password';
      icon.className = show ? 'ti ti-eye-off' : 'ti ti-eye';
    });

    // Clear error on typing
    ['fullname','email' , 'username', 'password', 'confirm'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        document.getElementById('errMsg').classList.remove('show');
      });
    });