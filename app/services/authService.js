app.factory("AuthService", function ($http) {
  var authService = {};

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

  authService.verifyOtp = async function (email, otp) {
    try {
      const response = await $http.post(
        "http://localhost:8000/auth/verify-otp",
        {
          email,
          otp: parseInt(otp, 10),
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const date = new Date();
        date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;

        localStorage.setItem("userInfo", JSON.stringify(response.data.props));
        localStorage.setItem("accessToken", response.data.accessToken);
        document.cookie = `refresh_token=${response.data.refreshToken}; path=/; ${expires};`;
        return response.data;
      } else {
        console.error(response);
        throw new Error(response.data.message || "OTP verification failed!");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        error.response
          ? error.response.data.message
          : "An error occurred during OTP verification!"
      );
    }
  };

  authService.isLoggedIn = function () {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo === "undefined" || !userInfo) {
      return false;
    }

    return true;
  };

  authService.getUserInfo = function () {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  };

  authService.getAllUser = async function () {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await $http.get("http://localhost:8000/user", {
        headers: {
          token: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        return response.data;
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

  authService.refreshToken = async function () {
    try {
      const response = await $http.post(
        "http://localhost:8000/auth/refresh",
        null,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        //Không cần lưu lại refreshToken
        // document.cookie = `refresh_token=${response.data.refreshToken}; path=/; ${expires};`;
        return response.data;
      } else {
        throw new Error(response.data.message || "Error refreshing token.");
      }
    } catch (error) {
      console.log(error);
      const message = error.response
        ? error.response.data.message ||
          "An error occurred while refreshing token."
        : error.message || "An unknown error occurred.";
      throw new Error(message);
    }
  };

  return authService;
});
