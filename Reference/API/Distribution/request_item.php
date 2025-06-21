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

$distribution_item_id = $req['item_id'];
$quantity = $req['quantity'];
$request_note = $req['request_note'];
$schedule_date = $req['schedule_date'];

$result = Distribution::requestDistributionItem(
    $user['ID'], 
    $distribution_item_id,
    $quantity,
    $request_note,
    $schedule_date
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
