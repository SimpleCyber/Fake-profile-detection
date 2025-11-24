
changeTheme();

let noOfPosts;



function changeTheme() {
    if (localStorage.getItem("ModeColor") == "dark") {

        document.documentElement.style.setProperty('--light', "#F8F9FA")
        document.documentElement.style.setProperty('--dark', "#2C3E50")
        document.documentElement.style.setProperty('--material', "#1ABC9C")
        document.documentElement.style.setProperty('--text', "#ECF0F1")
        document.documentElement.style.setProperty('--darkText', "black")
        document.documentElement.style.setProperty('--primary-bg1', "#BBD4D4")
        document.documentElement.style.setProperty('--select', "white")
        document.documentElement.style.setProperty('--Icon-bg', "#1f2830")
        localStorage.setItem("ModeColor", "light");

        document.getElementById("modeColor").className = "fa-solid fa-moon";

        document.getElementById('progressData').style.backgroundColor = '#0F1035'



        
    }
    else {
        document.documentElement.style.setProperty('--light', "#2f3046")
        document.documentElement.style.setProperty('--dark', "#14152a")
        document.documentElement.style.setProperty('--material', "#1ABC9C")
        document.documentElement.style.setProperty('--text', "#ffffff")
        document.documentElement.style.setProperty('--darkText', "#ffffff")
        document.documentElement.style.setProperty('--primary-bg1', "#14152a")
        document.documentElement.style.setProperty('--select', "#2f3046")
        document.documentElement.style.setProperty('--Icon-bg', "#1ABC9C")

        document.getElementById("modeColor").className = "fa-solid fa-sun";

        document.getElementById('progressData').style.backgroundColor = '#14152a'
    }

}

document.querySelectorAll('.socialLogo').forEach(icon => {
    icon.addEventListener('click', () => {
        // Remove 'logobg' class from all icons
        document.querySelectorAll('.socialLogo').forEach(el => el.classList.remove('logobg'));
        
        // Add 'logobg' class to the clicked icon
        icon.classList.add('logobg');
    });
});



document.getElementById("signupButton").addEventListener('click', function () {
    window.location = "login"
})

document.getElementById("modeColor").addEventListener('click', function () {
    changeMode();
})

document.getElementById("Reports").addEventListener('click',function(){
    window.location="reports"
})



function changeMode() {

    if (localStorage.getItem("ModeColor") == "light") {
        localStorage.setItem("ModeColor", "dark")
        document.getElementById("modeColor").className = "fa-solid fa-sun";
    }
    else {
        localStorage.setItem("ModeColor", "light")
        document.getElementById("modeColor").className = "fa-solid fa-moon";
    }

    changeTheme();
}



document.querySelectorAll('.socialLogo').forEach(icon => {
    icon.addEventListener('click', () => {
        // Remove 'logobg' class from all icons
        document.querySelectorAll('.socialLogo').forEach(el => el.classList.remove('logobg'));
        
        // Add 'logobg' class to the clicked icon
        icon.classList.add('logobg');
    });
});

let userMedia; 
document.querySelectorAll('.socialLogo').forEach(icon => {
    icon.addEventListener('click', function() {
        // Log the value of the clicked icon
        userMedia = this.getAttribute('value');
    });
});




document.getElementById('btnStart').addEventListener('click', () => {
    const username = document.getElementById('socialUsername').value;
    if (username == "") {
        return alert("Username can't be Empty ⚠️")
    }
    if (document.getElementById('testType').value == "1") {
        document.getElementById('progressData').innerHTML = ''
        let update = document.createElement('p')
        update.className = 'workingStyle'
        update.innerHTML = '🟢 ' + 'Verifying Profile...'
        document.getElementById('progressData').appendChild(update)

        console.log(`/${userMedia}`)
        
        fetch(`/${userMedia}`, {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                if (data.error) {

                    dataErrorDisplay(data)

                }
                else {
                    dataProgressDisplay(username)
                }
            })
            .catch(error => {
                console.log(error);
            }
        );
       
    }

});

