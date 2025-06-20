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

$my_request = Distribution::getMyRequest($user['ID']);

$data = [];
if($my_request) {
foreach($my_request as $request){
        $distribution_item = new Distribution($request['distribution_item_id']);
        $item_details = $distribution_item->getDetails();

        if($item_details) {
        $data[] = [
            "id"=>$request['id'],
                "item_name"=>$item_details['name'],
                "schedule_date"=>$request['schedule_date'],
                "status"=>$request['status'],
                "quantity"=>$request['quantity'],
                "request_note"=>$request['request_note']
        ];
    } 

    else {
        $data[] = [
            "id"=>$request['id'],
            "item_name"=>"Item Not Found",
                "schedule_date"=>$request['schedule_date'],
                "status"=>$request['status'],
                "quantity"=>$request['quantity'],
                "request_note"=>$request['request_note']
        ];
    }

    }
}
sendResponse(
    200,
    "My Request",
    $data,
    "my_request"
);
