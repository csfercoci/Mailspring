import { Thread } from '../models/thread';

/**
 * Applies the user's selected sort order to a database query for threads.
 * Reads from AppEnv.config.get('core.threadList.sortOrder').
 * 
 * @param query - The database query to apply sorting to
 * @param isSent - Whether this is a sent folder (uses lastMessageSentTimestamp instead of received)
 */
export function applySortOrderToQuery(query: any, isSent: boolean = false) {
  const sortOrder = AppEnv.config.get('core.threadList.sortOrder') || 'date';

  switch (sortOrder) {
    case 'subject':
      query.order(Thread.attributes.subject.ascending());
      break;
    case 'contact':
      // Sort by participants is complex since it's a collection.
      // As a practical approach, we'll sort by first message timestamp
      // which often correlates with the primary correspondent
      query.order(Thread.attributes.firstMessageTimestamp.descending());
      break;
    case 'size':
      // Sort by attachment count as a proxy for thread size
      query.order(Thread.attributes.attachmentCount.descending());
      break;
    case 'date':
    default:
      // Default to date sorting
      if (isSent) {
        query.order(Thread.attributes.lastMessageSentTimestamp.descending());
      } else {
        query.order(Thread.attributes.lastMessageReceivedTimestamp.descending());
      }
      break;
  }
}
