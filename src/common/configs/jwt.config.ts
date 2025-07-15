import { registerAs } from '@nestjs/config';
export const JwtConfig = registerAs('jwt', () => ({
    admin: {
        secret: process.env.JWT_ADMIN_SECRET || 'admin_secret',
        audience: process.env.JWT_ADMIN_TOKEN_AUDIENCE,
        issuer: process.env.JWT_ADMIN_TOKEN_ISSUER,
        accessTokenTtl: parseInt(process.env.JWT_ADMIN_ACCESS_TOKEN_TTL ?? '3600', 10),
        refreshTokenTtl: parseInt(process.env.JWT_ADMIN_REFRESH_TOKEN_TTL ?? '86400', 10),
    },
    core: {
        secret: process.env.JWT_CORE_SECRET,
        audience: process.env.JWT_CORE_TOKEN_AUDIENCE,
        issuer: process.env.JWT_CORE_TOKEN_ISSUER,
        accessTokenTtl: parseInt(process.env.JWT_CORE_ACCESS_TOKEN_TTL ?? '3600', 10),
        refreshTokenTtl: parseInt(process.env.JWT_CORE_REFRESH_TOKEN_TTL ?? '86400', 10),
    }
}));