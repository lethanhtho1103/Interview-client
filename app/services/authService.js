app.factory("AuthService", function ($http) {
  var authService = {};

  authService.login = async function (email, password) {
    try {
      const response = await $http.post("http://localhost:8000/auth/login", {
        email,
        password,
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.data);
      }
    } catch (error) {
      throw new Error(error.response || "An error occurred!");
    }
  };

  authService.verifyOtp = async function (email, otp) {
    try {
      const response = await $http.post(
        "http://localhost:8000/auth/verify-otp",
        {
          email,
          otp: parseInt(otp),
        }
      );
      if (response.status === 200) {
        return response.data; // Trả về dữ liệu khi xác thực thành công
      } else {
        throw new Error(response.data.message); // Lấy thông báo lỗi từ server
      }
    } catch (error) {
      throw new Error(
        error.response ? error.response.data.message : "An error occurred!"
      ); // Đảm bảo trả về thông báo lỗi
    }
  };

  return authService;
});
