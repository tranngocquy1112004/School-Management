export const getAuthHeader = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return {};
    try {
        const user = JSON.parse(storedUser);
        const token = user && user.token;
        return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (error) {
        return {};
    }
};
