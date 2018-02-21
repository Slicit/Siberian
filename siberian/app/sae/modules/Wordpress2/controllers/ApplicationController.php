<?php

use Vnn\WpApiClient\Auth\WpBasicAuth;
use Vnn\WpApiClient\Http\GuzzleAdapter;
use Vnn\WpApiClient\WpClient;

/**
 * Class Wordpress2_ApplicationController
 */
class Wordpress2_ApplicationController extends Application_Controller_Default {

    /**
     * Edit the default wordpress settings, url, login, password
     */
    public function editwordpressAction() {
        $request = $this->getRequest();
        $params = $request->getPost();

        $form = new Wordpress2_Form_Wordpress();
        if($form->isValid($params)) {
            // Do whatever you need when form is valid!
            $wordpress = new Wordpress2_Model_Wordpress();
            $wordpress = $wordpress
                ->find($params['wordpress2_id']);
            $wordpress->setData($params);
            $wordpress->save();

            /** Update touch date, then never expires (until next touch) */
            $this->getCurrentOptionValue()
                ->touch()
                ->expires(-1);

            $payload = [
                'success' => true,
                'message' => __('Success.'),
            ];
        } else {
            $payload = [
                'error' => true,
                'message' => $form->getTextErrors(),
                'errors' => $form->getTextErrors(true)
            ];
        }

        $this->_sendJson($payload);
    }

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
