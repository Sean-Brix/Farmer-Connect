<?php

// UTILS
require_once __DIR__ . '/../../global.php';

// Request Body
$req = getJsonBody();

$data1 = $req['data1'];
$data2 = $req['data2'];

// Error Handling
if($data1 == "" || $data2 == ""){
    sendResponse(
        400, 
        "Failed", 
        [], 
        "Bad Request: All Data is Required"
    );
    exit();
}

// Response
sendResponse(
    200, 
    "Success", 
    [$data1, $data2], 
    "Successfully recieved the data"
);