import {
  StreamedMessageText,
  useMessageContext,
  useMessageTextStreaming,
} from "stream-chat-react";
export default function MyMessage() {
  const { message, renderText } = useMessageContext();
  return <StreamedMessageText message={message} renderText={renderText} />;
}
