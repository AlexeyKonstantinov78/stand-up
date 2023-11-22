import { sendData, sendError } from './send.js';

export const handleComediantsRequest = async (eq, res, comedians, segments) => {
  
  if (segments.length === 2) {
    const comedian = comedians.find((c) => c.id === segments[1]);
  
    if (!comedian) {
      sendError(res, 404, 'Stendup комик не найден');
      return;
    }
  
    sendData(res, comedian);
    return;
  }
  
  sendData(res, comedians);
};