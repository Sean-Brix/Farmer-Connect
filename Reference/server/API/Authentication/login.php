<?php

require_once __DIR__."/../../global.php";
require_once __DIR__."/../../Controller/Account/userExist.php";

$req = getJsonBody();

$username = $req["username"];
$password = $req["password"];

if(!usernameExist($username)){
    sendResponse(
        400, 
        "Failed",
        ["Error"=>"Username does not exist"],
        "User Account Doesn't Exist"
    );
    exit();
}

// Get account
$Account = new Account(usernameExist($username, true));
$details = $Account->getDetails(false);

// Check Password
if(!password_verify($password, $details["password"])){

    // Unauthorized Response
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"User input for password is incorrect"],
        "Incorrect Password"
    );
    
    exit();
}

// Sign a JWT token
$payload = [
    "ID" => $details["id"],
    "username" => $details["username"]
];
$token = create_token($payload, ACCESS_KEY);

// Send Cookie Token
$_SESSION["token"] = $token;


// Successfull Response
sendResponse(
    200,
    "Successful",
    ["access" => $details["access"]],
    "Authentication Successful"
);