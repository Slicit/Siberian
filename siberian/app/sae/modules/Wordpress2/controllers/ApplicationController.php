<?php

use Vnn\WpApiClient\Auth\WpBasicAuth;
use Vnn\WpApiClient\Http\GuzzleAdapter;
use Vnn\WpApiClient\WpClient;

/**
 * Class Wordpress2_ApplicationController
 */
class Wordpress2_ApplicationController extends Application_Controller_Default {

    public function testAction () {

        echo '<pre>';
        try {
            $client = new WpClient(new GuzzleAdapter(new GuzzleHttp\Client()), 'https://doc.siberiancms.com');
            //$client->setCredentials(new WpBasicAuth('a.crepin', 'NHGgtt51'));

            $posts = $client->posts()->get(null, [
                'categories' => [21, 39]
            ]);
            $categories = $client->categories()->get();

            foreach ($categories as $category) {
                echo sprintf('<b>%s</b> %s <br />', $category['name'], $category['link']);
                echo sprintf('-- %s <br />', implode(', ', array_keys($category)));
            }
            foreach ($posts as $post) {
                print_r($post);
            }
        } catch (Exception $e) {
            print_r($e->getMessage());
        }
        die();
    }
}
