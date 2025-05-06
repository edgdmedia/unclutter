<?php
if (!defined('ABSPATH')) exit;

/**
 * Account Model for Unclutter Finance
 * 
 * Handles all database interactions for financial accounts
 */
class Unclutter_Account_Model extends Unclutter_Base_Model
{
    protected static $fillable = [
        'profile_id',
        'name',
        'type_id',
        'balance',
        'description',
        'institution',
        'is_active',
        'created_at',
        'updated_at'
    ];
    /**
     * Get table name
     */
    protected static function get_table_name()
    {
        global $wpdb;
        return $wpdb->prefix . 'unclutter_finance_accounts';
    }

    /**
     * Insert a new account
     * 
     * @param array $data Account data
     * @return int|false The account ID on success, false on failure
     */
    public static function insert_account($data)
    {
        global $wpdb;
        $table = self::get_table_name();

        // Ensure required fields
        if (empty($data['profile_id']) || empty($data['name']) || empty($data['type_id'])) {
            return false;
        }

        // Set created_at and updated_at
        $data['created_at'] = current_time('mysql');
        $data['updated_at'] = current_time('mysql');

        // Insert account
        $result = $wpdb->insert($table, $data);

        return $result ? $wpdb->insert_id : false;
    }

    /**
     * Update an account
     * 
     * @param int $id Account ID
     * @param array $data Account data
     * @return bool True on success, false on failure
     */
    public static function update_account($profile_id, $id, $data)
    {
        global $wpdb;
        $table = self::get_table_name();

        // Set updated_at
        $data['updated_at'] = current_time('mysql');

        // Update account
        $result = $wpdb->update(
            $table,
            $data,
            ['id' => $id, 'profile_id' => $profile_id]
        );

        return $result !== false;
    }

    /**
     * Delete an account
     * 
     * @param int $id Account ID
     * @return bool True on success, false on failure
     */
    public static function delete_account($profile_id, $id)
    {
        global $wpdb;
        $table = self::get_table_name();

        // Delete account
        $result = $wpdb->delete(
            $table,
            ['id' => $id, 'profile_id' => $profile_id]
        );

        return $result !== false;
    }

    /**
     * Get an account by ID
     * 
     * @param int $id Account ID
     * @return object|null Account object or null if not found
     */
    public static function get_account($profile_id, $id)
    {
        global $wpdb;
        $table = self::get_table_name();
        $category_table = $wpdb->prefix . 'unclutter_finance_categories';

        return $wpdb->get_row($wpdb->prepare(
            "SELECT a.*, c.name as type_name, c.type as category_type 
            FROM $table a 
            LEFT JOIN $category_table c ON a.type_id = c.id 
            WHERE a.id = %d AND a.profile_id = %d",
            $id,
            $profile_id
        ));
    }

