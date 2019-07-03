import { Request, Response, NextFunction } from 'express';
import { CategoriesDao } from '../dao';
import * as utils from '../lib/utils';


//  列表
export async function findOrderList(req: Request, res: Response, next: NextFunction) {

    let opts: any = {
        order: [['level', 'asc']]
    };
    let result = await CategoriesDao.getInstance().findList(opts);
    if (!result) return res.sendErr('获取列表失败！');
    let data: any[] = [];
    result.rows.forEach(el => data.push(utils.cloneChildToSelf(el.get())));
    res.property('total', result.count);
    return res.sendOk(data);
}