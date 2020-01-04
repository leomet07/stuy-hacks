window.onload = function () {
    var firebaseheadingref = firebase
        .database()
        .ref()
        .child("users");
    firebaseheadingref.on("value", function (datasnapshot) {
        //console.log(datasnapshot.val());
        calculate_avg(datasnapshot);
    });
};

function calculate_avg(datasnapshot) {
    datasnapshot = datasnapshot.val();
    console.log(datasnapshot);

}

function write_db() {
    var today = new Date();
    //console.log("The time is ", today);

    if (percent != null) {
        //console.log(percent);
        time_as_str = String(today);
        //console.log(time_as_str);
        set = {
            score: percent,
            time: time_as_str
        };
        firebase
            .database()
            .ref()
            .child("quiz_scores")
            .push()

            .set(set);
    } else {
        //console.log(" No score to be had");
    }
}


function login() {
    console.log("Login starting")
}

function toggle_forms(visible) {



    if (visible) {
        loginForm.style.display = "block"
        signupForm.style.display = "block"
        logout.style.display = "none"
        emergencies_list.style.display = "none"


    } else {


        loginForm.style.display = "none"
        signupForm.style.display = "none"
        speed_alert.style.display = "none"
        wrong_pwd.style.display = "none"
        no_user.style.display = "none"
        emergencies_list.style.display = "block"



    }
}
// login
let loginForm = document.querySelector("#login-form");
let speed_alert = document.querySelector("#speedwarning");
let wrong_pwd = document.querySelector("#wrong_pwd");
let no_user = document.querySelector("#no_user");
let emergencies_list = document.querySelector("#emergencys");
let short_pwd = document.querySelector("#short_pass");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("login like twitter")

    // get user info
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;
    console.log(email, "|", password)

    // log the user in
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        //when successful close option for google sign in
        //if signed in with email/passowrd then remove option to sign in with google.SO you would have to sign out.
        // /google_sign_in_button.style.display = "none";

        console.log("signed in with email and password");
        global_user = firebase.auth().currentUser;

        //getusername();
        isverified = cred.user.emailVerified;
        // close the signup modal & reset form

        //const modal = document.querySelector("#modal-login");
        //if not verified
        /*
        if (cred.user.emailVerified == false) {
            //document.getElementById("verify").innerHTML =You cannot 'tweet' until account is verified.Check your email.<br>After you verify your email,you must logout and re sign in.This is all extra security and for the greater good.";
            isverified = false;
            console.log("verify pls");
            firebase.auth().currentUser.sendEmailVerification();
        }

        */
        toggle_forms(false)
        loginForm.reset();


    }).catch((err) => {
        console.log("Could not login")
        console.log(err)
        console.log("|" + err.message + "|")

        if (err.message == "The password is invalid or the user does not have a password.") {
            console.log("incorrect password")
            wrong_pwd.style.display = "block"
        } else if (err.message == "Too many unsuccessful login attempts. Please try again later.") {
            console.log("slowww down buddy")
            speed_alert.style.display = "block"
        } else if (err.message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
            console.log("slowww down buddy")
            no_user.style.display = "block"

        }
    });
});


function resolve(id) {
    firebase.database().ref().child("help").child(id).set(null).catch((err) => {
        console.log("Could not sign up")
    })
}


//signup

// signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", function (e) {
    //stop reloadings
    e.preventDefault();



    // get user info
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;
    const username = signupForm["signup-username"].value;
    const emerphone = signupForm["signup-emerphone"].value;
    const medical = signupForm["signup-medical"].value;
    const realname = signupForm["signup-realname"].value;


    //console.log("jd");
    console.log(username);
    console.log(emerphone, medical)
    console.log(email, password);

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then((cred) => {
        console.log("going to sign up")
        //ueser data = auth
        console.log(firebase.auth().currentUser);
        global_user = firebase.auth().currentUser;
        current_user_name = username;
        current_user_name = current_user_name.toLowerCase();
        allow = true;
        isverified = cred.user.emailVerified;


        //adding the user to the database
        console.log(username);


        console.log("add");
        firebase.database().ref().child("users").child(global_user.uid).set({
            user_name: current_user_name,
            emerphone: emerphone,
            medical: medical,
            realname: realname

        }).catch((err) => {
            console.log("Could not sign up")
        })




        signupForm.reset();
    }).catch((err) => {
        console.log("Could not sign up")

        console.log(err)
        console.log("|" + err.message + "|")

        if (err.message == "Password should be at least 6 characters") {
            console.log("Password is too short")
            short_pwd.style.display = "block"
        }
    })
});
let current_user_name = ""
// logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        //making verif not seen


        //temoving user add
        toggle_forms(true)
        //console.log("user signed out");
    });
});



