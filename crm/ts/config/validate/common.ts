export const page: any = {
    optional: true,
    isInt: {
        options: [{ min: 1, max: 999999 }]
    },
    errorMessage: '页码错误'
}

export const count: any = {
    optional: true,
    isInt: {
        options: [{ min: 1, max: 999999 }]
    },
    errorMessage: '页码错误'
}

export const order_sort: any = {
    optional: true,
    myWhitelisted: {
        options: ['desc', 'asc']
    },
    errorMessage: '排序错误'
}

export const id: any = {
    isInt: true,
    errorMessage: 'id错误'
}

export const name: any = {
    notEmpty: true,
    errorMessage: '名称不能为空'
}

export const pic: any = {
    notEmpty: true,
    errorMessage: '图片错误'
}