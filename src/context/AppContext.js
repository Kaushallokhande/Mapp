import React, { createContext, useContext, useEffect, useState } from 'react'
import Storage from '../storage/storage'
import { generateBalances } from '../utils/calculations'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Storage.loadAll().then(data => {
      setGroups(data || [])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!loading) Storage.saveAll(groups)
  }, [groups, loading])

  function createGroup(group) {
    setGroups(prev => [...prev, { id: Date.now().toString(), participants: [], expenses: [], ...group }])
  }

  function updateGroup(updated) {
    setGroups(prev => prev.map(g => (g.id === updated.id ? updated : g)))
  }

  function deleteGroup(id) {
    setGroups(prev => prev.filter(g => g.id !== id))
  }

  function addParticipant(groupId, participant) {
    const g = groups.find(x => x.id === groupId)
    if (!g) return
    const updated = { ...g, participants: [...g.participants, { id: Date.now().toString(), balance: 0, ...participant }] }
    updateGroup(updated)
  }

  function addExpense(groupId, expense) {
    const g = groups.find(x => x.id === groupId)
    if (!g) return
    const updated = { ...g, expenses: [...g.expenses, { id: Date.now().toString(), ...expense }] }
    const balanced = { ...updated, participants: generateBalances(updated.participants, updated.expenses) }
    updateGroup(balanced)
  }

  function resetExpenses(groupId) {
    const g = groups.find(x => x.id === groupId)
    if (!g) return
    const updated = { ...g, expenses: [], participants: g.participants.map(p => ({ ...p, balance: 0 })) }
    updateGroup(updated)
  }

  return (
    <AppContext.Provider value={{ groups, loading, createGroup, deleteGroup, addParticipant, addExpense, resetExpenses, updateGroup }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}