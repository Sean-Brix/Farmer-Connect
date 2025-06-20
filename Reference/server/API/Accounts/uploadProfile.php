<?php

require_once __DIR__.'/../../global.php';

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

$Account = new Account($user['ID']);

$upload = $Account->setProfilePicture($_FILES['image']);


if(!$upload){
    sendResponse(
        409,
        "Failed",
        ["error"=>"Failed to upload the image"],
        "Cannot upload the file to the database"
    );
}

sendImageResponse($Account->getProfile());