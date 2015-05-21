<?php


include("config.php");
$db = new PDO(DB, DB_USER, DB_PASS);


function conn($src, $dst, $when) {
    $lastline = exec("phantomjs --ignore-ssl-errors=true wizz.js ".$src." ".$dst." ".$when, $return, $status);
    return json_decode(implode($return), true);
}



function cashConvert($price) {
    if(stristr($price, "zł") !== false) {
        $price = str_replace("zł", "", $price);
        return $price/4;
    } elseif(stristr($price, "€") !== false) {
        return str_replace("€", "", $price);
    } else {
        return $price;
    }
}

function read($src, $dst, $when) {
    global $db;
    $arr = conn($src, $dst, $when);
    for($i=0; $i<count($arr); $i++) {
        $f = $arr[$i];
        $db->query("INSERT INTO `flights`(`src`, `dst`, `start`, `stop`, `airline`, `price`) VALUES ('".$src."','".$dst."','".$f["start"]."','".$f["stop"]."','wizz','".cashConvert($f["price"])."');");
    }
}

$dests = array("EIN", "BGY", "CRL");

for($i=0; $i<count($dests); $i++) {
    read($dests[$i],"WAW", "28/06/2015");
}


?>