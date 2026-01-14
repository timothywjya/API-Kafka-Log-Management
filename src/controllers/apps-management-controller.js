import { producer } from '../config/kafka-config.js';
import { decodeProgramID } from '../helper/hashids.js';

export const logApps = async (req, res) => {
  try {
    const { program_id, program_uid, endpoint, params, json_request, message, errormessage } = req.body;

    const realId = decodeProgramID('apps', program_id);
    if (!realId) return res.status(400).json({ error: 'Invalid Apps Program Key' });

    const logPayload = {
      platform: 'apps',
      data: {
        apps_program_id: realId,
        apps_program_uid: program_uid,
        apps_endpoint: endpoint,
        apps_params: params,
        apps_json_request: JSON.stringify(json_request),
        apps_message: message,
        apps_errormessage: errormessage,
        created_at: new Date()
      }
    };

    await producer.send({
      topic: 'logging-system',
      messages: [{ value: JSON.stringify(logPayload) }],
    });

    res.status(202).json({ status: 'success', message: 'Apps log queued' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};