import {attachmentTypes,result,rpc,validateAttachment,type DB,type Message} from './data.ts';
export type OutgoingMessage={id:string;body:string;file?:File;reply?:Message;created_at:string;status:'sending'|'failed'|'sent';error?:string};
/** Keep the original id and attachment path across uncertain responses and retries. */
export async function deliverMessage(db:DB,circleID:string,senderID:string,message:OutgoingMessage){
  const existing=await result<{id:string}[]>(db.from('circle_messages').select('id').eq('circle_id',circleID).eq('sender_id',senderID).eq('id',message.id));
  if(existing.length)return;
  let path:string|null=null;
  const file=message.file;
  if(file){
    validateAttachment(file);
    path=`${circleID}/${senderID}/${message.id}/attachment.${attachmentTypes[file.type]}`;
    const upload=await db.storage.from('circle-attachments').upload(path,file,{contentType:file.type,upsert:false});
    if(upload.error&&!['409','Duplicate'].includes(String((upload.error as {statusCode?:string;error?:string}).statusCode??(upload.error as {error?:string}).error)))throw upload.error;
  }
  await rpc(db,'send_circle_message',{p_circle_id:circleID,p_id:message.id,p_body:message.body,p_reply_to:message.reply?.id??null,p_attachment_path:path,p_attachment_name:file?.name??null,p_attachment_type:file?.type??null,p_attachment_bytes:file?.size??null});
}
