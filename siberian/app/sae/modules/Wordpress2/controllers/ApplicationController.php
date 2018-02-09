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
            $wordpressApi = (new Wordpress2_Model_WordpressApi())
                ->init('https://doc.siberiancms.com', 'a.crepin', 'NHGgtt51');

            $categories = $wordpressApi->getCategories();
            foreach ($categories as $category) {
                $posts = $wordpressApi->getPosts($category['id'], 1);
                foreach ($posts as $post) {
                    echo '<b>' .$category['name'] . '</b> > ' . $post['title']['rendered'];
                    echo PHP_EOL;
                }
            }
        } catch (Exception $e) {
            print_r($e->getMessage());
        }
        die();
    }
}
