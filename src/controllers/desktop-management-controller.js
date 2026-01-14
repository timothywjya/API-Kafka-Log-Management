import { producer } from '../config/kafka.js';
import { decodeProgramID } from '../helper/hashids.js';

export const logDesktop = async (req, res) => {
    try {
        const { program_id, program_uid, branch_code, store_code, station, functions, message, errormessage } = req.body;

        const realId = decodeProgramID('desktop', program_id);
        if (!realId) return res.status(400).json({ error: 'Invalid Desktop Program Key' });

        const logPayload = {
            platform: 'desktops',
            data: {
                desktop_program_id: realId,
                desktop_program_uid: program_uid,
                desktop_branch_code: branch_code,
                desktop_store_code: store_code,
                desktop_station: station,
                desktop_functions: functions,
                desktop_message: message,
                desktop_errormessage: errormessage,
                created_at: new Date()
            }
        };

        await producer.send({
            topic: 'logging-system',
            messages: [{ value: JSON.stringify(logPayload) }],
        });

        res.status(202).json({ status: 'success', message: 'Desktop log queued' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};