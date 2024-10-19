app.controller("HomeController", function ($scope, AuthService) {
  const userInfo = AuthService.getUserInfo();
  $scope.fullName = userInfo ? userInfo.fullName : "Null"; // Default to "Guest" if userInfo is null

  async function fetchUsers() {
    try {
      const users = await AuthService.getAllUser();
      $scope.users = users;

      // Manually trigger Angular digest cycle if needed
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  }

  if (userInfo) {
    fetchUsers(); // Only fetch users if userInfo exists
  }
});
