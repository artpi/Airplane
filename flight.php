<?php


$start = "aWMI";
$stop = "SVQ";
$connections = array("CRL", "STN", "BGY", "CIA", "DUB");
$perms = array();

for($i=0;$i<count($connections); $i++) {
	$perms[] = array($start, $connections[$i]);
	$perms[] = array($stop, $connections[$i]);
	$perms[] = array($connections[$i], $start);
	$perms[] = array($connections[$i], $stop);
}

for($i=0; $i<count($perms);$i++) {
	toSQL($perms[$i][0], $perms[$i][1]);
}

	//$db = new PDO('mysql:host=artpi.pl;dbname=artpi_tools;charset=utf8', 'artpi_tools', 'L1KH8UjU');
function parseDate($d) {
	if($d["m"] == "cze") {
		$m = "06";
	} else if($d["m"] == "lip") {
		$m = "07";
	}
	
	return $d["y"]."-".$m."-".$d["d"];
}
		
		
function toSQL($start, $stop) {
	if(file_exists($start."-".$stop.".json")){
		$json = file_get_contents($start."-".$stop.".json");
		$js = json_decode($json, true);
		
		if(count($js) < 2) {
			print($start."-".$stop.".json corrupted \r\n");
		}
		
		for($i=0; $i<count($js);$i++) {
			$date = parseDate($js[$i]["time"]);
			
			for($j=0; $j<count($js[$i]["flights"]); $j++) {
				$f = $js[$i]["flights"][$j];
				//echo $date." ".$f["id"]." ".$f["start"]." ".$f["end"]." ".$f["price"]."\r\n";
				print("INSERT INTO `flights`(`flight`, `src`, `dst`, `start`, `stop`, `airline`, `price`) VALUES ('".$f["id"]."','".$start."','".$stop."','".$date." ".$f["start"]."','".$date." ".$f["end"]."','ryan','".$f["price"]."');\r\n");
			}
		
		}
		
	} else {
		print($start."-".$stop.".json missing \r\n");
	}
	
}
?>
