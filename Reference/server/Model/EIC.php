<?php

require_once __DIR__."/../Utils/statement.php";
class EIC{

    private $id = null;
    private $Name = null;
    private $description = null;
    private $quantity = null;
    private $status = null;
    private $category = null;
    private $added_by = null;
    private $photo = null;
    private $created_at = null;
    private $updated_at = null;

    /**
     * What it Does: Constructor for the EIC class.  Initializes an EIC object, optionally loading data if an ID is provided.
     * Returns What: void
     */
    public function __construct($eic_id = null)
    {
        $this->id = $eic_id;
        if($eic_id) $this->initialize();
    }

    /**
     * What it Does: Retrieves all details of the EIC object.
     * Returns What: An associative array containing all the EIC's details.
     */
    public function getDetails(){
        return [
            'id' => $this->id,
            'Name' => $this->Name,
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
     * What it Does: Finds an EIC ID by its name.
     * Returns What: The ID of the EIC if found, otherwise null.
     */
    public static function findEICID($Name){
        $query = "SELECT id FROM `EIC` WHERE Name = ?";
        $result = statement($query, [$Name], "s");
        if($row = mysqli_fetch_assoc($result)){
            return $row["id"];
        }
        return null;
    }


    /**
     * What it Does: Initializes the EIC object with data from the database based on the object's ID.
     * Returns What: void
     */
    public function initialize(){
        $query = "SELECT * FROM `EIC` WHERE id = ?";
        $result = statement($query, [$this->id], "i");
        while($row = mysqli_fetch_assoc($result)){
            $this->Name = $row["Name"];
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

    /**
     * What it Does: Creates a new EIC record in the database.
     * Returns What: The result of the statement execution.
     */
    public function create($params){
        $query = "INSERT INTO `EIC` (
            `Name`, `description`, `quantity`,
            `status`, `category`, `added_by`
            )
            VALUES (?,?,?,?,?,?)";
        $param_array = [
            $params['Name'],
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
     * What it Does: Sets the photo for the EIC object in the database.
     * Returns What: True if the photo was successfully set, false otherwise.
     */
    public function setPhoto($image) {
        if (!$this->id) {
            return false;
        }
        if (isset($image['tmp_name']) && is_uploaded_file($image['tmp_name'])) {
            $imageData = file_get_contents($image['tmp_name']);
            $query = "UPDATE EIC SET photo = ? WHERE id = ?";
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
     * What it Does: Sets the details of the EIC object.
     * Returns What: void
     */
    public function setDetails($params) {
        $this->Name = $params['Name'] ?? $this->Name;
        $this->description = $params['description'] ?? $this->description;
        $this->quantity = $params['quantity'] ?? $this->quantity;
        $this->status = $params['status'] ?? $this->status;
        $this->category = $params['category'] ?? $this->category;
    }

    /**
     * What it Does: Saves the updated details of the EIC object to the database.
     * Returns What: True if the save operation was successful, false otherwise.
     */
    public function save(){
        $query = "UPDATE `EIC` SET
            Name = ?, description = ?, quantity = ?,
            status = ?, category = ?
            WHERE id = ?";
        $params = [
            $this->Name, $this->description, $this->quantity,
            $this->status, $this->category,
            $this->id
        ];
        $types = getTypes($params);
        $result = statement($query, $params, $types);
        return $result !== false;
    }

    public static function getTotalUserCount(){
        $query = "SELECT COUNT(*) as total FROM `eic`";
        $result = statement($query, [], "");
        $row = mysqli_fetch_assoc($result);
        return $row['total'];
    }

    /**
     * What it Does: Returns a string representation of the EIC object.
     * Returns What: A string representation of the EIC object, including its name.
     */
    public function __toString(){
        return "EIC: {$this->Name}";
    }

    /**
     * What it Does: Reads all EIC items from the database.
     * Returns What: An array of associative arrays, where each array represents an EIC item.
     */
    public static function readAll()
    {
        $query = "SELECT * FROM EIC";
            $result = statement($query);
        $eic_items = array();

        while ($row = mysqli_fetch_assoc($result)) {
                $eic_items[] = $row;
            }
        return $eic_items;
    }

    /**
     * What it Does: Deletes an EIC item from the database based on its ID.
     * Returns What: The result of the statement execution.
     */
    /**
     * What it Does: Deletes an EIC item from the database based on its ID.
     * Returns What: The result of the statement execution.
     */
    public static function deleteStatic($id)
    {
        // First, delete any related records in the eic_request table
        $query_request = "DELETE FROM eic_request WHERE eic_id = ?";
        $params_request = [$id];
        $types_request = "i";
        $result_request = statement($query_request, $params_request, $types_request);

        // Only delete from EIC table if the request deletion was successful or there were no requests
        if ($result_request !== false) {
            $query = "DELETE FROM EIC WHERE id = ?";
            $params = [$id];
            $types = "i";
            $result = statement($query, $params, $types);

        return $result;
        } else {
            return false; // Indicate failure to delete related requests
    }
    }

    /**
     * What it Does: Searches and filters EIC items based on a search term and filters.
     * Returns What: An array of associative arrays representing the matching EIC items.
     */
    public static function searchAndFilter($searchTerm = '', $filters = [], $include_zeroQuantity = false)
    {
        $whereClauses = [];
        $params = [];
        $types = '';

        $query = "SELECT id, Name, description, quantity, status, category, added_by, created_at, updated_at FROM EIC";
        if (!$include_zeroQuantity) {
            $whereClauses[] = "quantity != 0";
        }

        if (!empty($searchTerm)) {
            $whereClauses[] = "(Name LIKE ? OR description LIKE ?)";
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


        $eic_items = array();

        while ($row = mysqli_fetch_assoc($result)) {
            $eic_items[] = $row;
        }

        return $eic_items;
    }

    /**
         * What it Does: Creates a new EIC request in the database.
         * Returns What: The ID of the newly inserted request, or false on failure.
    */
    public static function requestEIC($account_id, $eic_id, $quantity, $request_note = null, $borrow_date = null, $return_date = null) {
        $query = "INSERT INTO eic_request (account_id, eic_id, quantity, request_note, borrow_date, return_date) VALUES (?, ?, ?, ?, ?, ?)";
        $params = [$account_id, $eic_id, $quantity, $request_note, $borrow_date, $return_date];

        // Determine types
        $types = 'iiisss'; // Assuming account_id, eic_id, quantity are integers and the rest are strings/nullable

            // Adjust types string if null values are not strings
        if ($request_note === null) {
            $types[3] = 's';
        }
        if ($borrow_date === null) {
            $types[4] = 's';
        }
        if ($return_date === null) {
            $types[5] = 's';
        }

        $result = statement($query, $params, $types);

        if ($result) {
            return mysqli_insert_id($GLOBALS['conn']);
        } else {
            return false;
        }
    }

   /**
     * What it Does: Retrieves all EIC requests for a specific user ID from the database.
     * Returns What: An array of associative arrays, where each array represents an EIC request.
     */
    public static function getMyRequest($user_id) {
        $query = "SELECT * FROM eic_request WHERE account_id = ?";
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
         * What it Does: Retrieves all EIC requests for a specific EIC ID from the database.
         * Returns What: An array of associative arrays, where each array represents an EIC request.
         */
    public static function getEICRequest($eic_id) {
        $query = "SELECT * FROM eic_request WHERE eic_id = ?";
        $params = [$eic_id];
        $types = "i";

        $result = statement($query, $params, $types);

        $requests = array();

        while ($row = mysqli_fetch_assoc($result)) {
            $requests[] = $row;
        }

        return $requests;
    }

        /**
         * What it Does: Retrieves all EIC requests from the database.
         * Returns What: An array of associative arrays, where each array represents an EIC request.
        */
    public static function getAllRequests() {
        $query = "SELECT * FROM eic_request ORDER BY FIELD(status, 'Waiting', 'Processing', 'Approved', 'Rejected', 'Returned'), id DESC";
        $result = statement($query);

        $requests = array();

        while ($row = mysqli_fetch_assoc($result)) {
            $requests[] = $row;
        }

        return $requests;
    }

   /**
         * What it Does: Approves an EIC request by its ID.
         * Returns What: The result of the statement execution.
         */
    public static function approveRequest($request_id, $admin_id, $status) {
        $allowedStatuses = ['Approved', 'Rejected', 'Processing', 'Waiting', 'Returned'];
        if (!in_array($status, $allowedStatuses)) {
            return false;
        }
        $query = "UPDATE eic_request SET status = ?, approval_date = NOW(), admin_id = ? WHERE id = ?";
        $params = [$status, $admin_id, $request_id];
        $types = "sii";
        $result = statement($query, $params, $types);

        if ($result && $status == 'Approved') {
            // Subtract the requested quantity from the EIC quantity
            $requestDetails = self::getRequestDetails($request_id);
            if ($requestDetails) {
                $eic_id = $requestDetails['eic_id'];
                $quantity = $requestDetails['quantity'];

                $updateQuery = "UPDATE EIC SET quantity = quantity - ? WHERE id = ?";
                $updateParams = [$quantity, $eic_id];
                $updateTypes = "ii";
                $updateResult = statement($updateQuery, $updateParams, $updateTypes);

                 if (!$updateResult) {
                     // Revert the request status if EIC update fails
                    $revertQuery = "UPDATE eic_request SET status = 'Waiting', approval_date = NULL, admin_id = NULL WHERE id = ?";
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
                 $eic_id = $requestDetails['eic_id'];
                 $quantity = $requestDetails['quantity'];

                 // Add the rejected quantity back to the EIC quantity
                 $updateQuery = "UPDATE EIC SET quantity = quantity + ? WHERE id = ?";
                 $updateParams = [$quantity, $eic_id];
                 $updateTypes = "ii";
                 $updateResult = statement($updateQuery, $updateParams, $updateTypes);

                 if (!$updateResult) {
                     // Revert the request status if EIC update fails
                     $revertQuery = "UPDATE eic_request SET status = 'Waiting', approval_date = NULL, admin_id = NULL WHERE id = ?";
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
        $query = "SELECT eic_id, quantity FROM eic_request WHERE id = ?";
        $params = [$request_id];
        $types = "i";
        $result = statement($query, $params, $types);

        if ($row = mysqli_fetch_assoc($result)) {
            return $row;
        }

        return null;
    }

    private static function getRequestStatus($request_id) {
        $query = "SELECT status FROM eic_request WHERE id = ?";
        $params = [$request_id];
        $types = "i";
        $result = statement($query, $params, $types);

        if ($row = mysqli_fetch_assoc($result)) {
            return $row['status'];
        }

        return null;
    }
}
