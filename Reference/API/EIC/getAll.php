<?php

require_once __DIR__.'../../../global.php';

try {
    $status = $_GET['status'] ?? null;
    $category = $_GET['category'] ?? [];
    $search = $_GET['search'] ?? '';

    $EIC = new EIC(null);

    $item_list = $EIC->searchAndFilter($search, ['status'=>$status, 'category'=>$category], true);

    foreach ($item_list as &$item) {
            if (isset($item['added_by'])) {
                try {
            $admin = new Account($item['added_by']);
            $admin_details = $admin->getDetails();
                    $item['added_by'] = $admin_details['firstname'].' '.$admin_details['lastname'];
                } catch (Exception $e) {
                    error_log('Error retrieving admin details: ' . $e->getMessage());
                    $item['added_by'] = 'Unknown';
        }
    }
        }

    sendResponse(
        200,
        'success',
        $item_list,
        'Successfully retrieved all items on stocks'
    );

} 
catch (Exception $e) {
    error_log('Error in script: ' . $e->getMessage());
    sendResponse(
        500,
        'error',
        [],
        'Failed to retrieve items on stocks: ' . $e->getMessage()
    );
}
