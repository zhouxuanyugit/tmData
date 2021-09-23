import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import reducer from './reducers'
import { persistStore, persistReducer } from 'redux-persist';
//sessionStorage,localStorage都可
import storageSession from 'redux-persist/lib/storage/session';
const persistConfig = {
  key: 'root', // 必须有的  
  storage: storageSession, // 缓存机制  
  blacklist: [] //reducer 里不持久化的数据, 除此外均为持久化数据  
}
const persistedReducer = persistReducer(persistConfig, reducer)

let store = createStore(persistedReducer, applyMiddleware(reduxThunk));
let persistor = persistStore(store);
export { store, persistor };
