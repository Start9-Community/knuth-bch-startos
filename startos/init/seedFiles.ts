import { sdk } from '../sdk'
import { knuthConf } from '../fileModels/knuth.conf'
import { storeJson } from '../fileModels/store.json'
import {
  generateRpcPassword,
  internalRpcPort,
  networkPorts,
  networkDbDir,
  networkHostsFile,
  Network,
  rpcUser,
} from '../utils'

// Seed once on install so the credential stays stable across updates.
export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  const rpcPassword = generateRpcPassword()

  await storeJson.merge(effects, {
    network: 'mainnet',
    ipcEnabled: true,
    utxozEnabled: true,
    torEnabled: false,
    rpcEnabled: false,
    rpcUser,
    rpcPassword,
  })

  // rpc.bind must be explicit — kth defaults to 127.0.0.1 (unreachable cross-container).
  // net.hosts_file under /data — kth defaults peers.dat to process CWD (/).
  // db.directory — BCHN-style: mainnet /data/blockchain, testnets /data/<net>.
  const network: Network = 'mainnet'
  const { peer: peerPort } = networkPorts[network]
  await knuthConf.merge(effects, {
    'net.inbound_port': peerPort,
    'net.hosts_file': networkHostsFile(network),
    'db.directory': networkDbDir(network),
    'db.db_mode': 'full',
    'rpc.bind': '127.0.0.1',
    'rpc.port': internalRpcPort,
    'rpc.user': rpcUser,
    'rpc.password': rpcPassword,
    'rpc.enabled': false,
  })
})
