import db from '../config/database.js';
import { encodeOutputID, searchIdAcrossPlatforms } from '../helper/hashids.js';

export const getProgramDetail = async (req, res) => {
    const { id, name, group_id, type_id } = req.query;

    try {
        let query = db('programs')
            .join('program_types', 'programs.program_type_id', '=', 'program_types.id')
            .join('program_groups', 'programs.program_group_id', '=', 'program_groups.id')
            .select(
                'programs.id as id_programs',
                'programs.program_name',
                'programs.program_type_id as id_types',
                'program_types.program_type',
                'programs.program_group_id as id_groups',
                'program_groups.group_name'
            );

        if (id) {
            const result = searchIdAcrossPlatforms(id);
            if (!result) return res.status(400).json({ error: 'Invalid Encrypted ID Format' });
            query = query.where('programs.id', result.id);
        }

        if (name) {
            query = query.where('programs.program_name', 'like', `%${name}%`);
        }

        if (group_id) {
            const decodedGroup = searchIdAcrossPlatforms(group_id); // Menggunakan utilitas yang sama
            if (decodedGroup) query = query.where('programs.program_group_id', decodedGroup.id);
        }

        if (type_id) {
            const decodedType = searchIdAcrossPlatforms(type_id);
            if (decodedType) query = query.where('programs.program_type_id', decodedType.id);
        }

        const rawData = await query;

        const transformedData = rawData.map(item => {
            let typeKey;
            const dbType = item.program_type.toLowerCase();

            if (dbType === 'web') {
                typeKey = 'web';
            } else if (dbType === 'api') {
                typeKey = 'api';
            } else if (dbType === 'desktop') {
                typeKey = 'desktop';
            } else if (dbType === 'mobile android') {
                typeKey = 'apps';
            } else {
                typeKey = 'program';
            }

            return {
                ids: encodeOutputID(typeKey, item.id_programs),
                program_name: item.program_name,
                id_types: encodeOutputID('type', item.id_types),
                program_type: item.program_type,
                id_groups: encodeOutputID('group', item.id_groups),
                group_name: item.group_name
            };
        });

        res.json({
            status: 'success',
            total: transformedData.length,
            data: transformedData
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};