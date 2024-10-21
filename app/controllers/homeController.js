app.controller(
  "HomeController",
  function ($scope, $timeout, $location, AuthService) {
    const userInfo = AuthService.getUserInfo();

    $scope.fullName = userInfo ? userInfo.fullName : "Null";

    async function fetchUsers() {
      try {
        await checkAndRefreshToken();
        const users = await AuthService.getAllUser();
        $scope.users = users;
        if (!users) {
          $scope.$apply(() => {
            $scope.message = "User list is empty";
          });
        }
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error.message);
      }
    }

    async function checkAndRefreshToken() {
      const token = localStorage.getItem("accessToken");

      if (!token || isTokenExpired(token)) {
        try {
          await AuthService.refreshToken();
        } catch (error) {
          $scope.$apply(() => {
            $scope.message = "Invalid token";
          });
        }
      }
    }

    function isTokenExpired(token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000; // Chuyển đổi thành mili giây
      return Date.now() >= expirationTime; // Kiểm tra xem token có hết hạn không
    }

    $scope.logout = async function () {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");
      document.cookie =
        "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      $location.path("/login");
      $timeout(function () {
        alert("Logout successfully.");
      }, 500);
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };

    if (userInfo) {
      fetchUsers();
    }
  }
);
