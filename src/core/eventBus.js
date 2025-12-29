/**
 * Event-Bus für Agent-Kommunikation
 * Ermöglicht lose Kopplung zwischen Modulen
 */
class EventBus {
  constructor() {
    this.events = {}
  }

  /**
   * Event auslösen
   * @param {string} eventName - Name des Events
   * @param {any} data - Payload-Daten
   */
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(data))
    }
  }

  /**
   * Event-Listener registrieren
   * @param {string} eventName - Name des Events
   * @param {Function} callback - Callback-Funktion
   * @returns {Function} Unsubscribe-Funktion
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)

    // Rückgabe einer Unsubscribe-Funktion
    return () => this.off(eventName, callback)
  }

  /**
   * Event-Listener entfernen
   * @param {string} eventName - Name des Events
   * @param {Function} callback - Callback-Funktion
   */
  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback)
    }
  }

  /**
   * Einmalig auf Event hören
   * @param {string} eventName - Name des Events
   * @param {Function} callback - Callback-Funktion
   */
  once(eventName, callback) {
    const unsubscribe = this.on(eventName, (data) => {
      callback(data)
      unsubscribe()
    })
  }
}

export const eventBus = new EventBus()
export default eventBus
