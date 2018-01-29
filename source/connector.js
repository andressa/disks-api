const environment = process.env.NODE_ENV || 'dev';
const config = require("../config/" + environment + ".js");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.username,
  password: config.mysql.password,
  port: config.mysql.port,
  database: config.mysql.database
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

module.exports = {
  "delete_disk_by_id": (disk_id, next) => {
    connection.query(`DELETE FROM disk WHERE id=` + disk_id +`;`);
    connection.query(`DELETE FROM collection_disks WHERE disk_id=`+ disk_id + `;`);

    next(null, true);
  },
  "delete_disk": (data) => {
    connection.query(`
      SELECT id FROM disk WHERE
        name='`+ data['name'] +`' AND
        producer='`+ data['producer'] +`' AND
        year=`+ data['year'] +` AND
        singer='`+ data['singer'] +`';
      `,
      function(err, result) {
        connection.query('DELETE FROM disk WHERE id=' + result[0].id);
        connection.query('DELETE FROM collection_disks WHERE disk_id='+ result[0].id);
      }
    );
  },
  "is_authorized": (token, next) => {
    connection.query(
      "SELECT id FROM user WHERE authorization='"+token+"';",
      function(err, result) {
        if (err) next(err, null);
        var is_valid = false;
        if (result.length === 1)
          is_valid = true;
        
        next(null, is_valid);
      }
    );
  },
  'get_user_collections': (token, next) => {
    connection.query(`
       SELECT
        collection.id, collection.name
       FROM
        collection, user
       WHERE
        collection.user_id=user.id AND user.authorization='`+ token +`';
      `,
      function(err, result) {
        if (err) next(err, null);
        var collections = []
        for (var row=0; row < result.length; row++) {
          collections.push(
            {
              id: result[row].id,
              name: result[row].name
            }
          )
        };
        next(null, collections);
      }
    );
  },
  'is_valid_collection': (token, collection_id, next) => {
    connection.query(`
      SELECT
        count(1) as number_of_collections
      FROM
         collection, user
      WHERE
        collection.user_id=user.id AND
        user.authorization='`+ token +`' AND
        collection.id=`+ collection_id +`;
      `,
      function(err, result) {
        var is_valid = true;
        if (result[0].number_of_collections === 0)
          is_valid = false;
        next(null, is_valid)
      }
    );
  },
  'is_valid_disk': (token, disk_id, next) => {
    connection.query(`
        SELECT
          count(1) as number_of_disks
        FROM
          disk, collection_disks, collection, user
        WHERE
          authorization='`+ token +`' AND
          disk.id=collection_disks.disk_id AND
          collection.user_id=user.id AND
          collection.id=collection_disks.collection_id AND
          disk.id=`+ disk_id +`;
      `,
      function(err, result) {
        if (err) next(err, null);
        var is_valid = false;
        if (result[0].number_of_disks === 1) {
          is_valid = true;
        };
        next(null, is_valid);
      }
    )
  },
  'edit_disk': (disk_id, changes, next) => {
    connection.query(`
        UPDATE
          disk
        SET `+ changes +`
        WHERE id=`+ disk_id +`;
      `,
      function(err, _) {
        if (err) next(err, null);
        next(null, true);
      }
    )
  },
  'disk_exists': (disk_id, next) => {
    connection.query(
      `SELECT count(1) as number_of_disks FROM disk WHERE id=` + disk_id,
      function(err, result) {
        if (err) next(err, null);
        var disk_exists = false;
        if (result[0].number_of_disks !== 0) {
          disk_exists = true;
        };
        next(null, disk_exists);
      }
    );
  },
  'get_disk': (disk_id, next) => {
    connection.query(
      "SELECT name, producer, year, singer FROM disk WHERE id="+ disk_id +";",
      function(err, result) {
        if (err) next(err, null);
        next(null, {
          name: result[0].name,
          producer: result[0].producer,
          year: result[0].year,
          singer: result[0].singer
        });
      }
    );
  },
  'get_collection_disks': (token, collection_id, next) => {
    connection.query(`
      SELECT
        disk.id, disk.name, disk.producer, disk.year, disk.singer
      FROM
        user, collection, disk
        INNER JOIN collection_disks ON (
          collection_disks.disk_id=disk.id AND
          collection_disks.collection_id=`+ collection_id +`
        )
      WHERE
        user.authorization='`+ token +`' AND
        collection.id=collection_disks.collection_id AND
        collection.user_id=user.id;
      `,
      function(err, result) {
        if (err) next(err, null);
        var disks = [];
        for (var row=0; row < result.length; row++) {
          disks.push({
            id: result[row].id,
            name: result[row].name,
            producer: result[row].producer,
            year: result[row].year,
            singer: result[row].singer
          });
        };
        next(null, disks);
      }
    );
  },
  'insert_disk': (token, collection_id, data, next) => {
    connection.query(`
      INSERT INTO disk (name, producer, year, singer) VALUES (
        '`+ data['name'] +`',
        '`+ data['producer'] +`',
        '`+ data['year'] +`',
        '`+ data['singer'] +`'
      );
      `,
      function(err, result) {
        if (err) next(err, null);
        connection.query(`
          INSERT INTO collection_disks (collection_id, disk_id) VALUES (
            `+ collection_id +`, `+ result.insertId +`
          )
          `
        );
        next(null, result.insertId);
      }
    );
  }
};
