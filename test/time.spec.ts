import * as time from '../api/time'

describe('Test time API', () => {
  it('sould get time', async () => {
    const timeResponse = await time.time()
    expect(timeResponse.time).toBeDefined()
  })
})
