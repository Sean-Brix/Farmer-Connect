<?php

require_once __DIR__."/../../global.php";

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
        ["Error"=>"Regular User cannot update a seminar program"],
        "Unauthorize Post Request"
    );
    exit();
}

$req = getJsonBody();

// Update Seminar
$Seminar = new Seminars($req['id']);
$details = $Seminar->getDetails();

if(!$details['id']){
    sendResponse(
        404,
        "Not Found",
        ["Error"=>"Seminar Not Found"],
        "Invalid Seminar ID"
    );
    exit();
}

$Seminar->setDetails($req);
$update = $Seminar->save();

if($update){
    sendResponse(
        200,
        "OK",
        ["Message"=>"Seminar updated successfully"],
        "Seminar Updated"
    );
} 
else {
    sendResponse(
        500,
        "Internal Server Error",
        ["Error"=>"Failed to update seminar"],
        "Update Failed"
    );
}