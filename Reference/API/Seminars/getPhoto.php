<?php

require_once __DIR__.'/../../global.php';

// Query Parameter
$sem_id = $_GET['id'];

$Seminar = new Seminars($sem_id);

$details = $Seminar->getDetails();

if($details['photo'] != null){
    sendImageResponse($details['photo']);
    exit();
}

sendResponse(
    204,
    "Not Found",
    [
        "error" => "Resource not found or Seminar has no photo",
        "value" => "None"
    ],
    "Seminar Photo defaulting"
);
