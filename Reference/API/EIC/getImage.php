<?php

require_once __DIR__.'../../../global.php';

$item_id = $_GET['id'];

$EIC = new EIC($item_id);

$photo = $EIC->getPhoto();

if($photo != null){
    sendImageResponse($photo);
    exit();
}

// If no Image
sendResponse(
    204,
    "Not Found",
    [
        "error" => "Resource not found or Seminar has no photo",
        "value" => "None"
    ],
    "Seminar Photo defaulting"
);
