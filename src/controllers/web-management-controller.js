import { producer } from '../config/kafka.js';
import { decodeProgramID } from '../helper/hashids.js';

export const logWeb = async (req, res) => {
    try {
        const { program_id, program_uid, endpoint, params, json_request, message, errormessage } = req.body;

        const realId = decodeProgramID('web', program_id);
        if (!realId) return res.status(400).json({ error: 'Invalid Web Program Key' });

        const logPayload = {
            platform: 'webs',
            data: {
                web_program_id: realId,
                web_program_uid: program_uid,
                web_endpoint: endpoint,
                web_params: params,
                web_json_request: JSON.stringify(json_request),
                web_message: message,
                web_errormessage: errormessage,
                created_at: new Date()
            }
        };

        await producer.send({
            topic: 'logging-system',
            messages: [{ value: JSON.stringify(logPayload) }],
        });

        res.status(202).json({ status: 'success', message: 'Log is being processed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};