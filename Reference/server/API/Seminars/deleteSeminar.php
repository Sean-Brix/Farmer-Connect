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
        ["Error"=>"Regular User cannot delete seminar program"],
        "Unauthorize Get Request"
    );
    exit();
}

$delete_id = $_GET['delete'];

// Delete related records in seminar_participants table first
$result_participants = statement("DELETE FROM seminar_participants WHERE seminar_id = ?", [$delete_id], "i");

if($result_participants === false){
    sendResponse(
        500,
        "Server Error",
        ["Error"=>"Unable to delete seminar participants"],
        "delete participants failed"
    );
    exit();
}


$result = statement("DELETE FROM seminars WHERE id = ?", [$delete_id], "i");

if(!$result){
sendResponse(
        500,
        "Server Error",
        ["Error"=>"Unable to delete seminar program"],
        "delete failed"
);
    exit();
}

sendResponse(
    200,
    "Success",
    ["Success"=>"Seminar Program Deleted"],
    "delete success"
);
