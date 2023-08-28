require('dotenv').config();
require('dotenv').config({ path: `.env.local`, override: true });
import Logger from '@ptkdev/logger';
const options = {
  colors: true,
  debug: true,
  info: true,
  warning: true,
  error: true,
  sponsor: true,
  write: true,
  type: 'log',
  rotate: {
    size: '10M',
    encoding: 'utf8',
  },
  path: {
    // remember: add string *.log to .gitignore
    debug_log: './debug.log',
    error_log: './errors.log',
  },
};

//@ts-ignore
const logger = new Logger(options);

import fs from 'fs';
import { fetchHTML, extractJobs } from './utils';

/**
 * Main function to fetch and process job listings.
 * @throws Will log an error if any step in the process fails.
 */
async function main() {
  logger.info('Begin job listing fetch and process');

  try {
    const dom = await fetchHTML();
    const currentJobs = extractJobs(dom);

    let previousJobs: { [key: string]: Job } = {};
    if (fs.existsSync(process.env.FILE_PATH || '')) {
      previousJobs = JSON.parse(
        fs.readFileSync(process.env.FILE_PATH || '', 'utf-8')
      );
    }

    // Detect and log changes
    const newJobs = Object.keys(currentJobs).filter((id) => !previousJobs[id]);
    const removedJobs = Object.keys(previousJobs).filter(
      (id) => !currentJobs[id]
    );

    newJobs.length === 0
      ? logger.info('No jobs added')
      : newJobs.forEach((id) =>
          logger.info(
            `New job added: ${currentJobs[id].title} - ${currentJobs[id].region}`
          )
        );
    removedJobs.length === 0
      ? logger.info('No jobs removed')
      : removedJobs.forEach((id) =>
          logger.info(
            `Job removed: ${previousJobs[id].title} - ${previousJobs[id].region}`
          )
        );

    fs.writeFileSync(process.env.FILE_PATH || '', JSON.stringify(currentJobs));
  } catch (error) {
    logger.error(`An error occurred:, ${error}`);
  }
}

// Entry point
main();
