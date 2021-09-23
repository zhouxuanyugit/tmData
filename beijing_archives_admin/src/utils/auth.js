import Cookies from 'js-cookie'

const TokenKey = 'bjda-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getLocalStorage(key) {
  return window.localStorage.getItem(key)
}

export function setLocalStorage(key, value) {
  return window.localStorage.setItem(key, value)
}
