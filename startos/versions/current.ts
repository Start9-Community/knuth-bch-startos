import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.3.0:7',
  releaseNotes: {
    en_US:
      'Every part of the interface is now translated into Spanish, German, Polish, and French. The JSON-RPC interface now appears as soon as the JSON-RPC server is turned on, and the peer port now follows a network change, instead of both waiting for the next update. The generated JSON-RPC password is now cryptographically random.',
    es_ES:
      'Toda la interfaz está ahora traducida al español, alemán, polaco y francés. La interfaz JSON-RPC aparece en cuanto se activa el servidor JSON-RPC, y el puerto de pares sigue los cambios de red, en lugar de esperar ambos a la siguiente actualización. La contraseña JSON-RPC generada ahora es criptográficamente aleatoria.',
    de_DE:
      'Die gesamte Oberfläche ist jetzt auf Spanisch, Deutsch, Polnisch und Französisch übersetzt. Die JSON-RPC-Schnittstelle erscheint jetzt, sobald der JSON-RPC-Server eingeschaltet wird, und der Peer-Port folgt einem Netzwerkwechsel, statt dass beides bis zum nächsten Update wartet. Das erzeugte JSON-RPC-Passwort ist jetzt kryptografisch zufällig.',
    pl_PL:
      'Cały interfejs jest teraz przetłumaczony na hiszpański, niemiecki, polski i francuski. Interfejs JSON-RPC pojawia się natychmiast po włączeniu serwera JSON-RPC, a port węzłów podąża za zmianą sieci — zamiast czekać na następną aktualizację. Generowane hasło JSON-RPC jest teraz kryptograficznie losowe.',
    fr_FR:
      "Toute l'interface est désormais traduite en espagnol, allemand, polonais et français. L'interface JSON-RPC apparaît dès que le serveur JSON-RPC est activé, et le port pair-à-pair suit un changement de réseau, au lieu que les deux attendent la mise à jour suivante. Le mot de passe JSON-RPC généré est désormais cryptographiquement aléatoire.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
