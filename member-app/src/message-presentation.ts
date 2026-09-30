import type {Message,Profile} from './data.ts';
import type {OutgoingMessage} from './message-delivery.ts';

export type PresentedMessage = Message & {outgoing?:OutgoingMessage};

/** One keyed row from the first local send through the server acknowledgement.
 * Server sequence still determines delivery order; local time is display only.
 */
export function presentMessages(messages:Message[],outbox:OutgoingMessage[],profile:Pick<Profile,'id'|'name'>,circleID:string,localTimes:ReadonlyMap<string,string>):PresentedMessage[]{
  const confirmedIDs=new Set(messages.map(message=>message.id));
  return [
    ...messages.map(message=>({...message,created_at:localTimes.get(message.id)??message.created_at})),
    ...outbox.filter(message=>!confirmedIDs.has(message.id)).map(message=>({
      id:message.id,seq:0,circle_id:circleID,sender_id:profile.id,sender_name:profile.name,
      body:message.body,created_at:message.created_at,
      reply_to:message.reply?.id??null,reply_body:message.reply?.body??null,reply_sender:message.reply?.sender_name??null,
      attachment_path:null,attachment_name:null,attachment_type:null,
      edited_at:null,deleted_at:null,reactions:[],moderation_status:'approved',revision:0,
      outgoing:message,
    })),
  ];
}
