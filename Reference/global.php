<?php

define("UTIL", __DIR__ . "/Utils/");
define("MODEL", __DIR__."/Model/");
define("ACCESS_KEY", "ACCESS_CONTROL_POINT_1828121802182804");

// UTIL
require_once UTIL."request.php";
require_once UTIL."response.php";
require_once UTIL."connect_db.php";
require_once UTIL."statement.php";
require_once UTIL."session.php";
require_once UTIL."jwt.php";

// MODEL
require_once MODEL."Account.php";
require_once MODEL."Seminars.php";
require_once MODEL."EIC.php";
require_once MODEL."Inventory.php";
require_once MODEL."Distribution.php";