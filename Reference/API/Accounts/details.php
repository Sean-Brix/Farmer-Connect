<?php

require_once __DIR__."/../../global.php";

// Cookie Token
$token = $_SESSION["token"];

// Authenticate
$user = verify_token($token, ACCESS_KEY);

// No Account Response
if(!$user){  
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"Token failed to verify"],
        "User Does not have an account yet"
    );
    exit();
}

$Account = new Account($user["ID"]);

//var_dump($Account->getDetails());
// echo $Account->getDetails();

$details = $Account->getDetails();

sendResponse(
    200,
    "success",
    $details,
    "Account Details Retrieved - ". $user["username"]
);
