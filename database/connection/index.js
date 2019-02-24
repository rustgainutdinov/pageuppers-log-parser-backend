const connect = {
  user: process.env.NODE_ENV === 'production' ? 'pu-manager-user' : 'postgres',//postgres
  host: 'localhost',
  database: process.env.NODE_ENV === 'production' ? 'pu-manager-db' : 'page-uppers' ,//page-uppers
  password: process.env.NODE_ENV === 'production' ? 'kjDf9434gsJK5698' : 'gv9y3ytsow',//gv9y3ytsow
  port: 5432
};

module.exports = connect;
