export const saveToken = (token, remember) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('auth_token', token);
  };
  
  export const getToken = () =>
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  
  export const removeToken = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  };
  
  export const isAuthenticated = () => !!getToken();