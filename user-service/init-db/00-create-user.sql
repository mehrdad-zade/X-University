-- force-create the role & DB on first init
CREATE ROLE xuniv_user WITH LOGIN PASSWORD 'xuniv_pass';
CREATE DATABASE xuniversity OWNER xuniv_user;
