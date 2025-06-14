

export const logout = () => {
    const logout = () => {
        localStorage.removeItem("user")
        window.location.href = "/"
    }
    return logout
}