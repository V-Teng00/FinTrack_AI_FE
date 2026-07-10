export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK) === 'true'

export const mockReceipts = [
  { id: 1, store_name: '99 Speedmart', date: '2026-07-08', total: 23.4, category: 'Groceries', currency: 'MYR', thumbnail_url: null },
  { id: 2, store_name: 'Mydin', date: '2026-07-06', total: 87.15, category: 'Groceries', currency: 'MYR', thumbnail_url: null },
  { id: 3, store_name: 'Old Town White Coffee', date: '2026-07-05', total: 18.9, category: 'Food & Drink', currency: 'MYR', thumbnail_url: null },
  { id: 4, store_name: 'Petronas', date: '2026-07-03', total: 60.0, category: 'Transport', currency: 'MYR', thumbnail_url: null },
  { id: 5, store_name: 'Watsons', date: '2026-07-01', total: 42.5, category: 'Health', currency: 'MYR', thumbnail_url: null },
]

export const mockSummary = {
  total_spending: 231.95,
  income: 4500,
  savings: 4268.05,
  by_category: [
    { category: 'Groceries', amount: 110.55 },
    { category: 'Food & Drink', amount: 18.9 },
    { category: 'Transport', amount: 60.0 },
    { category: 'Health', amount: 42.5 },
  ],
  daily: [
    { date: '07-01', amount: 42.5 },
    { date: '07-03', amount: 60.0 },
    { date: '07-05', amount: 18.9 },
    { date: '07-06', amount: 87.15 },
    { date: '07-08', amount: 23.4 },
  ],
}

export function mockChatReply(message) {
  const m = message.toLowerCase()
  if (m.includes('food') || m.includes('makan')) {
    return "You've spent RM18.90 on Food & Drink this month, across 1 receipt (Old Town White Coffee)."
  }
  if (m.includes('save') || m.includes('saving')) {
    return "You've saved RM4,268.05 this month — that's about 95% of your income. Groceries are your biggest spend category at RM110.55."
  }
  if (m.includes('most') || m.includes('top') || m.includes('biggest')) {
    return 'Your top spending category this month is Groceries at RM110.55, mostly from Mydin and 99 Speedmart.'
  }
  return "This is a mock reply — connect the /api/chat endpoint (text-to-SQL over your receipts table) to get real, grounded answers."
}
