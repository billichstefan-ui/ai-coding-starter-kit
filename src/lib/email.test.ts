import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockSend = vi.hoisted(() => vi.fn())

vi.mock('resend', () => {
  const MockResend = vi.fn(function (this: unknown) {
    return { emails: { send: mockSend } }
  })
  return { Resend: MockResend }
})

import { sendDailyDigest } from './email'

describe('sendDailyDigest', () => {
  const ORIGINAL_ENV = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = 'test-key'
    process.env.NORA_EMAIL_RECIPIENT = 'stefan@test.com'
    mockSend.mockResolvedValue({ data: { id: 'msg-1' }, error: null })
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it('sendet eine E-Mail wenn count > 0', async () => {
    await sendDailyDigest(3)
    expect(mockSend).toHaveBeenCalledOnce()
    const call = mockSend.mock.calls[0][0]
    expect(call.to).toBe('stefan@test.com')
    expect(call.subject).toContain('3')
    expect(call.html).toContain('Dashboard öffnen')
  })

  it('sendet keine E-Mail wenn count = 0', async () => {
    await sendDailyDigest(0)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('überspringt den Versand wenn RESEND_API_KEY fehlt', async () => {
    delete process.env.RESEND_API_KEY
    await sendDailyDigest(3)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('verwendet NORA_EMAIL_RECIPIENT als Empfänger', async () => {
    process.env.NORA_EMAIL_RECIPIENT = 'custom@example.com'
    await sendDailyDigest(1)
    expect(mockSend.mock.calls[0][0].to).toBe('custom@example.com')
  })

  it('fällt auf billichstefan@gmail.com zurück wenn NORA_EMAIL_RECIPIENT fehlt', async () => {
    delete process.env.NORA_EMAIL_RECIPIENT
    await sendDailyDigest(2)
    expect(mockSend.mock.calls[0][0].to).toBe('billichstefan@gmail.com')
  })

  it('wirft keinen Fehler wenn Resend einen Fehler zurückgibt', async () => {
    mockSend.mockRejectedValue(new Error('Resend down'))
    await expect(sendDailyDigest(1)).rejects.toThrow('Resend down')
  })

  it('benutzt den singulären Betreff für 1 Vorschlag', async () => {
    await sendDailyDigest(1)
    expect(mockSend.mock.calls[0][0].subject).toContain('1 neue BizDev-Vorschlag ')
  })
})