function dataProgressDisplay(username) {

    let update = document.createElement('p')
    update.className = 'workingStyle'

    update.innerHTML = '🟡 ' + 'Collecting User Data...'

    document.getElementById('progressData').appendChild(update)

    let prof_data;
setTimeout(() => {
    let update1 = document.createElement('p');
    update1.className = 'progressStyle';

    fetch(`/${username}/${username}_profile/profile_data.json`)
        .then(response => {
            // Check if the response status is OK (200)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            prof_data = data;
            update1.innerHTML = `✅ Followers : ${data.Followers}`;
            document.getElementById('progressData').appendChild(update1);
        })
        .catch(error => {
            console.error('Error fetching data:', error);

            // Create and append the error message to the HTML page
            let errorMessage = document.createElement('p');
            errorMessage.className = 'errorStyle';
            errorMessage.innerHTML = '❌ No username found <br> Please Try again :)';
            document.getElementById('progressData').appendChild(errorMessage);
        });
}, 500);


    setTimeout(() => {
        let update2 = document.createElement('p');
        update2.className = 'progressStyle';

        update2.innerHTML = `✅ Following : ${prof_data.Following}`;

        document.getElementById('progressData').appendChild(update2);

    }, 1000);

    setTimeout(() => {
        let update3 = document.createElement('p');
        update3.className = 'progressStyle';

        update3.innerHTML = `✅ Bio : ${prof_data.Bio}`;

        document.getElementById('progressData').appendChild(update3);

    }, 1500);

    setTimeout(() => {
        let update4 = document.createElement('p');
        update4.className = 'progressStyle';

        update4.innerHTML = `✅ Verified : ${prof_data.Verified}`;

        document.getElementById('progressData').appendChild(update4);

    }, 2000);

    setTimeout(() => {
        let update5 = document.createElement('p');
        update5.className = 'progressStyle';

        update5.innerHTML = `✅ Name : ${prof_data.Name}`;

        document.getElementById('progressData').appendChild(update5);

    }, 2500);

    setTimeout(() => {
        let update6 = document.createElement('p');
        update6.className = 'progressStyle';

        update6.innerHTML = `✅ Number of Posts : ${prof_data.NumberOfPosts}`;

        document.getElementById('progressData').appendChild(update6);

    }, 3000);

    setTimeout(() => {
        let update7 = document.createElement('p');
        update7.className = 'progressStyle';

        update7.innerHTML = `✅ Account Privacy : ${prof_data.AccountPrivacy}`;

        document.getElementById('progressData').appendChild(update7);

        displayUserProfile(username);


    }, 3500);


}




function postProgressDisplay(username, totalPosts) {
    document.getElementById('progressData').innerHTML = '';

    let update = document.createElement('p');
    update.className = 'workingStyle';
    update.innerHTML = '🟡 ' + 'Collecting User Posts...';
    document.getElementById('progressData').appendChild(update);

    let update1 = document.createElement('img');
    update1.className = 'profileImg';
    document.getElementById('progressData').appendChild(update1);

    for (let i = 1; i <= totalPosts - 1; i++) {
        setTimeout(() => {
            update1.src = `/${username}/${username}_posts/${username}_post_${i}.jpg`;
        }, i * 250);
    }

    setTimeout(() => {
        collectCaptions(username, totalPosts);
    }, totalPosts * 250 + 500);
}



function collectCaptions(username, totalPosts) {
    document.getElementById('progressData').innerHTML = '';

    if (totalPosts === 0 ) {
        totalPosts ++;
    }

    let update = document.createElement('p');
    update.className = 'workingStyle';
    update.innerHTML = '🟡 ' + 'Collecting Post Captions...';
    document.getElementById('progressData').appendChild(update);

    let update1 = document.createElement('p');
    update1.className = 'progressStyle';
    document.getElementById('progressData').appendChild(update1);

    for (let i = 0; i < totalPosts - 1; i++) {
        setTimeout(() => {
            fetch(`/${username}/${username}_captions/captions.json`)
                .then(response => response.json())
                .then(data => {
                    update1.innerHTML = data[i].Caption;
                })
                .catch(error => console.error('Error fetching data:', error));
        }, i * 250);
    }

    setTimeout(() => {
        totalPosts=10;
        // fraudTest(username, totalPosts);
         opentest(username); //----> open ai 1
    }, totalPosts * 250 + 500);
}

