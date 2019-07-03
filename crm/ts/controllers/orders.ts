import { Request, Response, NextFunction } from 'express';
import { OrdersDao } from '../dao';
import * as utils from '../lib/utils';


//  列表
export async function findOrderList(req: Request, res: Response, next: NextFunction) {
    let { page, count, search } = req.query;
    let { offset, limit } = utils.getPageCount(page, count);
    let opts: any = {
        where: {  },
        offset: offset,
        limit: limit,
        order: [['created', 'desc']]
    };
    if (search && search !== '') {
        search = utils.trim(search);
        opts.where.$or = [
            { out_trade_no: { $like: `%${search}%` } },
            { transaction_id: { $like: `%${search}%` } },
            { prepay_id: { $like: `%${search}%` } },
            { '$users.nickname$': { $like: `%${search}%` } },
            { '$classes.title$': { $like: `%${search}%` } }
        ];
    }

    let result = await OrdersDao.getInstance().findOrderList(opts);
    if (!result) return res.sendErr('获取列表失败！');
    let data: any[] = [];
    result.rows.forEach(el => data.push(utils.cloneChildToSelf(el.get())));
    res.property('total', result.count);

    return res.sendOk(data);
}


