/**
 * Basic test setup - Ensures test environment is working
 * Diese Datei stellt sicher, dass die Test-Infrastruktur funktioniert
 */

import { describe, it, expect } from 'vitest'

describe('Test Environment', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true)
  })

  it('should support basic assertions', () => {
    const value = 'test'
    expect(value).toBeDefined()
    expect(value).toBe('test')
  })

  it('should support array operations', () => {
    const arr = [1, 2, 3]
    expect(arr).toHaveLength(3)
    expect(arr).toContain(2)
  })

  it('should support object operations', () => {
    const obj = { name: 'test', value: 42 }
    expect(obj).toBeDefined()
    expect(obj.name).toBe('test')
    expect(obj).toHaveProperty('value', 42)
  })
})
