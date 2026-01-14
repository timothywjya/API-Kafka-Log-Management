import { producer } from '../config/kafka-config.js';
import { decodeProgramID } from '../helper/hashids.js';

export const logApi = async (req, res) => {
    try {
        const { program_id, program_uid, endpoint, params, json_request, message, errormessage } = req.body;
        const realId = decodeProgramID('api', program_id);

        if (!realId) return res.status(400).json({ error: 'Invalid API Program Key' });

        const payload = {
            platform: 'apis',
            data: {
                api_program_id: realId,
                api_program_uid: program_uid,
                api_endpoint: endpoint,
                api_params: params,
                api_json_request: JSON.stringify(json_request),
                api_message: message,
                api_errormessage: errormessage,
                created_at: new Date()
            }
        };

        await producer.send({
            topic: 'system-logs',
            messages: [{ value: JSON.stringify(payload) }],
        });

        res.status(202).json({ status: 'success', message: 'API Log is being processed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};