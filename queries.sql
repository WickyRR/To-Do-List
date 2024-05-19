CREATE TABLE dates(
    id SERIAL PRIMARY KEY,
    day DATE NOT NULL
);
CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    task VARCHAR(100) NOT NULL,
    refered_day DATE REFERENCES dates(id);
);