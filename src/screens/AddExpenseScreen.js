import React, { useState, useEffect } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { TextInput, RadioButton, Text, Button, Checkbox, Divider } from 'react-native-paper'
import { useApp } from '../context/AppContext'

export default function AddExpenseScreen({ route, navigation }) {
  const { groupId } = route.params
  const { groups, addExpense } = useApp()
  const group = groups.find((g) => g.id === groupId) || { participants: [], expenses: [] }

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(group.participants[0]?.id || '')
  const [splitType, setSplitType] = useState('EQUAL')
  const [selected, setSelected] = useState(group.participants.map((p) => p.id))
  const [custom, setCustom] = useState(group.participants.map((p) => ({ id: p.id, amount: '' })))

  useEffect(() => {
    // keep selected and custom in sync with participants changing
    setSelected(group.participants.map((p) => p.id))
    setCustom(group.participants.map((p) => ({ id: p.id, amount: '' })))
    if (!group.participants.find((p) => p.id === paidBy)) {
      setPaidBy(group.participants[0]?.id || '')
    }
  }, [group.participants])

  function toggleParticipant(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function setCustomAmount(pid, val) {
    setCustom((prev) => prev.map((x) => (x.id === pid ? { ...x, amount: val } : x)))
  }

  function onSave() {
    const amt = Number(amount) || 0
    if (!title.trim() || amt <= 0 || !paidBy) {
      return
    }

    // Build payload
    const payload = {
      title: title.trim(),
      amount: amt,
      paidBy,
      splitType,
      splitWith: selected,
      customSplit: custom.map((c) => ({ id: c.id, amount: Number(c.amount) || 0 }))
    }

    // Simple validation for custom split: sum of custom amounts must equal amount (or we accept as-is and rely on display)
    if (splitType === 'CUSTOM') {
      const sum = payload.customSplit.reduce((s, c) => s + Number(c.amount || 0), 0)
      // we allow small rounding differences but warn the user (here we just proceed)
      if (Math.abs(sum - amt) > 0.5) {
        // you could show a toast - for now we proceed
      }
    }

    addExpense(groupId, payload)
    navigation.goBack()
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput label="Title" value={title} onChangeText={setTitle} mode="outlined" />
      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={{ marginTop: 12 }}
      />

      <Divider style={{ marginVertical: 12 }} />

      <Text>Paid by</Text>
      <RadioButton.Group onValueChange={(v) => setPaidBy(v)} value={paidBy}>
        {group.participants.map((p) => (
          <RadioButton.Item key={p.id} label={p.name} value={p.id} />
        ))}
      </RadioButton.Group>

      <Divider style={{ marginVertical: 12 }} />

      <Text>Split type</Text>
      <RadioButton.Group onValueChange={(v) => setSplitType(v)} value={splitType}>
        <RadioButton.Item label="Equal" value="EQUAL" />
        <RadioButton.Item label="Custom" value="CUSTOM" />
      </RadioButton.Group>

      <Divider style={{ marginVertical: 12 }} />

      <Text>Participants</Text>
      {group.participants.map((p) => (
        <View key={p.id} style={styles.partRow}>
          <Text style={{ flex: 1 }}>{p.name}</Text>
          <View style={styles.partRight}>
            <Checkbox
              status={selected.includes(p.id) ? 'checked' : 'unchecked'}
              onPress={() => toggleParticipant(p.id)}
            />
            {splitType === 'CUSTOM' && (
              <TextInput
                mode="outlined"
                placeholder="share"
                value={custom.find((c) => c.id === p.id)?.amount}
                onChangeText={(val) => setCustomAmount(p.id, val)}
                keyboardType="numeric"
                style={styles.customInput}
              />
            )}
          </View>
        </View>
      ))}

      <Button mode="contained" onPress={onSave} style={{ marginTop: 16 }}>
        Save
      </Button>
    </ScrollView>
  )
}

const styles = {
  container: { padding: 16, backgroundColor: '#fff' },
  partRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  partRight: { flexDirection: 'row', alignItems: 'center' },
  customInput: { width: 120, marginLeft: 8 }
}
