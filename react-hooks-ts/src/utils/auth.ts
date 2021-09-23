import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: any) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getLocalStorage(key: any) {
  return window.localStorage.getItem(key)
}

export function setLocalStorage(key: any, value: any) {
  return window.localStorage.setItem(key, value)
}
