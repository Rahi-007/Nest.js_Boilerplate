import { defineConfig } from '@mikro-orm/postgresql';
import { User } from '../users/user.entity';


const isProd = process.env.NODE_ENV === 'production';


export default defineConfig({
entities: [User],
dbName: undefined, // comes from URL
clientUrl: process.env.DATABASE_URL,
driverOptions: {},
debug: !isProd,
migrations: {
tableName: 'mikro_orm_migrations',
path: 'migrations',
glob: '!(*.d).{js,ts}',
},
});