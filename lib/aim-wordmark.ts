/**
 * The header wordmark. A is Appetites, I is Intrinsic Motivation, M is Mimetic Desire.
 * Favicons are built from these paths so the letterforms cannot drift from the header.
 */
export class AimWordmark {
  static readonly viewBox = '-18 249 1738 738'

  static readonly frame = { x: -18, y: 249, width: 1738, height: 738 }

  static readonly letters = {
    appetites:
      'M249 699 342 437H344L434 699ZM264 261 -6 975H152L208 816H475L529 975H692L425 261Z',
    intrinsic: 'M699 261V975H856V261Z',
    mimetic:
      'M939 261V975H1086V474H1088L1263 975H1384L1559 469H1561V975H1708V261H1487L1329 752H1327L1160 261Z'
  } as const
}