// listen for auth status changes
auth.onAuthStateChanged((user) => {
    if (user) {
        //adding user read


        global_user = firebase.auth().currentUser;

        //if signed in then remove option to sign in with google again.SO you would have to sign out.

        console.log("user logged in: ");

        allow = true;
        console.log(global_user);
        isverified = user.emailVerified;

        toggle_forms(false)
        //retrieve form data

        let firebaseheadingref = firebase
            .database()
            .ref()
            .child("users");
        firebaseheadingref.on("value", function (datasnapshot) {
            //console.log(datasnapshot.val());
            let data = datasnapshot.val()
            //get emerphone

            emerphone = data[user.uid]["emerphone"]
            medical = data[user.uid]["medical"]
            current_user_name = data[user.uid]["user_name"]
            let realname = data[user.uid]["realname"]
            console.log("SUPPOSED REAL NAME" + realname)
            console.log(emerphone)
            console.log(current_user_name)
            document.getElementById("username").innerHTML = "Current user: " + current_user_name
        });
        console.log("ON ADMIN pAGE LOGGED IN AND COMFIRMED")


        //retreive emergency data
        let help_ref = firebase
            .database()
            .ref()
            .child("help");
        help_ref.on("value", function (datasnapshot) {
            //console.log(datasnapshot.val());
            let data = datasnapshot.val()
            //get emerphone


            //console.log(data)
            //parse data
            emergencies = Object.entries(data)
            console.log(emergencies)
            document.getElementById('emergencys').innerHTML = ""
            let amnt_emerg = 0
            for (let i = 0; i < emergencies.length; i++) {
                //print i=each emergencies
                let current_emergency = emergencies[i][1]
                if (current_emergency != "holder" && current_emergency != "placeholder") {
                    console.log(current_emergency)
                    let current_emergency_medical = current_emergency['medical']
                    let current_emergency_date = current_emergency['time']
                    let current_emergency_username = current_emergency['user_name']
                    let current_emergency_uid = emergencies[i][0]
                    let current_emergency_human_name = current_emergency['realname']
                    let current_emergency_long = current_emergency['long']
                    let current_emergency_lat = current_emergency['lat']
                    let current_emergency_adress = current_emergency['adress']



                    console.log(current_emergency_medical, current_emergency_uid, current_emergency_username, current_emergency_long)

                    //display emergencies

                    document.getElementById('emergencys').innerHTML += "<div class = 'emergency'>" + "<button onclick = 'resolve(\"" + String(current_emergency_uid) + "\")'>Stop</button>" + "<h4> Medical History: " + current_emergency_medical + "</h4> " + "<h4> ID = " + String(current_emergency_uid) + "</h4> " + "<h4>" + String(current_emergency_username) + "</h4>" + "<h4>" + String(current_emergency_human_name) + "</h4>" + "<h4>" + String(current_emergency_date) + "</h4>" + "<h4>" + String(current_emergency_lat) + "<br>" + String(current_emergency_long) + "</h4>" + "<h4>" + String(current_emergency_human_name) + "</h4>" + "<h4>" + String(current_emergency_date) + "</h4>" + "<h4>" + String(current_emergency_adress) + "</h4>" + "</div>"
                    amnt_emerg++;

                }



            }

            if (amnt_emerg == 0) {
                document.getElementById('emergencys').innerHTML = "<h3>No emergencies right now</h3>"

            }
        });



        //show username


    } else {
        //making verif not seen


        console.log("user logged out");
        toggle_forms(true)
    }
});