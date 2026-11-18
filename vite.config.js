import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // Keep authored spell text and mechanical profiles independently cacheable.
            {
              name: 'spell-definitions',
              test: /[\\/]sanguine-engine[\\/]src[\\/]spells[\\/]definitions[\\/].+\.json$/,
            },
            {
              name: 'spell-profiles',
              test: /[\\/]sanguine-engine[\\/]src[\\/]spells[\\/]profiles[\\/]data\.json$/,
            },
          ],
        },
      },
    },
  },
})
