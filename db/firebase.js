<!DOCTYPE html>
<html lang="en">
<head>
	<title>Club Central Login</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="google-signin-scope" content="profile email">
    <meta name="google-signin-client_id" content="662570449043-5jps7mcj5run46vchad5967547stv5ul.apps.googleusercontent.com">
    <script src="https://apis.google.com/js/platform.js" async defer></script>
<!--===============================================================================================-->
	<link rel="icon" type="image/png" href="images/icons/favicon.ico"/>
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="fonts/font-awesome-4.7.0/css/font-awesome.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="fonts/Linearicons-Free-v1.0.0/icon-font.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/animate/animate.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/css-hamburgers/hamburgers.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/animsition/css/animsition.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/select2/select2.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/daterangepicker/daterangepicker.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="css/util.css">
	<link rel="stylesheet" type="text/css" href="css/main.css">
<!--===============================================================================================-->
</head>
<body>

	<div class="limiter">
		<div class="container-login100" style="background-image: url('images/bg-01.jpg');">
			<div class="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
				<span class="login100-form-title p-b-53">
						Club Central Sign In
				</span>
				<span class="txt1 p-b-53">
						Hi! Welcome to Club Central! You must have a Google account to sign in. If you do not have a Google account, please create one and return to this page to sign in.
				</span>
				<div class="g-signin2" data-width = "calc((100% - 20px) / 2)" data-height="70" data-onsuccess="onSignIn" data-theme="dark"></div>
				<script>
					function onSignIn(googleUser) {
					// Useful data for your client-side scripts:
					var profile = googleUser.getBasicProfile();
					console.log("ID: " + profile.getId()); // Don't send this directly to your server!

					var email = profile.getEmail();
					var id_token = googleUser.getAuthResponse().id_token;

					var xhr = new XMLHttpRequest();
					xhr.open('GET', 'https://www.googleapis.com/oauth2/v3/tokeninfo?idtoken=' + id_token)
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.onload = function() {
						console.log('Signed in as: ' + xhr.responseText);
					};
					// xhr.send('idtoken=' + id_token);
						};
				</script>
			</div>
		</div>
	</div>


	<div id="dropDownSelect1"></div>

<!-- <script src="https://www.gstatic.com/firebasejs/4.10.1/firebase.js"></script> -->
<!-- <script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBeZyYpoe0d9CDaHALOu-aLsACKk2xVApk",
    authDomain: "club-central.firebaseapp.com",
    databaseURL: "https://club-central.firebaseio.com",
    projectId: "club-central",
    storageBucket: "",
    messagingSenderId: "662570449043"
  };
  firebase.initializeApp(config);
</script> -->
<!--===============================================================================================-->
	<script src="vendor/jquery/jquery-3.2.1.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/animsition/js/animsition.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/bootstrap/js/popper.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/select2/select2.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/daterangepicker/moment.min.js"></script>
	<script src="vendor/daterangepicker/daterangepicker.js"></script>
<!--===============================================================================================-->
	<script src="vendor/countdowntime/countdowntime.js"></script>
<!--===============================================================================================-->
	<script src="js/main.js"></script>

</body>
</html>