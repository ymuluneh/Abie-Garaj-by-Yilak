const loginService = async (formData) => {
  try {
    const api_url = import.meta.env.VITE_API_URL;
    const response = await fetch(`${api_url}/api/employee/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return {
      ok: response.ok,
      token: data.token,
      employee: data.employee,
      message: data.message,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      ok: false,
      message: "Network error. Please try again.",
    };
  }
};

const logOut = () => {
  localStorage.removeItem("employee");
};

export default { loginService, logOut };
