document.getElementById('whole').addEventListener('click', async () => {
    const username = document.getElementById('dp').value.trim();
    const message = document.getElementById('message');
    const table = document.getElementById('dataTable');
    const tableBody = document.getElementById('dataTableBody');

    if (!username) {
        message.style.display = "block";
        message.textContent = "Username can't be Empty ⚠️";
        table.style.display = "none";
        return;
    }

    // try {
        // const response = await fetch('/wholeinstaFetch', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ username })
        // });
         
       const puru= await fetch(`/wholeinstaFetch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);

         if(puru.ok){
            console.log(response)
            //     const data = await response.json();
            //     data.forEach(item => {
            //         console.log(item.index
            //         )
                    
            //     });
                // const data = await response.json();
                // console.log(data);
            // } else {
            //     console.error(`Error: ${response.statusText}`);
            //     message.style.display = "block";
            //     message.textContent = `Error: ${response.statusText}`;
            // }
         }

        // if (response.ok) {
        //     console.log(response)
        //     const data = await response.json();
        //     data.forEach(item => {
        //         console.log(item.index
        //         )
                
        //     });
            // const data = await response.json();
            // console.log(data);
        // } else {
        //     console.error(`Error: ${response.statusText}`);
        //     message.style.display = "block";
        //     message.textContent = `Error: ${response.statusText}`;
        // }
    });
})




    // document.getElementById('whole').addEventListener('click', function() {
    //     let username = document.getElementById('dp').value;
        
    //     if (username.trim()) {
    //       fetch('/wholeinstaFetch', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ username: username }),
    //       })
    //       .then(response => response.json())
    //       .then(data => {
    //         console.log(data); // For debugging purposes
    //         if (data.error) {
    //           alert(data.error);
    //           return;
    //         }
  
    //         // Clear the existing table data
    //         let tableBody = document.getElementById('dataTableBody');
    //         tableBody.innerHTML = '';
  
    //         // Loop through the results and add rows to the table
    //         data.forEach((user, index) => {
    //           let row = document.createElement('tr');
  
    //           row.innerHTML = `
    //             <td>${user.index}</td>
    //             <td><img src="${user.profile_pic_url}" alt="Profile Picture" class="profile-pic" onerror="this.src='/static/default_placeholder.jpg';" width="50" height="50"></td>
    //             <td>${user.full_name}</td>
    //             <td>${user.username}</td>
    //             <td>${user.is_private ? 'Yes' : 'No'}</td>
    //             <td>${user.is_verified ? 'Yes' : 'No'}</td>
    //           `;
              
    //           tableBody.appendChild(row);
    //         });
  
    //         // Show the table after populating data
    //         document.getElementById('dataTable').style.display = 'table';
    //       })
    //       .catch(error => {
    //         console.error('Error fetching data:', error);
    //       });
    //     } else {
    //       alert("Please enter a username.");
    //     }
    //   });