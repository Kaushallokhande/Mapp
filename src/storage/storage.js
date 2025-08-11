import AsyncStorage from '@react-native-async-storage/async-storage'
const KEY = '@bill_splitter_groups'

async function loadAll() {
  try {
    const raw = await AsyncStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

async function saveAll(groups) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(groups))
  } catch (e) {}
}

export default { loadAll, saveAll }