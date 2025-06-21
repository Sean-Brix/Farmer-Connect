<?php
require_once __DIR__."/../Utils/statement.php";

class Distribution{
    private $id = null;
    private $name = null;
    private $description = null;
    private $quantity = null;
    private $status = null;
    private $category = null;
    private $added_by = null;
    private $photo = null;
    private $created_at = null;
    private $updated_at = null;
    /**
     * What it Does: Constructor for the DistributionItem class.  Initializes a DistributionItem object, optionally loading data if an ID is provided.
     * Returns What: void
     */
    public function __construct($distribution_item_id = null)
    {
        $this->id = $distribution_item_id;
        if($distribution_item_id) $this->initialize();
    }
    /**
     * What it Does: Retrieves all details of the DistributionItem object.
     * Returns What: An associative array containing all the DistributionItem's details.
     */
    public function getDetails(){
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'quantity' => $this->quantity,
            'status' => $this->status,
            'category' => $this->category,
            'added_by' => $this->added_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
    /**
     * What it Does: Finds a DistributionItem ID by its name.
     * Returns What: The ID of the DistributionItem if found, otherwise null.
     */
    public static function findDistributionItemID($name){
        $query = "SELECT id FROM `distribution_items` WHERE name = ?";
        $result = statement($query, [$name], "s");
        if($row = mysqli_fetch_assoc($result)){
            return $row["id"];
        }
        return null;
    }
    /**
     * What it Does: Initializes the DistributionItem object with data from the database based on the object's ID.
     * Returns What: void
     */
    public function initialize(){
        $query = "SELECT * FROM `distribution_items` WHERE id = ?";
        $result = statement($query, [$this->id], "i");
        while($row = mysqli_fetch_assoc($result)){
            $this->name = $row["name"];
            $this->description = $row["description"];
            $this->quantity = $row["quantity"];
            $this->status = $row["status"];
            $this->category = $row["category"];
            $this->added_by = $row["added_by"];
            $this->photo = $row["photo"];
            $this->created_at = $row["created_at"];
            $this->updated_at = $row["updated_at"];
        }
    }

    public static function getTotalWaitingCount(){
        $query = "SELECT COUNT(*) as total FROM `distribution_request` WHERE status='Waiting'";
        $result = statement($query, [], "");
        $row = mysqli_fetch_assoc($result);
        return $row['total'];
    }

    /**
     * What it Does: Creates a new DistributionItem record in the database.
     * Returns What: The result of the statement execution.
     */
    public function create($params){
        $query = "INSERT INTO `distribution_items` (
            `name`, `description`, `quantity`,
            `status`, `category`, `added_by`
        )
        VALUES (?,?,?,?,?,?)";
        $param_array = [
            $params['name'],
            $params['description'],
            $params['quantity'],
            $params['status'],
            $params['category'],
            $params['added_by']
        ];
        $types = getTypes($param_array);
        $result = statement($query, $param_array, $types);
        if ($result) {
            return mysqli_insert_id($GLOBALS['conn']);
        } else {
            return false;
        }
    }
    /**
     * What it Does: Sets the photo for the DistributionItem object in the database.
     * Returns What: True if the photo was successfully set, false otherwise.
     */
    public function setPhoto($image) {
        if (!$this->id) {
            return false;
        }
        if (isset($image['tmp_name']) && is_uploaded_file($image['tmp_name'])) {
            $imageData = file_get_contents($image['tmp_name']);
            $query = "UPDATE distribution_items SET photo = ? WHERE id = ?";
            $params = [$imageData, $this->id];
            $types = "bi";
            $result = statement($query, $params, $types);
            if ($result) {
                $this->photo = $imageData;
                return true;
            }
        }
        return false;
    }
    public function getPhoto(){
        return $this->photo;
    }
    /**
     * What it Does: Sets the details of the DistributionItem object.
     * Returns What: void
     */
    public function setDetails($params) {
        $this->name = $params['name'] ?? $this->name;
        $this->description = $params['description'] ?? $this->description;
        $this->quantity = $params['quantity'] ?? $this->quantity;
        $this->status = $params['status'] ?? $this->status;
        $this->category = $params['category'] ?? $this->category;
    }
    /**
     * What it Does: Saves the updated details of the DistributionItem object to the database.
     * Returns What: True if the save operation was successful, false otherwise.
     */
    public function save(){
        $query = "UPDATE `distribution_items` SET
            name = ?, description = ?, quantity = ?,
            status = ?, category = ?
            WHERE id = ?";
        $params = [
            $this->name, $this->description, $this->quantity,
            $this->status, $this->category,
            $this->id
        ];
        $types = getTypes($params);
        $result = statement($query, $params, $types);
        return $result !== false;
    }
    /**
     * What it Does: Returns a string representation of the DistributionItem object.
     * Returns What: A string representation of the DistributionItem object, including its name.
     */
    public function __toString(){
        return "DistributionItem: {$this->name}";
    }
    /**
     * What it Does: Reads all DistributionItem items from the database.
     * Returns What: An array of associative arrays, where each array represents a DistributionItem item.
     */
    public static function readAll()
    {
        $query = "SELECT * FROM distribution_items";
        $result = statement($query);
        $distribution_item_items = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $distribution_item_items[] = $row;
        }
        return $distribution_item_items;
    }
    /**
     * What it Does: Deletes a DistributionItem item from the database based on its ID.
     * Returns What: The result of the statement execution.
     */
    public static function deleteStatic($id)
    {

        // First, delete any associated requests
        $query_requests = "DELETE FROM distribution_request WHERE distribution_item_id = ?";
        $params_requests = [$id];
        $types_requests = "i";
        statement($query_requests, $params_requests, $types_requests);

        // Then, delete the distribution item
        $query = "DELETE FROM distribution_items WHERE id = ?";
        $params = [$id];
        $types = "i";
        $result = statement($query, $params, $types);
        return $result;
    }
    /**
     * What it Does: Searches and filters DistributionItem items based on a search term and filters.
     * Returns What: An array of associative arrays representing the matching DistributionItem items.
     */
    public static function searchAndFilter($searchTerm = '', $filters = [], $include_zeroQuantity = false)
    {
        $whereClauses = [];
        $params = [];
        $types = '';
        $query = "SELECT id, name, description, quantity, status, category, added_by, created_at, updated_at FROM distribution_items";
        if (!$include_zeroQuantity) {
            $whereClauses[] = "quantity != 0";
        }
        if (!empty($searchTerm)) {
            $whereClauses[] = "(name LIKE ? OR description LIKE ?)";
            $params[] = "%" . $searchTerm . "%";
            $params[] = "%" . $searchTerm . "%";
            $types .= 'ss';
        }
        foreach ($filters as $field => $value) {
            if (!empty($value) && in_array($field, ['status', 'category', 'quantity'])) { //Whitelist
                if($field == 'quantity'){
                    $whereClauses[] = "quantity = ?";
                    $params[] = $value;
                    $types .= 'i';
                }
                else{
                    $whereClauses[] = "$field = ?";
                    $params[] = $value;
                    $types .= 's';
                }
            }
        }
        if (!empty($whereClauses)) {
            $query .= " WHERE " . implode(" AND ", $whereClauses);
        }
        $query .= " ORDER BY created_at DESC";
        if (!empty($params)) {
            $result = statement($query, $params, $types);
        }else{
            $result = statement($query);
        }
        $distribution_item_items = array();
        while ($row = mysqli_fetch_assoc($result)) {
                    // Update status based on quantity
                    if ($row['quantity'] == 0 && $row['status'] != 'Out of Stock') {
                        self::updateStatus($row['id'], 'Out of Stock');
                        $row['status'] = 'Out of Stock'; // Reflect the change in the current result set
                    } elseif ($row['quantity'] != 0 && $row['status'] == 'Out of Stock') {
                        self::updateStatus($row['id'], 'Available');
                        $row['status'] = 'Available'; // Reflect the change in the current result set
        }
                    $distribution_item_items[] = $row;
    }
                return $distribution_item_items;
            }

            private static function updateStatus($id, $status) {
                $query = "UPDATE distribution_items SET status = ? WHERE id = ?";
                $params = [$status, $id];
                $types = "si";
                statement($query, $params, $types);
            }
    /**
     * What it Does: Creates a new DistributionItem request in the database.
     * Returns What: The ID of the newly inserted request, or false on failure.
     */
    public static function requestDistributionItem($account_id, $distribution_item_id, $quantity, $request_note = null, $schedule_date = null) {
        $query = "INSERT INTO distribution_request (account_id, distribution_item_id, quantity, request_note, schedule_date) VALUES (?, ?, ?, ?, ?)";
        $params = [$account_id, $distribution_item_id, $quantity, $request_note, $schedule_date];
        // Determine types
        $types = 'iiiss'; // Assuming account_id, distribution_item_id, quantity are integers and the rest are strings/nullable
        // Adjust types string if null values are not strings
        if ($request_note === null) {
            $types[3] = 's';
        }
        if ($schedule_date === null) {
            $types[4] = 's';
        }
        $result = statement($query, $params, $types);
        if ($result) {
            return mysqli_insert_id($GLOBALS['conn']);
        } else {
            return false;
        }
    }
    /**
     * What it Does: Retrieves all DistributionItem requests for a specific user ID from the database.
     * Returns What: An array of associative arrays, where each array represents a DistributionItem request.
     */
    public static function getMyRequest($user_id) {
        $query = "SELECT * FROM distribution_request WHERE account_id = ?";
        $params = [$user_id];
        $types = "i";
        $result = statement($query, $params, $types);
        $requests = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $requests[] = $row;
        }
        return $requests;
    }
    /**
     * What it Does: Retrieves all DistributionItem requests for a specific DistributionItem ID from the database.
     * Returns What: An array of associative arrays, where each array represents a DistributionItem request.
     */
    public static function getDistributionItemRequest($distribution_item_id) {
        $query = "SELECT * FROM distribution_request WHERE distribution_item_id = ?";
        $params = [$distribution_item_id];
        $types = "i";
        $result = statement($query, $params, $types);
        $requests = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $requests[] = $row;
        }
        return $requests;
    }
    /**
     * What it Does: Retrieves all DistributionItem requests from the database.
     * Returns What: An array of associative arrays, where each array represents a DistributionItem request.
     */
    public static function getAllRequests() {
        $query = "SELECT * FROM distribution_request ORDER BY FIELD(status, 'Waiting', 'Processing', 'Rejected', 'Claimed'), created_at DESC";
        $result = statement($query);
        $requests = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $requests[] = $row;
        }
        return $requests;
    }


    /**
     * What it Does: Cancels a DistributionItem request in the database.
     * Returns What: The result of the statement execution.
     */
    public static function cancelRequest($request_id) {
        $query = "DELETE FROM distribution_request WHERE id = ?";
        $params = [$request_id];
        $types = "i";
        $result = statement($query, $params, $types);
        return $result;
    }


    /**

     * Returns What: The result of the statement execution.
     */
    public static function approveRequest($request_id, $admin_id, $status) {
        $allowedStatuses = ['Approved', 'Rejected', 'Processing', 'Waiting', 'Claimed'];
        if (!in_array($status, $allowedStatuses)) {
            return false;
        }
        $query = "UPDATE distribution_request SET status = ?, approval_date = NOW(), admin_id = ? WHERE id = ?";
        $params = [$status, $admin_id, $request_id];
        $types = "sii";
        $result = statement($query, $params, $types);
        if ($result && $status == 'Approved') {
            // Subtract the requested quantity from the DistributionItem quantity
            $requestDetails = self::getRequestDetails($request_id);
            if ($requestDetails) {
                $distribution_item_id = $requestDetails['distribution_item_id'];
                $quantity = $requestDetails['quantity'];
                $updateQuery = "UPDATE distribution_items SET quantity = quantity - ? WHERE id = ?";
                $updateParams = [$quantity, $distribution_item_id];
                $updateTypes = "ii";
                $updateResult = statement($updateQuery, $updateParams, $updateTypes);
                if (!$updateResult) {
                    // Revert the request status if DistributionItem update fails
                    $revertQuery = "UPDATE distribution_request SET status = 'Waiting', approval_date = NULL, admin_id = NULL WHERE id = ?";
                    $revertParams = [$request_id];
                    $revertTypes = "i";
                    statement($revertQuery, $revertParams, $revertTypes);
                    return false;
                }
            }
        } else if ($result && $status == 'Rejected') {
            // Get the request details
            $requestDetails = self::getRequestDetails($request_id);
            if ($requestDetails) {
                // Only add to quantity if the status was not already "Waiting"
                $requestStatus = self::getRequestStatus($request_id);
                if ($requestStatus != 'Waiting') {
                    $distribution_item_id = $requestDetails['distribution_item_id'];
                    $quantity = $requestDetails['quantity'];
                    // Add the rejected quantity back to the DistributionItem quantity
                    $updateQuery = "UPDATE distribution_items SET quantity = quantity + ? WHERE id = ?";
                    $updateParams = [$quantity, $distribution_item_id];
                    $updateTypes = "ii";
                    $updateResult = statement($updateQuery, $updateParams, $updateTypes);
                    if (!$updateResult) {
                        // Revert the request status if DistributionItem update fails
                        $revertQuery = "UPDATE distribution_request SET status = 'Waiting', approval_date = NULL, admin_id = NULL WHERE id = ?";
                        $revertParams = [$request_id];
                        $revertTypes = "i";
                        statement($revertQuery, $revertParams, $revertTypes);
                        return false;
                    }
                }
            }
        }
        return $result;
    }

    private static function getRequestDetails($request_id) {
        $query = "SELECT distribution_item_id, quantity FROM distribution_request WHERE id = ?";
        $params = [$request_id];
        $types = "i";
        $result = statement($query, $params, $types);
        if ($row = mysqli_fetch_assoc($result)) {
            return $row;
        }
        return null;
    }
    private static function getRequestStatus($request_id) {
        $query = "SELECT status FROM distribution_request WHERE id = ?";
        $params = [$request_id];
        $types = "i";
        $result = statement($query, $params, $types);
        if ($row = mysqli_fetch_assoc($result)) {
            return $row['status'];
        }
        return null;
    }
}