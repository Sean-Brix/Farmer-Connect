<?php

require_once __DIR__.'../../../global.php';

// Authentication
$token = $_SESSION['token'];
$user = verify_token($token, ACCESS_KEY);

if(!$user){  
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"Token failed to verify"],
        "invalid token"
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
        ["Error"=>"Regular User cannot add Image to an Item"],
        "Unauthorize Post Request"
    );
    exit();
}

$EIC = new EIC($_POST['id']);
$upload = $EIC->setPhoto($_FILES['image']);

if(!$upload){
    sendResponse(
        409,
        "Failed",
        ["error"=>"Failed to upload the image"],
        "Cannot upload the file to the database"
    );
}

sendImageResponse($EIC->getPhoto());