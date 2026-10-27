CREATE TABLE pfas_sites (
    geom geometry(Point, 4326) NOT NULL,
    objectid integer primary key,
    SITENAME text NOT NULL
);
