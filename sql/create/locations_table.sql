CREATE TABLE sampling_locations (
    objectid integer primary key,
    geom geometry(Point, 3071) NOT NULL,
    primary_station_name text NOT NULL
);