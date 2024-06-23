<?php
/*
Plugin Name: Mega Menu Plugin
Description: A custom mega menu plugin using React and ACF.
Version: 1.0
Author: Richard Medina
*/

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Function to get asset paths from the manifest file
function mega_menu_get_asset_paths() {
    $asset_manifest_path = plugin_dir_path(__FILE__) . 'build/asset-manifest.json';

    if (!file_exists($asset_manifest_path)) {
        return null;
    }

    $asset_manifest = json_decode(file_get_contents($asset_manifest_path), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return null;
    }

    $assets = [
        'js' => [],
        'css' => [],
    ];

    if (isset($asset_manifest['files'])) {
        foreach ($asset_manifest['files'] as $key => $value) {
            if (strpos($key, '.js') !== false) {
                $assets['js'][] = $value;
            } elseif (strpos($key, '.css') !== false) {
                $assets['css'][] = $value;
            }
        }
    }

    return $assets;
}

// Enqueue React and Custom Scripts for Frontend
function mega_menu_enqueue_scripts() {
    if (!is_admin()) {
        $assets = mega_menu_get_asset_paths();

        if ($assets) {
            foreach ($assets['css'] as $css_file) {
                wp_enqueue_style('sge-mega-menu-style', plugin_dir_url(__FILE__) . 'build/' . $css_file, array(), '1.0', 'all');
            }

            foreach ($assets['js'] as $js_file) {
                wp_enqueue_script('sge-mega-menu-script', plugin_dir_url(__FILE__) . 'build/' . $js_file, array(), '1.0', true);
            }
        }
    }
}
add_action('wp_enqueue_scripts', 'mega_menu_enqueue_scripts');

// Register Custom Settings Page
if( function_exists('acf_add_options_page') ) {
    acf_add_options_page(array(
        'page_title'    => 'Mega Menu Settings',
        'menu_title'    => 'Mega Menu',
        'menu_slug'     => 'mega-menu-settings',
        'capability'    => 'edit_posts',
        'redirect'      => false
    ));
}

// Recursive function to create nested repeater fields
function create_nested_repeater($level) {
    if ($level > 5) return null;

    $nested_repeater = array(
        'key' => 'field_mega_menu_level_' . $level,
        'label' => 'Level ' . $level,
        'name' => 'level_' . $level,
        'type' => 'repeater',
        'layout' => 'row',
        'collapsed' =>  'field_mega_menu_level_' . $level . '_text',
        'sub_fields' => array(
            array(
                'key' => 'field_mega_menu_level_' . $level . '_text',
                'label' => 'Text',
                'name' => 'text',
                'type' => 'text',
            ),
            array(
                'key' => 'field_mega_menu_level_' . $level . '_link',
                'label' => 'Page Link',
                'name' => 'link',
                'type' => 'page_link',
                'allow_null' => 1, // Allow null values
            ),
            create_nested_repeater($level + 1)
        ),
    );

    return $nested_repeater;
}

// Register ACF Fields
function register_mega_menu_acf_fields() {
    if( function_exists('acf_add_local_field_group') ) {
        $fields = create_nested_repeater(1);

        acf_add_local_field_group(array(
            'key' => 'group_mega_menu',
            'title' => 'Mega Menu Settings',
            'fields' => array($fields),
            'location' => array(
                array(
                    array(
                        'param' => 'options_page',
                        'operator' => '==',
                        'value' => 'mega-menu-settings',
                    ),
                ),
            ),
        ));
    }
}
add_action('acf/init', 'register_mega_menu_acf_fields');

// Shortcode to render the Mega Menu
function render_mega_menu() {
    return '<div id="mega-menu-root"></div>';
}
add_shortcode('sge_mega_menu', 'render_mega_menu');

add_filter('acf/rest_api/options/get', '__return_true');