async function opentest(username) {

    try {
        // Fetch bio text
        const dataResponse = await fetch(`/${username}/${username}_profile/data.json`);
        const completeData = await dataResponse.json();
        

        // Perform fraud test with the retrieved data
        const fraudResultResponse = await fetch('/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'userinformation':completeData })
        });

        if (!fraudResultResponse.ok) {
            throw new Error(`Server error: ${fraudResultResponse.statusText}`);
        }

        const fraudResult = await fraudResultResponse.json();
        console.log(fraudResult);

        // Optionally display the fraud test result
        // showFraudResult(fraudResult);
        displayResult(fraudResult) //----> open ai 2
    } catch (error) {
        console.error('Error in opentest:', error);
    }
}




async function fraudTest(username, tw) {
    let captionData;
    let bioText;

    try {
        // Fetch caption data
        const captionResponse = await fetch(`/${username}/${username}_captions/captions.json`);
        captionData = await captionResponse.json();

        // Fetch bio text
        const profileResponse = await fetch(`/${username}/${username}_profile/profile_data.json`);
        const profileData = await profileResponse.json();
        bioText = profileData.Bio;

        // Perform fraud test with the retrieved data
        const fraudResultResponse = await fetch('/fraud_result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'noOfPosts': Number(tw), 'captionData': captionData, 'bioText': bioText })
        });

        const fraudResult = await fraudResultResponse.json();

        console.log("hiio jiiii : ",fraudResult);

        // showFraudResult(fraudResult.result);

        displayResult(fraudResult)// -----> open ai 3
    } catch (error) {
        console.error('Error in fraudTest:', error);
    }
}



function showFraudResult(fraudPercent) {
    console.log("hiio jiiii 22222 :",fraudPercent);

    document.getElementById('progressData').innerHTML = ''

    let update1 = document.createElement('p')
    update1.className = 'progressStyle'

    update1.innerHTML = '🟡 ' + 'Detecting Frauds'

    document.getElementById('progressData').appendChild(update1)

    setTimeout(() => {

        let update2 = document.createElement('h2')
        update2.className = 'fr1'

        update2.innerHTML = 'Chances of Being Fraud'

        document.getElementById('progressData').appendChild(update2)

        let update3 = document.createElement('h2');
        update3.className = 'fr2';
        update3.id = 'fri';
        
        if (Number(fraudPercent) > 50) {
            update3.style.backgroundColor = "red";
        }
        
        update3.innerHTML = Number(fraudPercent).toFixed(0) + '%'

        document.getElementById('progressData').appendChild(update3)


    }, 2000);

 

}



function displayResult(fraudResult) {
    document.getElementById('progressData').innerHTML = ''
    console.log(fraudResult)
     let update1 = document.createElement('p');
     update1.className = 'progressStyle';
     update1.innerHTML = ` ${fraudResult.result}`;
    document.getElementById('progressData').appendChild(update1);
}




function displayUserProfile(username) {
    document.getElementById('progressData').innerHTML = '';

    let update = document.createElement('p');
    update.className = 'workingStyle';
    update.innerHTML = '🟡 ' + 'Collecting User Profile Picture...';
    document.getElementById('progressData').appendChild(update);

    // Fetch the profile data
    fetch(`/${username}/${username}_profile/profile_data.json`)
        .then(response => response.json())
        .then(data => {
            // Check if the 'NumberOfPosts' property exists
            if (data.NumberOfPosts) {
                const totalPosts = Math.min(data.NumberOfPosts, 20);
                displayProfilePicture(username);
                setTimeout(() => {
                    postProgressDisplay(username, totalPosts);

                }, 700);
            } 
            else {
                console.error('Error: Number of posts not found in profile data.');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayProfilePicture(username) {

    let update1 = document.createElement('img');
    update1.className = 'profileImg';
    update1.src = `/${username}/${username}_profile/profile_pic.jpg`;
    document.getElementById('progressData').appendChild(update1);

}


function dataErrorDisplay(data) {
    let update0 = document.createElement('p')
    update0.className = 'errorStyle'

    update0.innerHTML = '🔴 ' + data.error

    document.getElementById('progressData').appendChild(update0)

    let update1 = document.createElement('p')
    update1.className = 'progressStyle'

    update1.innerHTML = '🟢 ' + 'Credits will be Refunded'

    document.getElementById('progressData').appendChild(update1)

    let errorImg = document.createElement('img')

    errorImg.src = "../static/images/noresult.png"

    errorImg.className = 'errorImg'

    document.getElementById('progressData').appendChild(errorImg)


}


export { changeTheme };



