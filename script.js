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
        help_request.style.display = "none"
        location_form.style.display = "none"
        address_form.style.display = "block"
        profile_div.style.display = "none"
        edit_btn.style.display = "none"
        edit_form.style.display = "none"

    } else {


        loginForm.style.display = "none"
        signupForm.style.display = "none"
        speed_alert.style.display = "none"
        wrong_pwd.style.display = "none"
        no_user.style.display = "none"
        logout.style.display = "block"
        help_request.style.display = "block"
        location_form.style.display = "block"
        address_form.style.display = "block"
        profile_div.style.display = "block"
        edit_btn.style.display = "block"
        edit_form.style.display = "none"

    }
}
// login
let loginForm = document.querySelector("#login-form");
let speed_alert = document.querySelector("#speedwarning");
let wrong_pwd = document.querySelector("#wrong_pwd");
let no_user = document.querySelector("#no_user");
let short_pwd = document.querySelector("#short_pass");
let address_form = document.querySelector("#adress");
let location_form = document.querySelector("#location");
let profile_div = document.querySelector("#profile");
let edit_btn = document.querySelector("#editbtn");
let edit_form = document.querySelector("#editprofile");

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
            console.log("incorrrect paswrod")
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
    const emerphones = (signupForm["signup-emerphone"].value).split(" ");
    const medical = signupForm["signup-medical"].value;
    const realname = signupForm["signup-realname"].value;

    //console.log("jd");
    console.log(username);
    console.log(emerphones, medical)
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
            emerphone: emerphones,
            medical: medical,
            realname: realname

        }).catch((err) => {
            console.log("Could not add to db")
        })

        //start at one bc we already added a 
        for (let i = 0; i < emerphones.length; i++) {
            let emerphones = emerphones[i]
        }





        signupForm.reset();
    }).catch((err) => {
        console.log("Could not sign up")

        console.log(err)
        console.log("|" + err.message + "|")

        if (err.message == "Password should be at least 6 characters") {
            console.log("Password is too short")
            short_pwd.style.display = "block"
        }
    });
});
let current_user_name = ""
// logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        //making verif not seen
        document.getElementById("login-status").innerHTML = "Not lgged in";

        //temoving user add
        toggle_forms(true)
        //console.log("user signed out");
    });
});

// logout
let realname = ""
const help_request = document.querySelector("#help_request");
help_request.addEventListener("click", async function (e) {



    //ask for help
    console.log("emerphones", emerphones)
    let time = String(new Date())
    console.log(time)
    console.log("Help requested")
    firebase.database().ref().child("help").child(global_user.uid).set({
        status: true,
        user_name: current_user_name,
        emerphone: emerphones,
        medical: medical,
        realname: realname,
        time: time,
        lat: "hold",
        long: "hold"

    }).catch((err) => {
        console.log("Could not sign up")
    });

    //get the location
    getLocation()




});


let global_user = null;
// listen for auth status changes
auth.onAuthStateChanged(function (user) {
    if (user) {
        //adding user read


        global_user = firebase.auth().currentUser;

        //if signed in then remove option to sign in with google again.SO you would have to sign out.

        console.log("user logged in: ");
        document.getElementById("login-status").innerHTML = "Logged in"
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
            //get emerphones

            emerphones = data[user.uid]["emerphone"]
            //display all phone numbers
            let emerphone_list = document.getElementById("emercontacts")
            emerphone_list.innerHTML = ""
            for (let i = 0; i < emerphones.length; i++) {
                let phone = emerphones[i]

                //display the phone
                emerphone_list.innerHTML += "<li>" + phone + "</li>"

            }

            //display all contacts on user info change
            medical = data[user.uid]["medical"]
            current_user_name = data[user.uid]["user_name"]
            realname = data[user.uid]["realname"]
            console.log("SUPPOSED REAL NAME" + realname)
        });



        //make login and signupnforms not seen
    } else {
        //making verif not seen
        global_user = null
        document.getElementById("login-status").innerHTML = "Logged out"
        console.log("user logged out");
        toggle_forms(true)
    }
});

async function send_all(phones, all_adress_local) {
    console.log(all_adress_local)
    for (let i = 0; i < phones.length; i++) {
        send_sms(phones[i], all_adress_local)
    }

}

async function getLocation() {


    console.log(navigator.geolocation)


    navigator.geolocation.getCurrentPosition(test);
    //document.getElementById("location").innerHTML = "help"




}
let adress_local = ""
async function test(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    //console.log(position.coords.latitude, position.coords.longitude);
    document.getElementById("location").innerHTML = String(lat) + " " + String(long) + " are your lattitude and longtitude";

    firebase.database().ref().child("help").child(global_user.uid).child("long").set(long).catch((err) => {
        console.log("Could not upload longitude")
    })
    firebase.database().ref().child("help").child(global_user.uid).child("lat").set(lat).catch((err) => {
        console.log("Could not upload longtitude")
    })

    //fetch the adress
    let response = await fetch("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=fa975c3de924416aa05d3e590a3caa19");
    let json = await response.json()

    let new_address_local = json.results[0].formatted
    console.log(new_address_local)
    send_all(emerphones, new_address_local)

    document.getElementById("adress").innerHTML = new_address_local

    firebase.database().ref().child("help").child(global_user.uid).child("adress").set(new_address_local).catch((err) => {
        console.log("Could not upload adress")
    })


}

async function send_sms(num, sms_adress_local) {
    console.log("sending sms")

    console.log(num)

    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log("Sucessfully sent an sms");

        }
    });

    let text_to_send = realname + " needs your help! Please contact them. Last known location was " + sms_adress_local

    xhr.open("POST", "https://twilio-sms.p.rapidapi.com/2010-04-01/Accounts/a/Messages.json?from=18472784462&body=" + text_to_send + "&to=" + num);
    xhr.setRequestHeader("x-rapidapi-host", "twilio-sms.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "1b90a059e9msh255f25dd47d985ap16edbbjsnfc0254cf139c");
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

    xhr.send(data);



    await sleep(10000)


}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function toggle_edit_page() {
    if (edit_form.style.display == "none") {
        change_edit_form_view(true)
    } else {
        change_edit_form_view(false)
    }

}

function change_edit_form_view(show) {
    if (show) {
        console.log("logged in")
        edit_form.style.display = "block"
    } else {
        console.log("logged out")
        edit_form.style.display = "none"
    }

}