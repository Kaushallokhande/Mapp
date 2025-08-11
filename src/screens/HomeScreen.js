import React, { useState } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { FAB, Portal, Modal, TextInput, Text } from 'react-native-paper'
import { useApp } from '../context/AppContext'
import GroupCard from '../components/GroupCard'

export default function HomeScreen({ navigation }) {
  const { groups, createGroup } = useApp()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  function onCreate() {
    const trimmed = name.trim()
    if (!trimmed) return
    createGroup({ name: trimmed, participants: [], expenses: [] })
    setName('')
    setOpen(false)
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <GroupCard
            group={item}
            onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text>No groups yet. Tap + to create one.</Text>
          </View>
        )}
        contentContainerStyle={groups.length === 0 && styles.flatContent}
      />

      <Portal>
        <Modal
          visible={open}
          onDismiss={() => setOpen(false)}
          contentContainerStyle={styles.modal}
        >
          <TextInput
            label="Group name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            autoFocus
          />
          <View style={styles.modalButtons}>
            <FAB icon="close" small onPress={() => setOpen(false)} style={styles.modalFab} />
            <FAB icon="check" small onPress={onCreate} style={styles.modalFab} />
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setOpen(true)}
        accessibilityLabel="Create group"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  empty: { padding: 24, alignItems: 'center' },
  flatContent: { flex: 1, justifyContent: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 16 },
  modal: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8
  },
  modalButtons: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end' },
  modalFab: { marginLeft: 8 }
})
