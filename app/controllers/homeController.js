app.controller("HomeController", function ($scope, AuthService) {
  const userInfo = AuthService.getUserInfo();
  $scope.fullName = userInfo ? userInfo.fullName : "Null";

  async function fetchUsers() {
    try {
      const users = await AuthService.getAllUser();
      $scope.users = users;

      if (!$scope.$$phase) {
        $scope.$apply();
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  }

  $scope.logout = async function () {
    await AuthService.logout();
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");
    window.location.href = "#!/login";
  };

  if (userInfo) {
    fetchUsers();
  }
});
