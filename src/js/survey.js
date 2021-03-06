var app = angular.module("stem-survey", []);

app.controller("formCtrl", function($scope, $http) {
    var vm = this;

    vm.loading = false;
    vm.error = false;
    vm.choice = "unset";
    vm.thanksHidden = true;
    
    var updatePlaceholder = function(){
        var year = (new Date()).getFullYear();
        vm.yog = (year - vm.grade + 4 + 9);
        
        if(vm.firstname && vm.lastname && vm.grade){
            vm.emailPlaceholder =
                `${vm.firstname.substring(0, 1).toLowerCase()}${vm.lastname.toLowerCase()}${vm.yog}@mka.org`;
        } else {
            vm.emailPlaceholder = "";
        }
    };

    $scope.$watch(function(){ return vm.firstname; }, updatePlaceholder);
    $scope.$watch(function(){ return vm.lastname; }, updatePlaceholder);
    $scope.$watch(function(){ return vm.grade; }, updatePlaceholder);


    vm.submit = function(){
        var body = {
            firstname: vm.firstname,
            lastname: vm.lastname,
            yog: vm.yog,
            email: vm.email || undefined,
            choice: vm.choice
        };

        $http.post("api/respond", body)
        .then(function success(){vm.loading = false;},
              function error(){vm.loading = false; vm.error = true;});

        vm.loading = true;

        vm.thanks = true;
        vm.thanksHidden = false;

        vm.firstname = "";
        vm.lastname = "";
        vm.grade = "";
        vm.email = "";
        vm.choice = "unset";
        $scope.inputForm.$setPristine();
        
        setTimeout(function(){
            $scope.$apply(function(){
                vm.thanks = false;
                setTimeout(function(){$scope.$apply(function(){
                    vm.thanksHidden = true;
                });}, 1000);
            });
        }, 2000);
    };


    $http.get("api/options")
    .then(function success(res){vm.options = res.data.options; },
          function fail(){alert("There was an error!"); });
});