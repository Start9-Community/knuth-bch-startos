import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_1_3_0_1 } from './v1.3.0.1'
import { v_1_3_0_2 } from './v1.3.0.2'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_1_3_0_2, v_1_3_0_1],
})
