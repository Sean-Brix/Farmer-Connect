<?php

require_once __DIR__."/../../Model/Seminars.php";
require_once __DIR__."/../../global.php";

function searchSeminars($searchTerm = '', $filter = 'all', $status = "all") {
   global $conn;
    
    $sql = "SELECT id, title, description, speaker, location, start_date, end_date, start_time, end_time, status, capacity, registration_deadline, created_at, updated_at FROM seminars WHERE 1=1";
    if ($searchTerm != '') {
        $searchTerm = strtolower($searchTerm);
        $searchTerms = explode(" ", $searchTerm);
        $searchConditions = [];

        foreach ($searchTerms as $term) {
            $term = trim($term);
            if ($term != '') {
                if ($filter == 'all') {
                    $searchConditions[] = "(LOWER(title) LIKE '% " . $term . "%' OR LOWER(title) LIKE '" . $term . "%' OR LOWER(speaker) LIKE '% " . $term . "%' OR LOWER(speaker) LIKE '" . $term . "%' OR LOWER(location) LIKE '% " . $term . "%' OR LOWER(location) LIKE '" . $term . "%')";
                } else {
                      $searchConditions[] = "(LOWER(" . $filter . ") LIKE '% " . $term . "%' OR LOWER(" . $filter . ") LIKE '" . $term . "%')";
                }
            }
        }

        if (!empty($searchConditions)) {
            $sql .= " AND (" . implode(" AND ", $searchConditions) . ")";
        }
    }

    if ($status != "all") {
        $sql .= " AND status = '$status'";
    }

    $result = $conn->query($sql);
    $seminars = array();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $seminars[] = $row;
        }
    }

    return $seminars;
}
