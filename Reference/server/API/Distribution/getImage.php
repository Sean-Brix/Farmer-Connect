<?php

require_once __DIR__.'../../../global.php';

$item_id = $_GET['id'];

$Distribution = new Distribution($item_id);
$photo = $Distribution->getPhoto();

if($photo != null){
    sendImageResponse($photo);
    exit();
}

// If no Image
sendResponse(
    204,
    "Not Found",
    [
        "error" => "Resource not found or Distribution has no photo",
        "value" => "None"
    ],
    "Distribution Photo defaulting"
);
