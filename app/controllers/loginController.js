app.controller(
  "LoginController",
  function ($scope, $timeout, $location, AuthService) {
    $scope.showPassword = false;
    $scope.errorMessage = "";
    $scope.successMessage = "";
    $scope.isLoading = false;
    $scope.otp1 = "";
    $scope.otp2 = "";
    $scope.otp3 = "";
    $scope.otp4 = "";
    $scope.otp5 = "";
    $scope.otp6 = "";
    $scope.countdown = 60;

    $scope.resetValue = function () {
      $scope.errorMessage = "";
      $scope.isLoading = false;
      $scope.otp1 =
        $scope.otp2 =
        $scope.otp3 =
        $scope.otp4 =
        $scope.otp5 =
        $scope.otp6 =
          "";
      $scope.email = "";
      $scope.password = "";
      var otpModalElement = document.getElementById("otpModal");
      var otpModal = bootstrap.Modal.getInstance(otpModalElement);
      if (otpModal) {
        otpModal.hide();
      }
    };

    $scope.togglePasswordVisibility = function () {
      $scope.showPassword = !$scope.showPassword;
    };

    $scope.isValidEmail = function (email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    $scope.login = async function () {
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

    $scope.startCountdown = function () {
      $scope.countdown = 60; // Reset lại countdown

      var timer = function () {
        if ($scope.countdown > 0) {
          $scope.countdown--;
          if (!$scope.$$phase) {
            $scope.$apply(); // Cập nhật giao diện
          }
          $timeout(timer, 1000); // Tiếp tục đếm ngược
        } else {
          // Tự động đóng modal khi countdown về 0
          var otpModalElement = document.getElementById("otpModal");
          var otpModal = bootstrap.Modal.getInstance(otpModalElement); // Lấy instance của modal
          if (otpModal) {
            otpModal.hide();
            $scope.errorMessage = "OTP expired.";
          } else {
            console.error("Modal instance not found");
          }
        }
      };
      $timeout(timer, 1000); // Khởi chạy timer
    };

    // Sử dụng sự kiện để gọi startCountdown khi modal hiển thị
    angular.element(document).ready(function () {
      var otpModalElement = document.getElementById("otpModal");

      otpModalElement.addEventListener("shown.bs.modal", function () {
        $scope.startCountdown();
      });
    });

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

    $scope.verifyOtp = async function () {
      $scope.errorMessage = "";
      $scope.isLoading = true;

      // Kiểm tra xem các trường OTP có hợp lệ không
      const otp =
        $scope.otp1 +
        $scope.otp2 +
        $scope.otp3 +
        $scope.otp4 +
        $scope.otp5 +
        $scope.otp6;

      if (otp.length !== 6) {
        $scope.errorMessage = "Please enter a valid 6-digit OTP.";
        $scope.isLoading = false; // Đặt lại trạng thái loading
        return;
      }

      try {
        const response = await AuthService.verifyOtp($scope.email, otp);
        localStorage.setItem("userInfo", JSON.stringify(response.props));
        localStorage.setItem("accessToken", response.accessToken); // Chỉ cần lưu chuỗi, không cần JSON.stringify
        $scope.successMessage = "Login successfully";
        $location.path("/home");
        // Thực hiện các hành động khác sau khi xác thực thành công
      } catch (error) {
        // Hiển thị thông báo lỗi cụ thể hơn nếu có
        $scope.errorMessage = error.data?.message || "OTP invalid";
      } finally {
        $scope.resetValue();
        if (!$scope.$$phase) {
          $scope.$apply(); // Thông báo cho AngularJS về sự thay đổi
        }
      }
    };
  }
);
