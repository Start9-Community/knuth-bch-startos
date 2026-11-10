import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import { storeJson } from '../../fileModels/store.json'
import {
  internalRpcPort,
  Network,
  networkPorts,
  networkDbDir,
  networkHostsFile,
} from '../../utils'
import { knuthConf } from '../../fileModels/knuth.conf'

const { InputSpec, Value } = sdk

// Select order must match BCHN exactly (mainnet → … → chipnet → regtest).
const networkSpec = InputSpec.of({
  network: Value.select({
    name: i18n('Network'),
    description: i18n(
      'Bitcoin Cash network to connect to. Each network keeps its own chain data and peer list.',
    ),
    warning: i18n(
      'Switching networks restarts the node and syncs the new network from scratch. Data for the network you are leaving is kept.',
    ),
    values: {
      mainnet: i18n('Mainnet'),
      testnet3: i18n('Testnet3 (legacy test network)'),
      testnet4: i18n('Testnet4 (light-weight test network)'),
      scalenet: i18n('Scalenet (high-throughput test network)'),
      chipnet: i18n('Chipnet (upgrade / CHIP staging)'),
      regtest: i18n('Regtest (local testing only)'),
    },
    default: 'mainnet',
  }),
})

export const networkConfig = sdk.Action.withInput(
  'network-config',
  async ({ effects: _effects }) => ({
    name: i18n('Network'),
    description: i18n(
      'Select the Bitcoin Cash network. The JSON-RPC and peer ports change to match.',
    ),
    warning: i18n(
      'Switching networks restarts the node and syncs the new network from scratch. Data for the network you are leaving is kept.',
    ),
    allowedStatuses: 'any' as const,
    group: 'Configuration',
    visibility: 'enabled' as const,
  }),
  networkSpec,
  async ({ effects: _effects }) => {
    const store = await storeJson.read().once()
    return { network: (store?.network ?? 'mainnet') as Network }
  },
  async ({ effects, input }) => {
    const store = await storeJson.read().once()
    const current = store?.network ?? 'mainnet'
    const next = input.network as Network
    if (current === next) {
      return {
        version: '1' as const,
        title: i18n('Network Unchanged'),
        message: i18n('Knuth is already configured for ${network}.', {
          network: next,
        }),
        result: null,
      }
    }
    // BCHN clears fullySynced on network switch; keep the same store key for dependents.
    await storeJson.merge(effects, { network: next, fullySynced: false })

    // kth.cfg pins ports, chain directory and hosts file explicitly — without
    // rewriting them the node would keep the previous network's ports and reuse
    // its chainstate/peer ban list.
    const { peer: nextPeerPort } = networkPorts[next]
    await knuthConf.merge(effects, {
      'net.inbound_port': nextPeerPort,
      'net.hosts_file': networkHostsFile(next),
      'db.directory': networkDbDir(next),
      'rpc.port': internalRpcPort,
    })

    await effects.restart()
    return {
      version: '1' as const,
      title: i18n('Network Updated'),
      message: i18n(
        'Switched Knuth from ${from} to ${to}. Restarting automatically.',
        {
          from: current,
          to: next,
        },
      ),
      result: null,
    }
  },
)
