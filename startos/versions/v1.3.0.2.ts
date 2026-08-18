import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { knuthConf } from '../fileModels/knuth.conf'
import { storeJson } from '../fileModels/store.json'
import { Network, networkDbDir, networkHostsFile, rootDir } from '../utils'
import { sdk } from '../sdk'
import { mainMounts } from '../mounts'

export const v_1_3_0_2 = VersionInfo.of({
  version: '1.3.0:2',
  releaseNotes: {
    en_US:
      'Each network now keeps its own chain data and peer list, so switching between mainnet and a test network no longer reuses one chainstate or one pool of banned peers. Fixes a test network stuck at 0 peers after a switch, and makes Delete Peer List and Delete Test Network Data act on the right files.',
    es_ES:
      'Cada red mantiene ahora sus propios datos de cadena y su lista de pares, de modo que cambiar entre mainnet y una red de prueba ya no reutiliza un único chainstate ni una única lista de pares baneados. Corrige una red de prueba atascada en 0 pares tras un cambio y hace que Eliminar lista de pares y Eliminar datos de redes de prueba actúen sobre los archivos correctos.',
    de_DE:
      'Jedes Netzwerk hat jetzt eigene Chain-Daten und eine eigene Peer-Liste, sodass ein Wechsel zwischen Mainnet und einem Testnetzwerk nicht mehr denselben Chainstate oder dieselbe Sperrliste weiterverwendet. Behebt ein Testnetzwerk, das nach einem Wechsel bei 0 Peers hängen blieb, und lässt „Peer-Liste löschen" und „Testnetzwerk-Daten löschen" auf die richtigen Dateien wirken.',
    pl_PL:
      'Każda sieć ma teraz własne dane łańcucha i własną listę węzłów, więc przełączanie między mainnetem a siecią testową nie używa już wspólnego chainstate ani wspólnej listy zablokowanych węzłów. Naprawia sieć testową utkniętą na 0 węzłach po przełączeniu i sprawia, że „Usuń listę węzłów" oraz „Usuń dane sieci testowych" działają na właściwych plikach.',
    fr_FR:
      'Chaque réseau conserve désormais ses propres données de chaîne et sa propre liste de pairs : passer de mainnet à un réseau de test ne réutilise plus un même chainstate ni une même liste de pairs bannis. Corrige un réseau de test bloqué à 0 pair après un changement, et fait agir « Supprimer la liste des pairs » et « Supprimer les données des réseaux de test » sur les bons fichiers.',
  },
  migrations: {
    up: async ({ effects }) => {
      const store = await storeJson.read().once()
      const network: Network = store?.network ?? 'mainnet'
      const newDir = networkDbDir(network)
      const hostsFile = networkHostsFile(network)

      await knuthConf.merge(effects, {
        'db.directory': newDir,
        'net.hosts_file': hostsFile,
      })

      // Drop the root-cwd peers.dat (pre-fix location) and any flat
      // /data/peers.dat when the active network is a testnet so chipnet does
      // not inherit mainnet bans.
      await sdk.SubContainer.withTemp(
        effects,
        { imageId: 'knuth' },
        mainMounts,
        'migrate-network-datadir',
        async (sub) => {
          await sub.exec(['rm', '-f', '/peers.dat'])
          if (network !== 'mainnet') {
            // Leave /data/blockchain alone (mainnet data). Fresh testnet dir.
            await sub.exec(['rm', '-f', `${rootDir}/peers.dat`])
            // If a previous broken package put chipnet data in /data/blockchain
            // while store says chipnet, do not move it — start clean under
            // /data/<network>. Operator can delete mainnet via package reinstall.
          }
        },
      )
    },
    down: IMPOSSIBLE,
  },
})
