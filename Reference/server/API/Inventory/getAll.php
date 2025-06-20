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

$Inventory = new Inventory();
$items = $Inventory->getAll();

sendResponse(
    200,
    "Inventory List",
    ["list"=>$items],
    "inventory fetched"
);

