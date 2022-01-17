
CREATE TABLE grouplist(
    groupname varchar(64) not null primary key,
    uid bigint(20) unsigned not null,
    sign_start_time Date not null,
    sign_end_time Date not null,
    class_start_time Date not null,
    class_end_time Date not null,
    limit_headcount int not null,
    Approval_type boolean not null,
    FOREIGN KEY(uid) REFERENCES users(uid)
);

CREATE TABLE openclass(
    classname varchar(64) not null primary key,
    uid bigint(20) unsigned not null,
    groupname varchar(64) not null,
    classcontent varchar(1024) not null,
    headcount int not null default 0,
    FOREIGN KEY(uid) REFERENCES  users(uid),
    FOREIGN KEY(groupname) REFERENCES grouplist(groupname)
);

CREATE TABLE reqclass(
    classname varchar(64) not null,
    uid bigint(20) unsigned not null,
    reasons varchar(256) not null,
    approval_status boolean not null default 0,
    FOREIGN KEY(classname) REFERENCES openclass(classname),
    FOREIGN KEY(uid) REFERENCES users(uid)
);

ALTER TABLE users ADD COLUMN group_count int not null default 0;
select openclass.classname, openclass.uid, headcount, viewcount, register_time from openclass inner join grouplist on openclass.classname = grouplist.classname;

