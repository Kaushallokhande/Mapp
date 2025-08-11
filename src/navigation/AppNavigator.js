import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import GroupDetailsScreen from '../screens/GroupDetailsScreen'
import AddExpenseScreen from '../screens/AddExpenseScreen'
import SettlementScreen from '../screens/SettlementScreen'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Groups' }} />
      <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} options={{ title: 'Group Details' }} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add Expense' }} />
      <Stack.Screen name="Settlement" component={SettlementScreen} options={{ title: 'Settlement' }} />
    </Stack.Navigator>
  )
}