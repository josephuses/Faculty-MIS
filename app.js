<script>
  // Persistent email storage
  let userEmail = localStorage.getItem('pds_user_email');
  if (!userEmail) {
    userEmail = prompt("Enter your email (e.g., faculty@test.com):");
    if (userEmail) localStorage.setItem('pds_user_email', userEmail);
    else userEmail = "test@example.com";
  }
  window.GLOBAL_USER_EMAIL = userEmail;
  document.getElementById("displayEmail").innerText = userEmail;
  
  // Pagination (same as before)
  let currentPage = 1;
  const totalPages = 6;
  function changePage(direction) {
    document.getElementById('page' + currentPage).classList.remove('active');
    currentPage += direction;
    document.getElementById('page' + currentPage).classList.add('active');
    document.getElementById('prevBtn').style.display = (currentPage === 1) ? 'none' : 'inline-block';
    document.getElementById('nextBtn').style.display = (currentPage === totalPages) ? 'none' : 'inline-block';
    document.getElementById('submitBtn').style.display = (currentPage === totalPages) ? 'inline-block' : 'none';
    document.getElementById('progressText').innerText = `Step ${currentPage} of ${totalPages}`;
    window.scrollTo(0, 0);
  }
  window.changePage = changePage;
</script>
