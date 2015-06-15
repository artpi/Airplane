function mapMonth(month) {
    var mL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var mS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var m=mS.indexOf(month)+1;
    if(m<10) {
    	return "0"+m;
    } else {
    	return ""+m;
  
}