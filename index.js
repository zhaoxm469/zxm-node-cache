"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var dayjs_1 = __importDefault(require("dayjs"));
var filePath = function (file) { return path_1.default.resolve(__dirname, file); };
// 判断文件是否存在
var isFileExisted = function (file) { return fs_1.default.existsSync(file); };
var Cache = /** @class */ (function () {
    function Cache() {
        this.instance = null;
        // 缓存文件存放路径
        this.cacheFilePath = filePath('./.cache');
    }
    Cache.getInstance = function () {
        if (!this.instance) {
            this.instance = new Cache();
        }
        return this.instance;
    };
    /**
     * @description: 存储
     * @param { string } key        - 缓存对象的键值
     * @param { any } data          - 缓存的数据
     * @param {*} expirationTime    - 过期时间，默认30天
     */
    Cache.prototype.save = function (key, data, expirationTime) {
        if (data === void 0) { data = ''; }
        if (expirationTime === void 0) { expirationTime = 60 * 60 * 24 * 30; }
        return __awaiter(this, void 0, void 0, function () {
            var isFileExis, saveData, cacheFiledata;
            var _a;
            return __generator(this, function (_b) {
                if (!key)
                    throw Error('cache.save ： key为必填项');
                isFileExis = isFileExisted(this.cacheFilePath);
                saveData = {
                    value: data,
                    // 过期时间
                    expirationTime: dayjs_1.default().add(expirationTime, 'second').valueOf()
                };
                // 不存在 ，创建并写入内容
                if (!isFileExis) {
                    try {
                        // 写入成功
                        fs_1.default.writeFileSync(this.cacheFilePath, JSON.stringify((_a = {},
                            _a[key] = saveData,
                            _a)));
                    }
                    catch (err) {
                        throw Error('cache.save : 缓存写入失败');
                    }
                }
                else {
                    // 存在的话，先读取内容，在写入
                    try {
                        cacheFiledata = JSON.parse(fs_1.default.readFileSync(this.cacheFilePath, 'utf-8'));
                        cacheFiledata[key] = saveData;
                        fs_1.default.writeFileSync(this.cacheFilePath, JSON.stringify(cacheFiledata));
                    }
                    catch (err) {
                        throw Error('cache.save : 写入缓存时候，读取缓存文件里的内容失败');
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    // 获取缓存
    Cache.prototype.get = function (key) {
        // console.log('cache.get 读取缓存：' + key)
        // 判断是否存在缓存文件
        var isFileExis = isFileExisted(this.cacheFilePath);
        // 不存在直接返回空字符串
        if (!isFileExis)
            return '';
        // 如果存在，读取缓存文件
        var cacheFiledata = JSON.parse(fs_1.default.readFileSync(this.cacheFilePath, 'utf-8'));
        // 如果没有当前键名的缓存，直接返回空字符串
        if (!cacheFiledata[key])
            return '';
        var _a = cacheFiledata[key], value = _a.value, expirationTime = _a.expirationTime;
        // 如果当前时间，大于过期时间，代表缓存过期
        if (dayjs_1.default().valueOf() > expirationTime) {
            delete cacheFiledata[key];
            // console.log('cache.get : 缓存过期')
            return '';
        }
        return value;
    };
    // 根据key 清除对象的缓存
    Cache.prototype.clear = function (key) {
        // 判断是否存在缓存文件
        var isFileExis = isFileExisted(this.cacheFilePath);
        // 如果缓存文件不存在，直接返回空
        if (!isFileExis)
            return '';
        // 如果存在，读取缓存文件
        var cacheFiledata = JSON.parse(fs_1.default.readFileSync(this.cacheFilePath, 'utf-8'));
        delete cacheFiledata[key];
        // console.log('cache.clear : 单个缓存清除成功')
    };
    // 清空全部缓存
    Cache.prototype.clearAll = function () {
        var isFileExis = isFileExisted(this.cacheFilePath);
        if (!isFileExis)
            return;
        fs_1.default.unlinkSync(this.cacheFilePath);
        // console.log('cache.clearAll : 缓存全部清除成功')
    };
    return Cache;
}());
module.exports = Cache.getInstance();
