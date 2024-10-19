app.controller("LoginController", function ($scope, AuthService) {
  $scope.showPassword = false;
  $scope.errorMessage = "";
  $scope.isLoading = false;
  $scope.otp1 = "";
  $scope.otp2 = "";
  $scope.otp3 = "";
  $scope.otp4 = "";
  $scope.otp5 = "";
  $scope.otp6 = "";

  $scope.togglePasswordVisibility = function () {
    $scope.showPassword = !$scope.showPassword;
  };

  $scope.isValidEmail = function (email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  $scope.login = async function () {
    // const otpModal = new bootstrap.Modal(document.getElementById("otpModal"));
    // otpModal.show();
    if (!$scope.email || !$scope.password) {
      $scope.errorMessage = "Email and password are required.";
      return;
    }

    if (!$scope.isValidEmail($scope.email)) {
      $scope.errorMessage = "Invalid email format.";
      return;
    }

    $scope.isLoading = true;

    try {
      const response = await AuthService.login($scope.email, $scope.password);
      if (response) {
        // Hiển thị modal OTP sau khi đăng nhập thành công
        const otpModal = new bootstrap.Modal(
          document.getElementById("otpModal")
        );
        otpModal.show();
        $scope.errorMessage = "";
      }
    } catch (error) {
      $scope.errorMessage = "Wrong email or password";
    } finally {
      $scope.isLoading = false;
      if (!$scope.$$phase) {
        $scope.$apply(); // Thông báo cho AngularJS về sự thay đổi
      }
    }
  };

  $scope.moveFocus = function (event, nextInputId) {
    const input = event.target;

    // Chuyển ô nhập nếu có giá trị
    if (input.value.length === 1) {
      document.getElementById(nextInputId).focus();
    }

    // Nếu ô nhập trống và nhấn phím Backspace, quay về ô trước đó
    if (input.value.length === 0 && event.key === "Backspace") {
      const previousInput = input.previousElementSibling;
      if (previousInput) {
        previousInput.focus();
      }
    }
  };

  $scope.clearValue = function () {
    $scope.errorMessage = "";
    $scope.isLoading = false;
    $scope.otp1 = "";
    $scope.otp2 = "";
    $scope.otp3 = "";
    $scope.otp4 = "";
    $scope.otp5 = "";
    $scope.otp6 = "";
    $scope.email = "";
    $scope.password = "";
  };

  $scope.verifyOtp = async function () {
    $scope.errorMessage = "";
    $scope.isLoading = true;
    const otp =
      $scope.otp1 +
      $scope.otp2 +
      $scope.otp3 +
      $scope.otp4 +
      $scope.otp5 +
      $scope.otp6;

    try {
      const response = await AuthService.verifyOtp($scope.email, otp);
      console.log(response);
      $scope.successMessage = "Login successfully";
      $scope.errorMessage = "";
      // Thực hiện các hành động khác sau khi xác thực thành công
    } catch (error) {
      $scope.errorMessage = "OTP expired or invalid";
      // Hiển thị thông báo lỗi
    } finally {
      $scope.clearValue();
      if (!$scope.$$phase) {
        $scope.$apply(); // Thông báo cho AngularJS về sự thay đổi
      }
    }
  };
});
