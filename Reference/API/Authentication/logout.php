<?php

require_once __DIR__."/../../Utils/session.php";

resetSession();

sendResponse(
    200,
    "success",
    [],
    "Logging Out"
);