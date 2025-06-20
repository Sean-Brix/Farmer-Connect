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
$acc_details = $Account->getDetails();

$EIC = new EIC(null);
$my_request = $EIC->getMyRequest($user['ID']);

$data = [];
if($my_request) {
foreach($my_request as $request){
    $eic_object = new EIC($request['eic_id']);
    $eic_item = $eic_object->getDetails();

    if($eic_item) {
        $data[] = [
            "id"=>$request['id'],
            "item_name"=>$eic_item['Name'],
            "borrow_date"=>$request['borrow_date'],
            "return_date"=>$request['return_date'],
            "status"=>$request['status'],
            "quantity"=>$request['quantity'],
            "request_note"=>$request['request_note']
        ];
    } 

    else {
        $data[] = [
            "id"=>$request['id'],
            "item_name"=>"Item Not Found",
            "borrow_date"=>$request['borrow_date'],
            "return_date"=>$request['return_date'],
            "status"=>$request['status'],
            "quantity"=>$request['quantity'],
            "request_note"=>$request['request_note']
        ];
    }

}}

sendResponse(
    200,
    "My Request",
    $data,
    "my_request"
);
