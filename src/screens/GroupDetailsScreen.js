import React, { useMemo, useState } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { Text, List, Button, Avatar, FAB, Portal, Modal, TextInput } from 'react-native-paper'
import { useApp } from '../context/AppContext'

export default function GroupDetailsScreen({ route, navigation }) {
  const { groupId } = route.params
  const { groups, addParticipant, resetExpenses, deleteGroup } = useApp()
  const group = groups.find((g) => g.id === groupId) || { participants: [], expenses: [], name: '' }

  const total = useMemo(
    () => group.expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [group.expenses]
  )

  const [adding, setAdding] = useState(false)
  const [participantName, setParticipantName] = useState('')

  function onAddParticipant() {
    const name = participantName.trim()
    if (!name) return
    addParticipant(groupId, { name })
    setParticipantName('')
    setAdding(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">{group.name}</Text>
        <Text style={styles.total}>Total Expenses: ₹{total.toFixed(2)}</Text>
      </View>

      <List.Section>
        <List.Subheader>Participants</List.Subheader>
        <FlatList
          data={group.participants}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={`Balance: ₹${Number(item.balance || 0).toFixed(2)}`}
              left={(props) => <Avatar.Text {...props} size={40} label={(item.name || '?')[0]} />}
            />
          )}
          ListEmptyComponent={() => <List.Item title="No participants" />}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Expenses</List.Subheader>
        <FlatList
          data={group.expenses}
          keyExtractor={(e) => e.id}
          renderItem={({ item }) => {
            const payer = group.participants.find((p) => p.id === item.paidBy)
            return (
              <List.Item
                title={item.title}
                description={`₹${Number(item.amount).toFixed(2)} • Paid by ${payer?.name || '—'}`}
              />
            )
          }}
          ListEmptyComponent={() => <List.Item title="No expenses" />}
        />
      </List.Section>

      <View style={styles.actions}>
        <Button mode="contained" onPress={() => navigation.navigate('AddExpense', { groupId })}>
          Add Expense
        </Button>
        <Button mode="outlined" onPress={() => navigation.navigate('Settlement', { groupId })}>
          View Settlement
        </Button>
      </View>

      <View style={styles.bottomRow}>
        <FAB icon="account-plus" small label="Add participant" onPress={() => setAdding(true)} />
        <FAB
          icon="delete"
          small
          label="Reset Expenses"
          onPress={() => resetExpenses(groupId)}
          style={{ marginLeft: 8, backgroundColor: '#f5f5f5' }}
        />
        <FAB
          icon="trash-can"
          small
          label="Delete group"
          onPress={() => {
            deleteGroup(groupId)
            navigation.goBack()
          }}
          style={{ marginLeft: 8, backgroundColor: '#ffe6e6' }}
        />
      </View>

      <Portal>
        <Modal
          visible={adding}
          onDismiss={() => setAdding(false)}
          contentContainerStyle={styles.modal}
        >
          <TextInput
            label="Participant name"
            value={participantName}
            onChangeText={setParticipantName}
            mode="outlined"
            autoFocus
          />
          <View style={styles.modalButtons}>
            <Button onPress={() => setAdding(false)}>Cancel</Button>
            <Button mode="contained" onPress={onAddParticipant}>
              Add
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  total: { marginTop: 8 },
  actions: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bottomRow: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  modal: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8
  },
  modalButtons: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end' }
})
