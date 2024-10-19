app.controller("HomeController", function ($scope, AuthService) {
  // Lấy thông tin người dùng từ localStorage
  const userInfo = AuthService.getUserInfo();

  if (userInfo) {
    $scope.userName = userInfo.name || "User"; // Giả sử thông tin người dùng có trường 'name'
  }

  // Kiểm tra thông báo từ URL (nếu cần)
  const urlParams = new URLSearchParams(window.location.search);

  $scope.message = urlParams.get("success") || ""; // Nhận thông báo từ URL nếu có

  // Bạn có thể thêm mã hiển thị khác tại đây
});
