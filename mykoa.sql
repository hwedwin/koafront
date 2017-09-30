CREATE database mykoa;

use mykoa;

-- 管理员表
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` varchar(50) NOT NULL,
  `account` char(100) NOT NULL,
  `password` char(100) NOT NULL,
  `role` char(4) NOT NULL COMMENT '0：超级管理员，1：普通',
  `state` char(4) NOT NULL COMMENT '0：冻结，1：正常',
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `account` (`account`,`password`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=100284 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- 用户表
DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
  `id` varchar(50) NOT NULL COMMENT '用户id',
  `account` varchar(100) NOT NULL COMMENT '账户-手机号码',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `sex` char(4) NOT NULL DEFAULT '0' COMMENT '性别 0:保密，1:男，2:女',
  `headerImage` varchar(250) DEFAULT NULL COMMENT '头像路径',
  `birthday` BIGINT DEFAULT NULL COMMENT '生日',
  `phone` varchar(50) NOT NULL COMMENT '电话',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  `points` INT DEFAULT 0 COMMENT '积分',
  `useablePoints` INT DEFAULT 0 COMMENT '可用积分',
  `wxtoken` varchar(100) DEFAULT NULL COMMENT '微信授权token',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `wxtoken` (`wxtoken`),
  KEY `account` (`account`,`password`),
  CONSTRAINT uq_phone UNIQUE(phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table members add wxtoken varchar(100) default null unique;


-- 用户关系表
DROP TABLE IF EXISTS `memberRelations`;
CREATE TABLE `memberRelations` (
  `id` varchar(50) NOT NULL COMMENT '唯一标识id',
  `fxLevel` varchar(5) NOT NULL DEFAULT '1' COMMENT '1:一级分销级别，2:二级分销等级',
  `pid` varchar(50) NOT NULL COMMENT '上级id，包含上上级',
  `cid` varchar(50) NOT NULL COMMENT '用户id',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE,
  CONSTRAINT `member_relation_p` FOREIGN KEY (`pid`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `member_relation_c` FOREIGN KEY (`cid`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100284 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- 用户交易表
DROP TABLE IF EXISTS `memberTransactions`;
CREATE TABLE `memberTransactions` (
  `id` varchar(50) NOT NULL COMMENT '唯一标志id',
  `memberId` varchar(50) NOT NULL COMMENT '用户id',
  `money`  DECIMAL(12,2) DEFAULT 0 COMMENT '交易额',
  `type` char(4) NOT NULL COMMENT '收支类型：1（下级经销商注册收入），2（销售所得收入），3（销售所得佣金收入），4（购买商品支出），5（购买商品余额支出），6（注册经销商支出），7（提现支出）',
  `orderId` varchar(50) COMMENT '收入支出订单ID',
  `cId` varchar(50) COMMENT '收入支出注册经销商ID',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE,
  CONSTRAINT `member_transaction` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100284 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;


-- 用户账户表
DROP TABLE IF EXISTS `memberBalances`;
CREATE TABLE `memberBalances` (
  `id` varchar(50) NOT NULL COMMENT '唯一标志id',
  `memberId` varchar(50) NOT NULL COMMENT '用户id',
  `balance`  DECIMAL(12,2) DEFAULT 0 COMMENT '余额',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `memberId` (`memberId`) USING BTREE,
  CONSTRAINT `member_balance` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100284 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- 饮料品牌
DROP TABLE IF EXISTS `drinkBrands`;
CREATE TABLE `drinkBrands` (
  `id` varchar(50) NOT NULL COMMENT '唯一标识id',
  `brandName` varchar(200) NOT NULL COMMENT '品牌名',
  `categoryId` varchar(10) DEFAULT '1' COMMENT '1:白酒,2:红酒,3:啤酒,4:其他',
  `info` varchar(300) DEFAULT NULL COMMENT '信息',
  `logo` varchar(200) DEFAULT NULL COMMENT '品牌logo',
  `state` tinyint(4) DEFAULT 0 COMMENT '0:保存不上线，1:保存且上线', 
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- 饮料产品
DROP TABLE IF EXISTS `drinks`;
CREATE TABLE `drinks` (
  `id` varchar(50) NOT NULL,
  `brandName` varchar(100) DEFAULT NULL COMMENT '品牌',
  `categoryName` varchar(100) DEFAULT NULL COMMENT '种类', 
  `name` varchar(100) DEFAULT NULL COMMENT '名称',
  `shortName` varchar(100) DEFAULT NULL COMMENT '小标题',
  `origin` varchar(100) DEFAULT NULL COMMENT '原产地',
  `level` varchar(50) DEFAULT NULL COMMENT '等级',
  `standard` varchar(50) DEFAULT NULL COMMENT '规格',
  `recipe` varchar(200) DEFAULT NULL COMMENT '原料',
  `expire` varchar(50) DEFAULT NULL COMMENT '保质期',
  `taste` varchar(100) DEFAULT NULL COMMENT '口味',
  `storage` varchar(100) DEFAULT NULL COMMENT '储藏方式',
  `pruduceDate` varchar(50) DEFAULT NULL COMMENT '生产日期',
  `alcoholic` varchar(50) DEFAULT NULL COMMENT '酒精度',
  `factory` varchar(100) DEFAULT NULL COMMENT '生产厂家',
  `originPrice` DECIMAL(12,2) DEFAULT 0 COMMENT '原价',
  `retailPrice` DECIMAL(12,2) DEFAULT 0 COMMENT '零售价',
  `supplyPrice` DECIMAL(12,2) DEFAULT 0 COMMENT '出货价',
  `commission` DECIMAL(12,2) DEFAULT 0 COMMENT '佣金',
  `maxStorage` INT(11) DEFAULT '0' COMMENT '库存',
  `validStorage` INT(11) DEFAULT '0' COMMENT '可用库存',
  `limitBuy` smallint(11) DEFAULT '0' COMMENT '限购',
  `detail` text COMMENT '详情',
  `imgPath` varchar(200) DEFAULT NULL COMMENT '图片',
  `categoryId` varchar(50) DEFAULT NULL COMMENT '分类id',
  `brandId` varchar(50) DEFAULT NULL COMMENT '品牌id',
  `expressFee` tinyint(4) NOT NULL DEFAULT 0 COMMENT '快递费',
  `saleState` char(4) DEFAULT '0' COMMENT '状态为 0（未上架）改为 1（可销售）',
  `isDelete` char(4) DEFAULT '0' COMMENT '1：删除，0：未删除',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `name` (`name`,`shortName`) USING BTREE,
  CONSTRAINT `drink_brand` FOREIGN KEY (`brandId`) REFERENCES `drinkBrands` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
alter table drinks add saleCount INT(11) default 0 COMMENT '销售量';
alter table drinks add isRec char(4) default '0' COMMENT '是否为推荐产品';
alter table drinks add isHot char(4) default '0' COMMENT '是否为热卖产品';
alter table drinks add costPrice DECIMAL(12,2) DEFAULT 0 COMMENT '成本';

-- 饮料图片
DROP TABLE IF EXISTS `drinkImages`;
CREATE TABLE `drinkImages` (
  `id` varchar(50) NOT NULL,
  `imgPath` varchar(200) DEFAULT NULL,
  `drinkId` varchar(50) DEFAULT NULL,
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE,
  KEY `drinkId` (`drinkId`) USING BTREE,
  CONSTRAINT `drink_images` FOREIGN KEY (`drinkId`) REFERENCES `drinks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------2----------------

