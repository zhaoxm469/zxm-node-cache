import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

let filePath = (file:string) => path.resolve(__dirname, file);

// 判断文件是否存在
let isFileExisted = (file:string) => fs.existsSync(file)

class Cache {
    instance: null;
    cacheFilePath: string;
    static instance: any;
    constructor() {
        this.instance = null;
        // 缓存文件存放路径
        this.cacheFilePath = filePath('./.cache');
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Cache()
        }
        return this.instance;
    }
    /**
     * @description: 存储
     * @param { string } key        - 缓存对象的键值
     * @param { any } data          - 缓存的数据
     * @param {*} expirationTime    - 过期时间，默认30天
     */
    async save(key: string, data = '', expirationTime = 60 * 60 * 24 * 30) {
        if (!key) throw Error('cache.save ： key为必填项')

        // console.log('cache.save 设置缓存：' + key)

        // 判断是否存在缓存文件
        let isFileExis = isFileExisted(this.cacheFilePath)


        let saveData = {
            value: data,
            // 过期时间
            expirationTime: dayjs().add(expirationTime, 'second').valueOf()
        }

        // 不存在 ，创建并写入内容
        if (!isFileExis) {
            try {
                // 写入成功
                fs.writeFileSync(this.cacheFilePath, JSON.stringify({
                    [key]: saveData
                }))
            } catch (err) {
                throw Error('cache.save : 缓存写入失败')
            }
        } else {
            // 存在的话，先读取内容，在写入
            try {
                let cacheFiledata = JSON.parse(fs.readFileSync(this.cacheFilePath, 'utf-8'))
                cacheFiledata[key] = saveData;
                fs.writeFileSync(this.cacheFilePath, JSON.stringify(cacheFiledata))
            } catch (err) {
                throw Error('cache.save : 写入缓存时候，读取缓存文件里的内容失败')
            }
        }
    }
    // 获取缓存
    get(key: string) {

        // console.log('cache.get 读取缓存：' + key)

        // 判断是否存在缓存文件
        let isFileExis = isFileExisted(this.cacheFilePath);

        // 不存在直接返回空字符串
        if (!isFileExis) return '';

        // 如果存在，读取缓存文件
        let cacheFiledata = JSON.parse(fs.readFileSync(this.cacheFilePath, 'utf-8'))

        // 如果没有当前键名的缓存，直接返回空字符串
        if (!cacheFiledata[key]) return '';

        let { value, expirationTime } = cacheFiledata[key];

        // 如果当前时间，大于过期时间，代表缓存过期
        if (dayjs().valueOf() > expirationTime) {
            delete cacheFiledata[key];
            // console.log('cache.get : 缓存过期')
            return '';
        }

        return value;

    }
    // 根据key 清除对象的缓存
    clear(key: string | number) {
        // 判断是否存在缓存文件
        let isFileExis = isFileExisted(this.cacheFilePath);

        // 如果缓存文件不存在，直接返回空
        if (!isFileExis) return '';

        // 如果存在，读取缓存文件
        let cacheFiledata = JSON.parse(fs.readFileSync(this.cacheFilePath, 'utf-8'))

        delete cacheFiledata[key];

        // console.log('cache.clear : 单个缓存清除成功')

    }
    // 清空全部缓存
    clearAll() {
        let isFileExis = isFileExisted(this.cacheFilePath);
        if (!isFileExis) return;
        fs.unlinkSync(this.cacheFilePath)
        // console.log('cache.clearAll : 缓存全部清除成功')
    }

}

module.exports = Cache.getInstance();

