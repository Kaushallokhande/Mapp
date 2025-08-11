import React, { useMemo } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { Text, Button, List } from 'react-native-paper'
import { useApp } from '../context/AppContext'
import { settleDebts } from '../utils/calculations'

export default function SettlementScreen({ route, navigation }) {
  const { groupId } = route.params
  const { groups, resetExpenses } = useApp()
  const group = groups.find((g) => g.id === groupId) || { participants: [] }

  const transactions = useMemo(() => settleDebts(group.participants), [group.participants])

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item, idx) => String(idx)}
        renderItem={({ item }) => (
          <List.Item
            title={`${item.from} ➜ ${item.to}`}
            description={`₹${Number(item.amount).toFixed(2)}`}
            left={(props) => <List.Icon {...props} icon="swap-horizontal" />}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text>No transactions needed — all settled.</Text>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => {
            resetExpenses(groupId)
            navigation.goBack()
          }}
        >
          Reset Expenses
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  empty: { padding: 16, alignItems: 'center' },
  footer: { padding: 16 }
})
