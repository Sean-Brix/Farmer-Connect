<?php

require_once __DIR__.'/../../global.php';

// Authentication
$token = $_SESSION['token'];
$user = verify_token($token, ACCESS_KEY);

if(!$user){  
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"Token failed to verify"],
        "User Does not have an account yet"
    );
    exit();
}

// Authorization
$Account = new Account($user['ID']);
$details = $Account->getDetails();

if(strtolower($details['access']) === "user"){
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"Regular User cannot set the photo of a seminar program"],
        "Unauthorize Post Request"
    );
    exit();
}

$Seminar = new Seminars($_POST['id']);
$upload = $Seminar->setPhoto($_FILES['image']);

if(!$upload){
    sendResponse(
        409,
        "Failed",
        ["error"=>"Failed to upload the image"],
        "Cannot upload the file to the database"
    );
}

sendImageResponse($Account->getProfile());