require('module-alias/register')
require('dotenv').config()
require('dotenv').config({ path: `.env.local`, override: true })

import { extractJobs, fetchHTML } from '@src/utils'
import fs from 'fs'
import { logger } from './logger'

/**
 * Main function to fetch and process job listings.
 * @throws Will log an error if any step in the process fails.
 */
export async function main() {
  logger.info('Begin job listing fetch and process')

  try {
    const dom = await fetchHTML()
    const currentJobs = extractJobs(dom)

    logger.info(`Extracted ${Object.keys(currentJobs).length} current jobs`)

    let previousJobs: { [key: string]: Job } = {}
    if (fs.existsSync(process.env.FILE_PATH || '')) {
      previousJobs = JSON.parse(fs.readFileSync(process.env.FILE_PATH || '', 'utf-8'))
    }

    // Detect and log changes
    const newJobs = Object.keys(currentJobs).filter((id) => !previousJobs[id])
    const removedJobs = Object.keys(previousJobs).filter((id) => !currentJobs[id])

    newJobs.length === 0
      ? logger.info('No jobs added')
      : newJobs.forEach((id) =>
          logger.info(`New job added: ${currentJobs[id].title} - ${currentJobs[id].region}`)
        )
    removedJobs.length === 0
      ? logger.info('No jobs removed')
      : removedJobs.forEach((id) =>
          logger.info(`Job removed: ${previousJobs[id].title} - ${previousJobs[id].region}`)
        )

    fs.writeFileSync(process.env.FILE_PATH || '', JSON.stringify(currentJobs))

    logger.info('End job listing fetch and process')
  } catch (error) {
    logger.error(`An error occurred:, ${error}`)
  }
}

// Entry point
main()
