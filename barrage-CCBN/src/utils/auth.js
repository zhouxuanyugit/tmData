import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getLocalStrogeToken() {
  return window.localStorage.getItem('token')
}

export function setSessionStorage(key, value) {
  window.sessionStorage.setItem(key, value);
}

export function getSessionStorage(key) {
  return window.sessionStorage.getItem(key);
}
