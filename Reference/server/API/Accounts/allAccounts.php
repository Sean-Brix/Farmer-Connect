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
        ["Error"=>"Regular User dont have access to all accounts"],
        "Unauthorize Post Request"
    );
    exit();
}

$Accounts = new Account(null);


// Query Params
$access = $_GET['access']??null;
if($access === "none"){
    $access = null;
}
$client = $_GET['client']??null;
if($client === "none"){
    $client = null;
}

$order = $_GET['order']??null;
if($order === "none"){
    $order = "created_at";
}

$search = $_GET['search']??null;
if($search === "none"){
    $search = null;
}

$list = $Accounts->getAllAccounts($access, $client, $order, $search);

if($list["Error"]){
    sendResponse(
        500,
        "Server Error",
        ["error" => $list["Error"]],
        "Something went wrong"
    );
    exit();
}

sendResponse(
    200,
    "Success",
    $list,
    "Successfully retreived all account"
);
