'use strict';

angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', '$upload', 'Authentication', 'Posts', 'Comments', 'Likes', 'AWS',
    function($scope, $stateParams, $location, $upload, Authentication, Posts, Comments, Likes, AWS) {
        $scope.authentication = Authentication;

        // If user is signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.new = function($files) {
            var post = new Posts({
                detail: this.detail
            });

            console.log('id', post._id);

            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: 'https://s3.amazonaws.com/tottus/',
                    method: 'POST',
                    //headers: {'header-key': 'header-value'},
                    //withCredentials: true,
                    data: {
                        key: 'post' + post._id , // the key to store the file on S3, could be file name or customized
                        AWSAccessKeyId: $scope.credentials.access_key, 
                        acl: 'private', // sets the access to the uploaded file in the bucker: private or public 
                        policy: $scope.credentials.policy, // base64-encoded json policy (see article below)
                        signature: $scope.credentials.signature, // base64-encoded signature based on policy string (see article below)
                        'Content-Type': file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty),
                        filename: 'post' + post._id // this is needed for Flash polyfill IE8-9
                        // myObj: $scope.myModelObj
                    },
                    file: file, // or list of files ($files) for html5 only
                    //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                    // customize file formData name ('Content-Disposition'), server side file variable name. 
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
                    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                    //formDataAppender: function(formData, key, val){}
                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log('data', data);
                    console.log('status', status);
                    console.log('headers', headers);
                });
            }

            post.$save(function(response) {
                $location.path('posts/' + response._id);
                $scope.detail = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.like = function() {
            var like = new Likes({
                post: $scope.post._id
            });
            $scope.post.likes.push({ user: { _id: $scope.authentication.user, personal: { displayName: $scope.authentication.user.personal.displayName} }});
            like.create($scope.post._id);
            $scope.result = 'Te gusta';
        };

        $scope.comment = function() {
            var comment = new Comments({
                text: this.text
            });

            $scope.post.comments.push({ text: this.text, user: { _id: $scope.authentication.user, personal: { displayName: $scope.authentication.user.personal.displayName} }});
            $scope.text = '';
            comment.create($scope.post._id);
        };

        $scope.getCredentials = function() {
            AWS.getCredentials().then(function(res) {
                $scope.credentials = res.data;
            });
        };

        // Access Key ID:
        // AKIAJX35ISJYQIF2UHGQ
        // Secret Access Key:
        // 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

        // $scope.policy = 'ewogICAgICAiZXhwaXJhdGlvbiI6ICIyMDE0LTEwLTI2VDAyOjQzOjQwLjAwMFoiLAogICAgICJjb25kaXRpb25zIjogWwogICAgICAgICAgICAgeyJidWNrZXQiOiAidG90dHVzIn0sICAgICAgICAgICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICIiXSwgICAgICAgICAgICAgeyJhY2wiOiAicHJpdmF0ZSJ9LCAgICAgICAgICAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sICAgICAgICAgICAgIFsic3RhcnRzLXdpdGgiLCAiJGZpbGVuYW1lIiwgIiJdLCAgICAgICAgICAgICBbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwgMCwgNTI0Mjg4MDAwXQogICBdCn0=';
        // $scope.signature = '23z7BcSrJtK8Aa6+/J2tJKXpNgo=';

        $scope.onFileSelect = function($files) {
            console.log($scope.credentials);
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: 'https://s3.amazonaws.com/tottus/',
                    method: 'POST',
                    //headers: {'header-key': 'header-value'},
                    //withCredentials: true,
                    data: {
                        key: file.name, // the key to store the file on S3, could be file name or customized
                        AWSAccessKeyId: $scope.credentials.access_key, 
                        acl: 'private', // sets the access to the uploaded file in the bucker: private or public 
                        policy: $scope.credentials.policy, // base64-encoded json policy (see article below)
                        signature: $scope.credentials.signature, // base64-encoded signature based on policy string (see article below)
                        'Content-Type': file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty),
                        filename: file.name // this is needed for Flash polyfill IE8-9
                        // myObj: $scope.myModelObj
                    },
                    file: file, // or list of files ($files) for html5 only
                    //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                    // customize file formData name ('Content-Disposition'), server side file variable name. 
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
                    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                    //formDataAppender: function(formData, key, val){}
                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log('data', data);
                    console.log('status', status);
                    console.log('headers', headers);
                });
            }
        }

        $scope.find = function() {
            $scope.posts = Posts.query();
        };

        $scope.findOne = function() {
            $scope.post = Posts.get({
                postId: $stateParams.postId
            });
        };

        $scope.remove = function(post) {
            if (post) {
                post.$remove();

                for (var i in $scope.posts) {
                    if ($scope.posts[i] === post) {
                        $scope.posts.splice(i, 1);
                    }
                }
            } else {
                $scope.post.$remove(function() {
                    $location.path('posts');
                });
            }
        };

    }
]);
