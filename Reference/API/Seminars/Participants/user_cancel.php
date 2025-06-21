<?php

require_once __DIR__.'/../../../global.php';

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

if(!$details['access'] === "User"){  
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"Only User can apply"],
        "Admin cannot apply for seminar"
    );
    exit();
}

$req = getJsonBody();
$seminar_id = $req['id'];

$Seminar = new Seminars($seminar_id);

$result = $Seminar->cancelParticipant($user['ID']);


if($result){
sendResponse(
    200,
    "Success",
    [],
    "Successfully Cancelled in seminar"
);

} 
else {
    sendResponse(
        409,
        "Error",
        ["error"=>"Failed to enroll in seminar"],
        "Failed to cancel the seminar"
    );
}
