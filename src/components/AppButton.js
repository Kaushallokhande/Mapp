import React from 'react'
import { Button } from 'react-native-paper'

export default function AppButton({ children, onPress, mode = 'contained', style }) {
  return (
    <Button mode={mode} onPress={onPress} style={style} contentStyle={{ paddingVertical: 8 }}>
      {children}
    </Button>
  )
}