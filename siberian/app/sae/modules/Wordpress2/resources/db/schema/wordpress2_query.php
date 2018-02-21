<?php
/**
 *
 * Schema definition for 'wordpress2_category'
 *
 * Last update: 2018-02-09
 *
 */
$schemas = (!isset($schemas)) ? [] : $schemas;
$schemas['wordpress2_query'] = [
    'query_id' => [
        'type' => 'int(11) unsigned',
        'auto_increment' => true,
        'primary' => true,
    ],
    'wordpress2_id' => [
        'type' => 'int(11) unsigned',
        'foreign_key' => [
            'table' => 'wordpress2',
            'column' => 'value_id',
            'name' => 'wordpress2_id_query',
            'on_update' => 'CASCADE',
            'on_delete' => 'CASCADE',
        ],
        'index' => [
            'key_name' => 'KEY_QUERY_ID',
            'index_type' => 'BTREE',
            'is_null' => false,
            'is_unique' => false,
        ],
    ],
    'title' => [
        'type' => 'varchar(255)',
        'charset' => 'utf8',
        'collation' => 'utf8_unicode_ci',
    ],
    'subtitle' => [
        'type' => 'varchar(255)',
        'charset' => 'utf8',
        'collation' => 'utf8_unicode_ci',
    ],
    'query' => [
        'type' => 'longtext',
        'charset' => 'utf8',
        'collation' => 'utf8_unicode_ci',
    ],
    'position' => [
        'type' => 'int(11) unsigned',
        'default' => '1',
    ],
    'is_published' => [
        'type' => 'tinyint(1)',
        'default' => '1',
    ],
];
