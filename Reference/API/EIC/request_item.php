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

$Account = new Account($user['ID']);
$detail = $Account->getDetails();

if($detail['access'] != "User"){  
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"Admin Accounts cannot request an EIC Borrow"],
        "Admin cant borrow an EIC item"
    );
    exit();
}

// Get JSON Body
$req = getJsonBody();

$EIC = new EIC();
$result = $EIC->requestEIC(
    $user['ID'], 
    $req['item_id'], 
    $req['quantity'], 
    $req['request_note'],
    $req['borrow_date'],
    $req['return_date']
);

if($result){
    sendResponse(
        200,
        "Success",
        ["Result"=>$result],
        "Request EIC Success"
    );
}
else{
    sendResponse(
        500,
        "Failed",
        ["Error"=>"Request EIC Failed"],
        "Request EIC Failed"
    );
}
