'use strict';

angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', '$upload', 'Authentication', 'Posts', 'Comments', 'Likes',
    function($scope, $stateParams, $location, $upload, Authentication, Posts, Comments, Likes) {
        $scope.authentication = Authentication;

        // If user is signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.new = function() {
            var post = new Posts({
                detail: this.detail
            });

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
            $scope.post.likes.push({ user: { _id: $scope.authentication.user._id, personal: { displayName: $scope.authentication.user.personal.displayName} }});
            like.create($scope.post._id);
            $scope.ng_like = '0'; // me gusta
            console.log($scope.post);
        };

        $scope.comment = function() {
            var comment = new Comments({
                text: this.text
            });

            $scope.post.comments.push({ text: this.text, user: { _id: $scope.authentication.user, personal: { displayName: $scope.authentication.user.personal.displayName} }});
            $scope.text = '';
            comment.create($scope.post._id);
        };

        // Access Key ID:
        // AKIAJX35ISJYQIF2UHGQ
        // Secret Access Key:
        // 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

        $scope.policy = 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogInRvdHR1cyJ9LAogICAgWyJzdGFydHMtd2l0aCIsICIka2V5IiwgIiJdLAogICAgeyJhY2wiOiAicHJpdmF0ZSJ9LAogICAgWyJzdGFydHMtd2l0aCIsICIkQ29udGVudC1UeXBlIiwgIiJdLAogICAgWyJzdGFydHMtd2l0aCIsICIkZmlsZW5hbWUiLCAiIl0sCiAgICBbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwgMCwgNTI0Mjg4MDAwXQogIF0KfQ==';
        $scope.signature = 'pUYTtxJZEvcc3M9mmDoAL8tlvrE=';

        $scope.onFileSelect = function($files) {
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: 'https://s3.amazonaws.com/tottus/', //upload.php script, node.js route, or servlet url
                    method: 'POST',
                    //headers: {'header-key': 'header-value'},
                    //withCredentials: true,
                    data: {
                        key: file.name, // the key to store the file on S3, could be file name or customized
                        AWSAccessKeyId: 'AKIAJX35ISJYQIF2UHGQ', 
                        acl: 'private', // sets the access to the uploaded file in the bucker: private or public 
                        policy: $scope.policy, // base64-encoded json policy (see article below)
                        signature: $scope.signature, // base64-encoded signature based on policy string (see article below)
                        "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty),
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
                    console.log(data);
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
            console.log($scope.post);
            $scope.ng_like = '0'; // me gusta 
            /**
            for (var i = $scope.post.likes.length - 1; i >= 0; i--) {
                if($scope.post.likes[i].user == $scope.authentication.user._id){
                    $scope.ng_like = '1'; // te gusta 
                    break;
                }
            };*/
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
