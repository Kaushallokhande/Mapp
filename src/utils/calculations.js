/**
 * participants: [{ id, name, balance }]
 * expenses: [
 *   {
 *     id, title, amount, paidBy, splitType: 'EQUAL'|'CUSTOM',
 *     splitWith: [participantId...],           // for EQUAL (subset of participants)
 *     customSplit: [{ id, amount }]           // for CUSTOM
 *   }
 * ]
 */

export function generateBalances(participants = [], expenses = []) {
  const balances = participants.reduce((acc, p) => {
    acc[p.id] = { ...p, balance: 0 }
    return acc
  }, {})

  for (const exp of expenses) {
    const amount = Number(exp.amount) || 0
    if (!amount) continue

    if (!balances[exp.paidBy]) {
      continue
    }
    if (exp.splitType === 'CUSTOM' && Array.isArray(exp.customSplit) && exp.customSplit.length > 0) {
      for (const s of exp.customSplit) {
        if (!balances[s.id]) continue
        const share = Number(s.amount) || 0
        balances[s.id].balance -= share
      }
      balances[exp.paidBy].balance += amount
    } else {
      const involved = Array.isArray(exp.splitWith) && exp.splitWith.length > 0 ? exp.splitWith : Object.keys(balances)
      const share = involved.length ? amount / involved.length : 0
      for (const pid of involved) {
        if (!balances[pid]) continue
        balances[pid].balance -= Number(share)
      }
      balances[exp.paidBy].balance += amount
    }
  }

  return Object.values(balances).map((p) => ({ ...p, balance: Number(p.balance.toFixed(2)) }))
}

export function settleDebts(participants = []) {
  const creditors = []
  const debtors = []
  for (const p of participants) {
    const bal = Number(p.balance || 0)
    if (bal > 0.009) creditors.push({ ...p, balance: bal })
    else if (bal < -0.009) debtors.push({ ...p, balance: bal })
  }
  creditors.sort((a, b) => b.balance - a.balance)
  debtors.sort((a, b) => a.balance - b.balance) 

  let i = 0
  let j = 0
  const tx = []
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]
    const debit = Math.abs(debtor.balance)
    const credit = creditor.balance
    const amount = Number(Math.min(debit, credit).toFixed(2))
    if (amount <= 0) break
    tx.push({ from: debtor.name, to: creditor.name, amount })
    debtor.balance += amount
    creditor.balance -= amount
    if (Math.abs(debtor.balance) < 0.01) i++
    if (Math.abs(creditor.balance) < 0.01) j++
  }

  return tx
}
