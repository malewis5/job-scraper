import { logger } from '@src/logger'
import { createHash } from 'crypto'
import { JSDOM } from 'jsdom'

/**
 * Fetches the HTML document from the given URL.
 * @returns {Promise<string>} HTML as a string.
 * @throws Will throw an error if the network request is not ok.
 */
export async function fetchHTML(): Promise<string> {
  const response = await fetch(process.env.URL || '')
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`)
  }
  return await response.text()
}

/**
 * Extracts relevant job listings from the HTML document.
 * @param {string} dom - The HTML document as a string.
 * @returns { { [key: string]: Job } } An object containing the filtered jobs.
 */
export function extractJobs(dom: string): { [key: string]: Job } {
  const vercelDocument = new JSDOM(dom)
  const jobList = vercelDocument.window.document.querySelector(
    `ul[class^="${process.env.BASE_CLASS_NAME}"]`
  )
  let jobs: { [key: string]: Job } = {}
  if (jobList) {
    const liChildren = Array.from(jobList.querySelectorAll('li')).filter((li) => {
      const h3Text = li.querySelector('h3')?.textContent || ''
      const h4Text = li.querySelector('h4')?.textContent || ''
      return h3Text.includes(process.env.TITLE || '') && h4Text.includes(process.env.REGION || '')
    })

    liChildren.forEach((li) => {
      const h3Text = li.querySelector('h3')?.textContent || 'N/A'
      const h4Text = li.querySelector('h4')?.textContent || 'N/A'
      const hash = createHash('md5')
        .update(h3Text + h4Text)
        .digest('hex')
      jobs[hash] = { title: h3Text, region: h4Text }
    })
  } else {
    logger.warning('No job listings found. Consider updating the class name.')
  }

  return jobs
}
