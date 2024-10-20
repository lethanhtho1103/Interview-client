app.controller("HomeController", function ($scope, AuthService) {
  const userInfo = AuthService.getUserInfo();
  $scope.fullName = userInfo ? userInfo.fullName : "Null";

  async function fetchUsers() {
    try {
      // Gọi hàm checkAndRefreshToken trước khi lấy danh sách người dùng
      await checkAndRefreshToken();

      const users = await AuthService.getAllUser();
      $scope.users = users;

      if (!$scope.$$phase) {
        $scope.$apply();
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error.message);
    }
  }

  async function checkAndRefreshToken() {
    const token = localStorage.getItem("accessToken");

    // Nếu không có token hoặc token đã hết hạn, tiến hành làm mới
    if (!token || isTokenExpired(token)) {
      try {
        await AuthService.refreshToken(); // Cố gắng làm mới token
      } catch (error) {
        console.error("Lỗi khi làm mới token:", error.message);
        // Tùy chọn xử lý trường hợp làm mới token thất bại, ví dụ: đăng xuất người dùng
        await logout();
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

    window.location.href = "#!/login";
  };

  if (userInfo) {
    fetchUsers();
  }
});
