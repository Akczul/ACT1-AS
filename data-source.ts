export const dataSourceConfig = {
  type: 'sqlite',
  database: 'data/app.sqlite',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
};