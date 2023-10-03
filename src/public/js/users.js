
function changeUserRole(userId) {
  fetch(`/api/user/changeRole/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {

        Swal.fire('Role Changed!', 'User role was successfully changed', 'success');
      } else {
        Swal.fire('Error!', 'An error occurred while changing the user role', 'error');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      Swal.fire('Error!', 'An error occurred while changing the user role', 'error');
    });
}

function deleteUser(userId) {
  fetch(`/api/user/${userId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        Swal.fire('Deleted!', 'User deleted successfully', 'success');
      } else {
        Swal.fire('Error!', 'An error occurred while deleting the user', 'error');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      Swal.fire('Error!', 'An error occurred while deleting the user', 'error');
    });
}

