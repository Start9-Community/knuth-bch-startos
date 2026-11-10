import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { knuthConf } from '../fileModels/knuth.conf'

// kth falls back to a generated .cookie file when rpc.user / rpc.password are
// empty, so clearing them does not lock the node out — it just revokes the
// shared password that dependent services were using.
export const deleteRpcCredentials = sdk.Action.withoutInput(
  'delete-rpc-credentials',

  async ({ effects: _effects }) => ({
    name: i18n('Delete RPC Credentials'),
    description: i18n('Clear the stored JSON-RPC username and password.'),
    warning: i18n(
      'Any wallet, indexer, or miner configured with these credentials stops working until you generate new ones.',
    ),
    allowedStatuses: 'any' as const,
    group: 'Credentials',
    visibility: 'enabled' as const,
  }),

  async ({ effects }) => {
    await storeJson.merge(effects, { rpcUser: '', rpcPassword: '' })
    await knuthConf.merge(effects, { 'rpc.user': '', 'rpc.password': '' })
    await effects.restart()

    return {
      version: '1' as const,
      title: i18n('RPC Credentials Deleted'),
      message: i18n(
        'The JSON-RPC username and password have been cleared and the node is restarting. Knuth falls back to a generated cookie file until you create new credentials.',
      ),
      result: null,
    }
  },
)
