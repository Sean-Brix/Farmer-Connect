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

if(strtolower($details['access']) === "user"){
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"Regular User dont have access to other accounts"],
        "Unauthorize Post Request"
    );
    exit();
}

// Query Parameter
$user_id = $_GET['id'];

$getAccount = new Account($user_id);

$acc_details = $getAccount->getDetails();

if($acc_details['firstname'] == null){
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
    ["details"=>$acc_details],
    'Success fully retrieve account details of '. $acc_details['username']
);