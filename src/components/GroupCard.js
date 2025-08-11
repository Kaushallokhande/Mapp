import React from 'react'
import { Card, Text } from 'react-native-paper'
import { TouchableOpacity } from 'react-native'

export default function GroupCard({ group, onPress }) {
  const total = group.expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={{ margin: 8 }}>
        <Card.Title title={group.name} subtitle={`${group.participants.length} participants`} />
        <Card.Content>
          <Text>Total: ₹{total.toFixed(2)}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}