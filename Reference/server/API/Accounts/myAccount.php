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
        "invalid token"
    );
    exit();
}

// Authorization
$Account = new Account($user['ID']);
$details = $Account->getDetails();

if($details['firstname'] == null){
    sendResponse(
        409,
        'resource not found',
        ['Error'=>"Cannot retrieve account, Account does not exist"],
        'Account does not exist'
    );
    exit();
}

sendResponse(
    200,
    'success',
    ["details"=>$details],
    'Success fully retrieve account details of '. $details['username']
);