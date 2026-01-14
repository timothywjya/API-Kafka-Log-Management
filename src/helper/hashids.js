import dotenv from 'dotenv';
import Hashids from 'hashids';
dotenv.config();

const MIN_LENGTH = 12;

const hashes = {
    program: new Hashids(process.env.SALT_PROGRAM || 'p-salt', MIN_LENGTH),
    type: new Hashids(process.env.SALT_TYPE || 't-salt', MIN_LENGTH),
    group: new Hashids(process.env.SALT_GROUP || 'g-salt', MIN_LENGTH),

    desktop: new Hashids(process.env.SALT_DESKTOP || 'd-salt', MIN_LENGTH),
    web: new Hashids(process.env.SALT_WEB || 'w-salt', MIN_LENGTH),
    api: new Hashids(process.env.SALT_API || 'a-salt', MIN_LENGTH),
    apps: new Hashids(process.env.SALT_APPS || 'm-salt', MIN_LENGTH)
};

export const encodeOutputID = (category, id) => {
    if (!hashes[category]) return null;
    return hashes[category].encode(id);
};


export const decodeProgramID = (category, hash) => {
    if (!hash || !hashes[category]) return null;

    const decoded = hashes[category].decode(hash);

    return decoded.length > 0 ? decoded[0] : null;
};

export const searchIdAcrossPlatforms = (hash) => {
    const categories = ['web', 'api', 'apps', 'desktop'];
    for (const cat of categories) {
        const result = decodeProgramID(cat, hash);
        if (result) return { id: result, platform: cat };
    }
    return null;
};