-- 购物车
DROP TABLE IF EXISTS `shopCarts`;
CREATE TABLE `shopCarts` (
  `id` varchar(50) NOT NULL,
  `memberId` varchar(45) NOT NULL COMMENT '用户id',
  `drinkId` varchar(45) NOT NULL COMMENT '产品id',
  `nums` SMALLINT DEFAULT 1 COMMENT '数量',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE,
  CONSTRAINT `cart_drink` FOREIGN KEY (`drinkId`) REFERENCES `drinks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_member` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 收件人地址
DROP TABLE IF EXISTS `consignees`;
CREATE TABLE `consignees` (
  `id` varchar(50) NOT NULL,
  `memberId` varchar(100) NOT NULL COMMENT '用户id',
  `consigneeName` varchar(100) NOT NULL COMMENT '收件人姓名',
  `consigneeMobile` varchar(100) NOT NULL COMMENT '收件人电话',
  `province` varchar(100) NOT NULL COMMENT '省',
  `city` varchar(100) NOT NULL COMMENT '城市',
  `county` varchar(100) NOT NULL COMMENT '县',
  `address` varchar(500) NOT NULL COMMENT '地址',
  `isDefault` char(4) DEFAULT '0' COMMENT '1：默认地址，0：非默认地址',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `consignee_member` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 订单
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` varchar(50) NOT NULL,
  `memberId` varchar(100) NOT NULL COMMENT '用户id',
  `progressState` char(4) DEFAULT NULL COMMENT '订单处理状态 ,1待付款,2待配货, 3发货中,4待签收,5待退款,9交易成功,19:已退款,99:交易取消',
  `progressInfo` varchar(100) DEFAULT NULL COMMENT '订单状态详细信息',
  `code` varchar(100) NOT NULL COMMENT '订单码',
  `payInfo` varchar(100) DEFAULT NULL COMMENT '付款状态（支付宝-微信）',
  `totalPrice` DECIMAL(12,2) DEFAULT 0 COMMENT '商品总金额',
  `expressFee` tinyint(4) DEFAULT 0 COMMENT '物流费用',
  `orderTotalPrice` DECIMAL(12,2) DEFAULT 0 COMMENT '订单总金额',
  `orderTotalDiscount` DECIMAL(12,2) DEFAULT 0 COMMENT '全部折扣的金额',
  `paidCode` varchar(100) DEFAULT NULL COMMENT '付款码',
  `orderImage` varchar(200) DEFAULT NULL COMMENT '订单图-商品图',
  `orderFrom` varchar(50) DEFAULT NULL COMMENT '订单来源',
  `isDeleted` char(4) DEFAULT '0' COMMENT '是否删除',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  `agentId` varchar(50) DEFAULT NULL COMMENT '代理人id，从哪个人的店买的',
  `hasChecked` date DEFAULT NULL COMMENT '对账时间',
  `createdTimestamp` BIGINT NOT NULL COMMENT '创建时间时间戳',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `order_member` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_agent` FOREIGN KEY (`agentId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
alter table orders add createdTimestamp BIGINT NOT NULL COMMENT '创建时间时间戳';


-- 订单商品
DROP TABLE IF EXISTS `drinkForOrders`;
CREATE TABLE `drinkForOrders` (
  `id` varchar(50) NOT NULL,
  `orderId` varchar(50) NOT NULL COMMENT '订单ID',
  `drinkId` varchar(50) NOT NULL COMMENT '商品ID',
  `nums` smallint DEFAULT 0 COMMENT '数量',
  `price` DECIMAL(12,2) DEFAULT 0 COMMENT '成交金额',
  `discountTotal` DECIMAL(12,2) DEFAULT 0 COMMENT '总折扣金额',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `drinkForOrders_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 订单收货地址
DROP TABLE IF EXISTS `consigneeForOrders`;
CREATE TABLE `consigneeForOrders` (
  `id` varchar(50) NOT NULL,
  `orderId` varchar(50) NOT NULL COMMENT '订单ID',
  `consigneeName` varchar(100) NOT NULL COMMENT '收货人',
  `consigneeMobile` varchar(50) NOT NULL COMMENT '收货人电话',
  `expressTimeType` varchar(100) DEFAULT NULL COMMENT '收货时间',
  `province` varchar(100) NOT NULL COMMENT '省',
  `city` varchar(100) NOT NULL COMMENT '市',
  `county` varchar(100) NOT NULL COMMENT '县',
  `address` varchar(500) NOT NULL COMMENT '详细地址',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `consignee_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 订单快递信息
DROP TABLE IF EXISTS `expressForOrders`;
CREATE TABLE `expressForOrders` (
  `id` varchar(50) NOT NULL,
  `orderId` varchar(50) NOT NULL COMMENT '订单ID',
  `expressName` varchar(100) NOT NULL COMMENT '快递公司名',
  `expressAliasesName` varchar(100) DEFAULT NULL COMMENT '快递别名',
  `expressCode` varchar(100) NOT NULL COMMENT '快递单号',
  `expressPhone` varchar(100) NOT NULL COMMENT '快递联系电话',
  `expressStatus` char(4) NOT NULL DEFAULT '0' COMMENT '是否需要推送的状态，默认为0 需要推送，1已推送，不需要再推送了',
  `expressInfo` text COMMENT '快递信息',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE,
  CONSTRAINT `express_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- 收藏
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `id` varchar(50) NOT NULL,
  `memberId` varchar(50) NOT NULL,
  `drinkId` varchar(50) NOT NULL,
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `favorite_member` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `favorite_drink` FOREIGN KEY (`drinkId`) REFERENCES `drinks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- -------------- 3 新增轮播图，每日精选----------------
-- 轮播indexTopAdvs
DROP TABLE IF EXISTS `indexTopAdvs`;
CREATE TABLE `indexTopAdvs` (
  `id` varchar(50) NOT NULL,
  `drinkId` varchar(50) NOT NULL COMMENT '商品id',
  `href` varchar(200) DEFAULT NULL COMMENT '跳转连接，备用',
  `imgPath` varchar(200) DEFAULT NULL COMMENT '图片',
  `isShow` char(4) DEFAULT '0' COMMENT '是否展示，1：展示，0：隐藏',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `indexTopAdvs_drink` FOREIGN KEY (`drinkId`) REFERENCES `drinks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 每日特卖indexTopAdvs
DROP TABLE IF EXISTS `indexTopSpecials`;
CREATE TABLE `indexTopSpecials` (
  `id` varchar(50) NOT NULL,
  `drinkId` varchar(50) NOT NULL COMMENT '商品id',
  `isShow` char(4) DEFAULT '0' COMMENT '是否展示，1：展示，0：隐藏',
  `isDelete` char(4) DEFAULT '0' COMMENT '是否删除，1：删除',
  `specialPrice` DECIMAL(12,2) DEFAULT 0 COMMENT '特卖价格',
  `startTime` bigint COMMENT '开始时间',
  `endTime` bigint COMMENT '结束时间',
  `timeChunk` char(50) NOT NULL COMMENT '时间段',
  `createdAt` date NOT NULL COMMENT '创建时间',
  `updatedAt` date NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `indexTopSpecials_drink` FOREIGN KEY (`drinkId`) REFERENCES `drinks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
alter table indexTopSpecials add specialPriceAgent DECIMAL(12,2) DEFAULT 0 COMMENT 'j经销商特卖价格';




















