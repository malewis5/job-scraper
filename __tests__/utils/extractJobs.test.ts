import { extractJobs } from '../../src/utils' // Replace with the actual path

describe('extractJobs function', () => {
  beforeEach(() => {
    process.env.BASE_CLASS_NAME = 'base-class'
    process.env.TITLE = 'Engineer'
    process.env.REGION = 'San Francisco'
  })

  it('should extract jobs based on the provided DOM and conditions', () => {
    const realDom = `
      <html>
        <body>
          <ul class="base-class">
            <li><h3>Engineer</h3><h4>San Francisco</h4></li>
            <li><h3>Designer</h3><h4>New York</h4></li>
          </ul>
        </body>
      </html>
    `

    const result = extractJobs(realDom)

    // Check if the result contains only the jobs that meet the conditions
    const jobHashes = Object.keys(result)
    expect(jobHashes.length).toBe(1)

    const firstHash = jobHashes[0]
    expect(result[firstHash]).toEqual({
      title: 'Engineer',
      region: 'San Francisco'
    })
  })

  it('should return an empty object if no matching jobs are found', () => {
    const realDom = `
      <html>
        <body>
          <ul class="base-class">
            <li><h3>Designer</h3><h4>New York</h4></li>
          </ul>
        </body>
      </html>
    `

    const result = extractJobs(realDom)
    expect(result).toEqual({})
  })

  it('should return an empty object if the job list is not found', () => {
    const realDom = '<html><body></body></html>'
    const result = extractJobs(realDom)
    expect(result).toEqual({})
  })
})
