"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Dao extends base_1.DaoBase {
    constructor(seqz, modelName) {
        super(seqz, modelName);
    }
    static getInstance(seqz = base_1.SeqzDao.getInstance()) {
        if (!Dao.instance)
            Dao.instance = new Dao(seqz, this.tableName);
        return Dao.instance;
    }
    async findByPrimary(id) {
        let res = await this.model().findByPrimary(id);
        return res ? res.get() : undefined;
    }
    async updateRead(id) {
        let sql = "UPDATE `videos` SET `reads`=`reads`+1 WHERE `id` = " + id;
        let res = (await base_1.SeqzDao.getInstance().query(sql))[0];
        return res && res.changedRows == 1 ? 1 : undefined;
    }
    async findVideosList(opts, search) {
        let modelName = 'authors';
        let modelJoin = this.model(modelName);
        opts.include = [{
                model: modelJoin, as: modelName, where: { state: "normal" }, attributes: ['name'],
            }];
        opts.distinct = true;
        if (search != '*' && search) {
            opts.where = opts.where || {};
            opts.where.$or = opts.where.$or || [];
            opts.where.$or.push({ '$videos.title$': { $like: `%${search}%` } });
            opts.where.$or.push({ '$authors.name$': { $like: `%${search}%` } });
        }
        let res = await this.model().findAndCount(opts);
        return res ? res : undefined;
    }
    async creatPage(opts) {
        let res = await this.model().create(opts);
        return res ? res : undefined;
    }
    async findVideosInfo(id) {
        let modelName = 'authors';
        let modelJoin = this.model(modelName);
        let opts = {
            attributes: ['id', 'author_id', 'category', 'video_link', 'title', 'abstract', 'source_link', 'duration', 'cover_pic', 'reads', 'reads', 'state', 'modified', 'created', 'publish_id'],
            where: { state: "normal", id: id },
        };
        opts.include = [{
                model: modelJoin, as: modelName, where: { state: "normal" }, attributes: ['name'],
            }];
        opts.distinct = true;
        let res = await this.model().findOne(opts);
        return res ? res : undefined;
    }
    async findVideosByPrimary(id) {
        let res = await this.model().findByPrimary(id);
        return res ? res.get() : undefined;
    }
    async deleteVideos(id) {
        let res = await this.model().update({ state: 'deleted' }, { where: { id: id } });
        return res && res[0] === 1 ? res[0] : undefined;
    }
    async findVideos(opts) {
        let sql = "SELECT `id` FROM `videos` AS `pages` WHERE if('" + opts.id + "'!='undefined',`pages`.`id` = '" + opts.id + "',1=1) AND if('" + opts.author_id + "'!='undefined',`pages`.`author_id` = '" + opts.author_id + "',1=1) AND if('" + opts.category + "'!='undefined',`pages`.`category` = '" + opts.category + "',1=1)  AND if('" + opts.title + "'!='undefined',`pages`.`title` = '" + opts.title + "',1=1) AND if('" + opts.abstract + "'!='undefined',`pages`.`abstract` = '" + opts.abstract + "',1=1) AND if('" + opts.content + "'!='undefined',`pages`.`content` = '" + opts.content + "',1=1) AND if('" + opts.source_link + "'!='undefined',`pages`.`source_link` = '" + opts.source_link + "',1=1)  AND if('" + opts.cover_pic + "'!='undefined',`pages`.`cover_pic` = '" + opts.cover_pic + "',1=1)  AND if('" + opts.reads + "'!='undefined',`pages`.`reads` = '" + opts.reads + "',1=1)  AND if('" + opts.desc + "'!='undefined',`pages`.`desc` = '" + opts.desc + "',1=1) AND if('" + opts.video_link + "'!='undefined',`pages`.`video_link` = '" + opts.video_link + "',1=1) AND if('" + opts.duration + "'!='undefined',`pages`.`duration` = '" + opts.duration + "',1=1)";
        let res = (await base_1.SeqzDao.getInstance().query(sql))[0];
        return res ? res : undefined;
    }
    async updateVideos(opts) {
        let sql = "UPDATE `videos` SET author_id = (case when '" + opts.author_id + "'!='undefined' then '" + opts.author_id + "' else author_id end), category = (case when '" + opts.category + "'!='undefined' then '" + opts.category + "' else category end), title = (case when '" + opts.title + "'!='undefined' then '" + opts.title + "' else title end), abstract = (case when '" + opts.abstract + "'!='undefined' then '" + opts.abstract + "' else abstract end),content = (case when '" + opts.content + "'!='undefined' then '" + opts.content + "' else content end),source_link = (case when '" + opts.source_link + "'!='undefined' then '" + opts.source_link + "' else source_link end),cover_pic = (case when '" + opts.cover_pic + "'!='undefined' then '" + opts.cover_pic + "' else cover_pic end),cover_pic = (case when '" + opts.cover_pic + "'!='undefined' then '" + opts.cover_pic + "' else cover_pic end),`reads` = (case when '" + opts.reads + "'!='undefined' then '" + opts.reads + "' else `reads` end),`desc` = (case when '" + opts.desc + "'!='undefined' then '" + opts.desc + "' else `desc` end),`video_link` = (case when '" + opts.video_link + "'!='undefined' then '" + opts.video_link + "' else `video_link` end),`duration` = (case when '" + opts.duration + "'!='undefined' then '" + opts.duration + "' else `duration` end)  where id=" + opts.id;
        let res = (await base_1.SeqzDao.getInstance().query(sql))[0];
        return res && res.changedRows == 1 ? 1 : undefined;
    }
    async findVideosById(id) {
        let res = await this.model().findOne({ where: { id: id, state: "normal" } });
        return res ? res : undefined;
    }
    async findTotalVideos(category, search) {
        let modelName = 'authors';
        let modelJoin = this.model(modelName);
        let opts = {
            attributes: ['id'],
            where: { state: "normal" },
            order: [['created', 'desc']]
        };
        opts.include = [{
                model: modelJoin, as: modelName, where: { state: "normal" }, attributes: ['name'],
            }];
        opts.distinct = true;
        if (category != '*' && category) {
            opts.where.category = category;
        }
        if (search != '*' && search) {
            opts.where = opts.where || {};
            opts.where.$or = opts.where.$or || [];
            opts.where.$or.push({ '$videos.title$': { $like: `%${search}%` } });
            opts.where.$or.push({ '$authors.name$': { $like: `%${search}%` } });
        }
        let res = await this.model().findAll(opts);
        return res ? res.length : undefined;
    }
}
Dao.tableName = 'videos';
exports.VideosDao = Dao;

//# sourceMappingURL=../maps/dao/videos.js.map
