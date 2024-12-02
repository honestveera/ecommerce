export const saveDataWithExpiration = (key, expirationMinutes) => {
    const now = new Date();
    const expirationTime = now.getTime() + expirationMinutes * 60 * 1000;
    const item = { expires: expirationTime };
    localStorage.setItem(key, JSON.stringify(item));
}