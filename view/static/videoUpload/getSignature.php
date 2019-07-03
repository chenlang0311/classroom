<?php
header('Access-Control-Allow-Origin: *'); // 允许前端跨域访问

// Step 1：获取签名所需信息获取得到的签名所需信息，如下
$secret_id = "";
$secret_key = "";

// Step 2：设置签名有效时间
$current = time();
$expired = $current + 86400;  // 签名有效期：1天

// Step 3：根据客户端所提交的文件信息，拼装参数列表

$arg_list = array(
    "secretId" => $secret_id,
    "currentTimeStamp" => $current,
    "expireTime" => $expired,
    "random" => rand());

// Step 4：生成签名
$orignal = http_build_query($arg_list);
$signature = base64_encode(hash_hmac('SHA1', $orignal, $secret_key, true).$orignal);

echo $signature;