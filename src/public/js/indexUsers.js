function changeUserRole(button) {
    const userId = button.getAttribute('data-user-id');
    fetch(`/api/user/changeRole/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    console.log(response)
        .then((response) => {
            if (response.ok) {
                console.log(`Role changed for user with ID ${userId}`);
            } else {
                console.error('Failed to change user role');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}