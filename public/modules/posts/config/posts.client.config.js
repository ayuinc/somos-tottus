'use strict';

angular.module('posts').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'Posts', 'posts', 'dropdown', '/posts(/new)?');
        Menus.addSubMenuItem('topbar', 'posts', 'List Posts', 'posts');
        Menus.addSubMenuItem('topbar', 'posts', 'New Post', 'posts/new');
    }
]);