    /**
     * Get accounts by profile ID
     * 
     * @param int $profile_id Profile ID
     * @param array $args Additional arguments (type_id, is_active, etc.)
     * @return array Array of account objects
     */
    /**
     * Get accounts by profile ID with pagination
     * 
     * @param int $profile_id Profile ID
     * @param array $args Additional arguments (type_id, is_active, page, per_page, order_by, order)
     * @return array An array containing 'items' and 'pagination' details
     */
    public static function get_accounts_by_profile($profile_id, $args = [])
    {
        global $wpdb;
        $table = self::get_table_name();
        $category_table = $wpdb->prefix . 'unclutter_finance_categories';

        // --- Pagination Setup ---
        $page = isset($args['page']) ? max(1, intval($args['page'])) : 1;
        $per_page = isset($args['per_page']) ? max(1, intval($args['per_page'])) : 10; // Default 10 per page
        $offset = ($page - 1) * $per_page;

        // --- Base Query Construction (for both count and results) ---
        $base_query = "FROM $table a 
                       LEFT JOIN $category_table c ON a.type_id = c.id 
                       WHERE a.profile_id = %d";
        $params = [$profile_id];

        // Add type_id filter if provided
        if (isset($args['type_id'])) {
            $base_query .= " AND a.type_id = %d";
            $params[] = $args['type_id'];
        }

        // Add is_active filter if provided
        if (isset($args['is_active'])) {
            $base_query .= " AND a.is_active = %d";
            $params[] = $args['is_active'];
        }

        // --- Get Total Count ---
        $total_items_query = "SELECT COUNT(a.id) " . $base_query;
        $total_items = (int) $wpdb->get_var($wpdb->prepare($total_items_query, $params));
        $total_pages = ceil($total_items / $per_page);

        // --- Construct Final Query for Results ---
        $query = "SELECT a.*, c.name as type_name, c.type as category_type " . $base_query;

        // Define allowed columns and directions
        $allowed_order_by_columns = ['a.name', 'a.balance', 'c.name', 'a.created_at']; // Example columns (use actual prefixed names)
        $allowed_order_directions = ['ASC', 'DESC'];

        // Determine the ORDER BY column
        $order_by_column = 'a.name'; // Default
        if (isset($args['order_by'])) {
            $sanitized_order_by = sanitize_key($args['order_by']); // Sanitize input
            // Allow mapping from simple names to prefixed names if needed
            $column_map = [
                'name' => 'a.name',
                'balance' => 'a.balance',
                'type' => 'c.name',
                'created_at' => 'a.created_at',
                'updated_at' => 'a.updated_at'
            ];
            if (isset($column_map[$sanitized_order_by]) && in_array($column_map[$sanitized_order_by], $allowed_order_by_columns)) {
                $order_by_column = $column_map[$sanitized_order_by];
            } elseif (in_array($sanitized_order_by, $allowed_order_by_columns)) { // Allow direct prefixed column names too
                 $order_by_column = $sanitized_order_by;
            }
        }
        
        // Determine the ORDER direction
        $order_direction = 'ASC'; // Default
        if (isset($args['order']) && in_array(strtoupper($args['order']), $allowed_order_directions)) {
            $order_direction = strtoupper($args['order']);
        }

        // Add the validated ORDER BY clause
        $query .= " ORDER BY " . $order_by_column . " " . $order_direction;

        // Add LIMIT and OFFSET
        $query .= " LIMIT %d OFFSET %d";
        $params[] = $per_page;
        $params[] = $offset;

        // --- Execute Query for Items ---
        $items = $wpdb->get_results($wpdb->prepare($query, $params));

        // --- Return Structured Data ---
        return [
            'items' => $items,
            'pagination' => [
                'total' => $total_items,
                'pages' => $total_pages,
                'page' => $page,
                'per_page' => $per_page,
            ]
        ];
    }

    /**
     * Get total balance for a profile
     * 
     * @param int $profile_id Profile ID
     * @param bool $active_only Only include active accounts
     * @return float Total balance
     */
    public static function get_total_balance($profile_id, $active_only = true)
    {
        global $wpdb;
        $table = self::get_table_name();

        $query = "SELECT SUM(balance) FROM $table WHERE profile_id = %d";
        $params = [$profile_id];

        if ($active_only) {
            $query .= " AND is_active = 1";
        }

        $total = $wpdb->get_var($wpdb->prepare($query, $params));

        return $total ? (float) $total : 0.00;
    }

    /**
     * Get accounts by type
     * 
     * @param int $profile_id Profile ID
     * @param int $type_id Account type ID
     * @param bool $active_only Only include active accounts
     * @return array Array of account objects
     */
    public static function get_accounts_by_type($profile_id, $type_id, $active_only = true)
    {
        $args = ['type_id' => $type_id];

        if ($active_only) {
            $args['is_active'] = 1;
        }

        return self::get_accounts_by_profile($profile_id, $args);
    }

    /**
     * Update account balance
     * 
     * @param int $id Account ID
     * @param float $amount Amount to add (positive) or subtract (negative)
     * @return bool True on success, false on failure
     */
    public static function update_balance($profile_id, $id, $amount)
    {
        global $wpdb;
        $table = self::get_table_name();

        // Get current balance
        $current_balance = $wpdb->get_var($wpdb->prepare(
            "SELECT balance FROM $table WHERE id = %d",
            $id
        ));

        if ($current_balance === null) {
            return false;
        }

        // Calculate new balance
        $new_balance = (float) $current_balance + (float) $amount;

        // Update balance
        return self::update_account($profile_id, $id, ['balance' => $new_balance]);
    }

    /**
     * Search accounts
     * 
     * @param int $profile_id Profile ID
     * @param string $search Search term
     * @return array Array of matching account objects
     */
    public static function search_accounts($profile_id, $search)
    {
        global $wpdb;
        $table = self::get_table_name();
        $category_table = $wpdb->prefix . 'unclutter_finance_categories';

        $query = "SELECT a.*, c.name as type_name, c.type as category_type 
                 FROM $table a 
                 LEFT JOIN $category_table c ON a.type_id = c.id 
                 WHERE a.profile_id = %d AND 
                 (a.name LIKE %s OR a.description LIKE %s OR a.institution LIKE %s)";

        $search_term = '%' . $wpdb->esc_like($search) . '%';
        $params = [$profile_id, $search_term, $search_term, $search_term];

        $query .= " ORDER BY a.name ASC LIMIT 20";

        return $wpdb->get_results($wpdb->prepare($query, $params));
    }
}
