

export const useLogout = () => {
    const logout = () => {
        localStorage.removeItem("user")
        window.location.href = "/"
    }
    return logout
}