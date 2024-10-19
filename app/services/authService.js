app.factory("AuthService", function ($http) {
  var authService = {};

  // Hàm đăng nhập
  authService.login = async function (email, password) {
    try {
      const response = await $http.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        // Lưu thông tin vào localStorage
        localStorage.setItem("userInfo", JSON.stringify(response.data.props));
        localStorage.setItem("accessToken", response.data.accessToken);
        return response.data; // Trả về dữ liệu khi đăng nhập thành công
      } else {
        throw new Error(response.data.message || "Login failed!");
      }
    } catch (error) {
      throw new Error(
        error.response
          ? error.response.data.message
          : "An error occurred during login!"
      );
    }
  };

  // Hàm xác thực OTP
  authService.verifyOtp = async function (email, otp) {
    try {
      const response = await $http.post(
        "http://localhost:8000/auth/verify-otp",
        {
          email,
          otp: parseInt(otp, 10),
        }
      );

      if (response.status === 200) {
        // Lưu thông tin vào localStorage nếu xác thực thành công
        localStorage.setItem("userInfo", JSON.stringify(response.data.props));
        localStorage.setItem("accessToken", response.data.accessToken);
        return response.data; // Trả về dữ liệu khi xác thực thành công
      } else {
        throw new Error(response.data.message || "OTP verification failed!");
      }
    } catch (error) {
      throw new Error(
        error.response
          ? error.response.data.message
          : "An error occurred during OTP verification!"
      );
    }
  };

  // Hàm kiểm tra xem người dùng đã đăng nhập hay chưa
  authService.isLoggedIn = function () {
    return !!localStorage.getItem("userInfo");
  };

  authService.getUserInfo = function () {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  };

  authService.getAllUser = async function () {
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("accessToken"); // Update this to match your storage key if different

      // Send GET request with Authorization header
      const response = await $http.get("http://localhost:8000/user", {
        headers: {
          token: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        return response.data; // Return the data if successful
      } else {
        throw new Error(response.data.message || "Error fetching users.");
      }
    } catch (error) {
      console.log(error);
      const message = error.response
        ? error.response.data.message ||
          "An error occurred while fetching users."
        : error.message || "An unknown error occurred.";
      throw new Error(message);
    }
  };

  authService.logout = async function () {
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("accessToken"); // Update this to match your storage key if different

      // Send GET request with Authorization header
      const response = await $http.post("http://localhost:8000/logout", {
        headers: {
          token: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        return response.data; // Return the data if successful
      } else {
        throw new Error(response.data.message || "Error logout.");
      }
    } catch (error) {
      console.log(error);
      const message = error.response
        ? error.response.data.message || "An error occurred while logout."
        : error.message || "An unknown error occurred.";
      throw new Error(message);
    }
  };

  return authService;
});
