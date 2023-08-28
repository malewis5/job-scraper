// Mocking the fetch function globally
global.fetch = jest.fn()

describe('fetchHTML function', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks()
    process.env.URL = 'https://vercel.com/careers?department=Engineering'
  })

  it('should return HTML text if the network request is ok', async () => {
    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue('<html>...</html>')
    }

    //@ts-ignore
    global.fetch.mockResolvedValue(mockResponse)

    const { fetchHTML } = require('../../src/utils') // Replace with actual path
    const result = await fetchHTML()

    expect(global.fetch).toHaveBeenCalledWith('https://vercel.com/careers?department=Engineering')
    expect(result).toBe('<html>...</html>')
  })

  it('should throw an error if the network request is not ok', async () => {
    const mockResponse = {
      ok: false,
      statusText: 'Not Found'
    }

    //@ts-ignore
    global.fetch.mockResolvedValue(mockResponse)

    const { fetchHTML } = require('../../src/utils') // Replace with actual path

    await expect(fetchHTML()).rejects.toThrow('Network response was not ok: Not Found')
  })
})
