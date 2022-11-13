//------------------------------------------------------------------------------------------------------
//Bond: the cost for a courtesy phone (and charger) only if the customer is a “consumer” type.
//      If customer is "business", no bond is required.
//------------------------------------------------------------------------------------------------------
//Assume there is a list of courtesy items as below:
let courtesyList = [{item: 'iPhone', bond: 275},
					{item: 'otherPhone', bond: 100},
					{item: 'charger', bond: 30}
				   ];
				   
//We will use "appState" object to track the form change when users interact with the app			   
let appState = {customerType: 'customer',
				courtesyPhone: {item: 'none', bond: 0 },//Allow to borrow ONLY 1 phone
				courtesyCharger: {item: 'none', bond: 0},//Allow to borrow ONLY 1 charger
				cost: {bond: 0, serviceFee: 0, subTotal: 0, gst: 0, totalFee: 0},
			};

//Validate purchase date
$('#purchaseDate').change(function() {
	let today = new Date();

	let purchase_date = new Date($(this).val());
	
	if (purchase_date.getTime() > today.getTime()) {
		alert("Purchase date is not valid");
		$(this).val("");
	} else { 
		//alert("Valid purchase date");
	}
})

//------------------------------------------------------------------------------------------------------
//Service Fee: $85 if the customer’s phone is "not warranty", else $0.00
//------------------------------------------------------------------------------------------------------
$('#repairDate').change(function(){
	//Set purchase date
	let purchaseDate = new Date($('#purchaseDate').val());
	//Set repair date
	let repairDate = new Date($('#repairDate').val());
	//Set Warranty date
	const warrantyDate = new Date();
	warrantyDate.setFullYear(purchaseDate.getFullYear() + 2, purchaseDate.getMonth(), purchaseDate.getDate());

	if (warrantyDate > repairDate) {
		alert('Under warranty');
		appState.cost.serviceFee = 0;
		appState.cost.subTotal = appState.cost.serviceFee + appState.cost.bond;
		appState.cost.gst = (appState.cost.bond + appState.cost.serviceFee)*0.15;
		appState.cost.totalFee = appState.cost.serviceFee + appState.cost.bond + appState.cost.gst;

		$('#warranty').prop('checked', true);
		$('#serviceFee').val(appState.cost.serviceFee);
		$('#subTotal').val(appState.cost.subTotal);
		$('#gst').val(appState.cost.gst);
		$('#totalFee').val(appState.cost.totalFee);
	}else {
		alert('Not Under Warranty');
		appState.cost.serviceFee = 85;
		appState.cost.subTotal = appState.cost.serviceFee + appState.cost.bond;
		appState.cost.gst = (appState.cost.bond + appState.cost.serviceFee)*0.15;
		appState.cost.totalFee = appState.cost.serviceFee + appState.cost.bond + appState.cost.gst;

		$('#warranty').prop('checked', false);
		$('#serviceFee').val(appState.cost.serviceFee);
		$('#subTotal').val(appState.cost.subTotal);
		$('#gst').val(appState.cost.gst);
		$('#totalFee').val(appState.cost.totalFee);
	}
});

//-------------------------
//Handle click "add" button event:
$('#addBtn').click(function(clickEvent){
	//The preventDefault() method cancels the default action that belongs to the event
	//https://www.w3schools.com/jsref/event_preventdefault.asp
	clickEvent.preventDefault();
	
	//Get selected item from id="itemList"
	let selectedItemText = $('#itemList').find(":selected").text();//Get selected "option" text
	let selectedItemValue = $('#itemList').find(":selected").val();//Get selected "option" value
	let selectedItemBond = courtesyList.find(foundItem => foundItem.item.toLowerCase() == selectedItemValue.toLowerCase()).bond;
	
	//Build HMLT (render) new row:
	let newRow = `
				<tr class="selected-item">
					<td class="itemID" style="display: none;">${selectedItemValue}</td>
					<td>${selectedItemText}</td>
					<td>${selectedItemBond}</td>
				</tr>			
			`;
	
	//Add this new item to the table id="borrowItems" if it's not exisiting yet
	if(appState.courtesyPhone.item == "none" && selectedItemValue.toLowerCase().includes("phone")) {
		//Add a new row
		$('#borrowItems').append(newRow);
		//Update the appState
		appState.courtesyPhone.item = selectedItemValue;
		appState.courtesyPhone.bond = selectedItemBond;
		

		//Update the bond
		if($('#customerType').is(':checked')) {
			appState.cost.bond = appState.courtesyPhone.bond + appState.courtesyCharger.bond;
			appState.cost.subTotal = appState.cost.serviceFee + appState.cost.bond;
			appState.cost.gst = (appState.cost.bond + appState.cost.serviceFee)*0.15;
			appState.cost.totalFee = (appState.cost.serviceFee + appState.cost.bond + appState.cost.gst);

			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
			$('#subTotal').val(appState.cost.subTotal);
			$('#gst').val(appState.cost.gst);
			$('#totalFee').val(appState.cost.totalFee);

		} else {
			appState.cost.bond = 0;
			appState.cost.subTotal = appState.cost.serviceFee + appState.cost.bond;
			appState.cost.gst = (appState.cost.bond + appState.cost.serviceFee)*0.15;
			appState.cost.totalFee = (appState.cost.serviceFee + appState.cost.bond + appState.cost.gst);

			$('#bond').val(appState.cost.bond);
			$('#subTotal').val(appState.cost.subTotal);
			$('#gst').val(appState.cost.gst);
			$('#totalFee').val(appState.cost.totalFee);
		}
		
	} else if (appState.courtesyCharger.item == "none" && selectedItemValue.toLowerCase().includes("charger")) {
		//Add a new row
		$('#borrowItems').append(newRow);
		//Update the appState
		appState.courtesyCharger.item = selectedItemValue;
		appState.courtesyCharger.bond = selectedItemBond;
		appState.cost.bond = appState.courtesyPhone.bond + appState.courtesyCharger.bond;
		
		
		//Update the bond
		if($('#customerType').is(':checked')) {
			appState.cost.subTotal = appState.cost.bond + appState.cost.serviceFee;
			appState.cost.gst = (appState.cost.bond + appState.cost.serviceFee)*0.15;
			appState.cost.totalFee = (appState.cost.serviceFee + appState.cost.bond + appState.cost.gst);

			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
			$('#subTotal').val(appState.cost.subTotal);
			$('#gst').val(appState.cost.gst);
			$('#totalFee').val(appState.cost.totalFee);
		} else {
			appState.cost.bond = 0;
			appState.cost.subTotal = appState.cost.bond + appState.cost.serviceFee;
			appState.cost.gst = (appState.cost.bond + appState.cost.serviceFee)*0.15;
			appState.cost.totalFee = (appState.cost.serviceFee + appState.cost.bond + appState.cost.gst);

			$('#bond').val(appState.cost.bond);
			$('#subTotal').val(appState.cost.subTotal);
			$('#gst').val(appState.cost.gst);
			$('#totalFee').val(appState.cost.totalFee);
		}
		
	} else {
		alert("There is already an item selected");
	}
});

//-------------------------
//Handle click "remove" button event:
$('#removeBtn').click(function(clickEvent){
	clickEvent.preventDefault();		
	$('.selected-item').remove();	
	//Update bond
	$('#bond').val(0.00);
	//Update appState object
	appState.courtesyPhone = {item: 'none', bond: 0 };
	appState.courtesyCharger = {item: 'none', bond: 0 };
});

//-------------------------
//Update customerType when user clicks "Customer Type" radio buttons:
$("#customerType").click(function(){    
	//Update appState: customerType and bond displaying on UI
	appState.customerType = 'customer';
	$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
});	
$("#businessType").click(function(){        
	appState.customerType = 'business';
	$('#bond').val(0);
});	


//------------------------------------------------------------------------------------------------------
//Submit: Validate form using HTML technique & pop up repair-booking.hmtl page
//------------------------------------------------------------------------------------------------------
$('#repair-booking').submit(function(e) {
	//1: preventDefault() method cancels the default action that belongs to the event
	e.preventDefault();
	
	//2: Store "repair-booking-data" in localStorage and send it to "repair-booking.html" webpage
	let repairBookingData = {firstname: $('#fname').val(),
							   lastname: $('#lname').val() };	
	//3: Convert "repair-booking-data" object to JSON string
	localStorage.setItem("repair-booking-data", JSON.stringify(repairBookingData));
	console.log(JSON.stringify(repairBookingData));
	
	//4: Open repair-booking.html
	window.open("repair-booking.html");//Open on new window
	//window.location.href = "invoice.html"; //open on the same window	
	
});

//-----------------
//loadRepairBooking data 
function loadRepairBooking() {
	//Get data sent from index.html stored in local storage
	let passedData = localStorage.getItem("repair-booking-data");
	console.log(passedData);
	//
	let extractedData = JSON.parse(passedData);
	//
	document.getElementById("firstname").innerHTML = extractedData.firstname;
	document.getElementById("lastname").innerHTML = extractedData.lastname;
}

//------------------------------------------------------------------------------------------
$('#repair-booking').submit(function(e) {
	//1: preventDefault() method cancels the default action that belongs to the event
	e.preventDefault();
	
	
	//2: Store "repair-booking-data" in local and send to "repair-booking.html"
	let repairBookingData = {
		title: $('#inputTitle').val(),
		firstname: $('#fname').val(),
		lastname: $('#lname').val(),
		address: $('#street').val(),
		addressSuburb: $('#suburb').val(),
		addressCity: $('#city').val(),
		postcode: $('#postcode').val(),
		phoneNumber: $('#phone').val(),
		email: $('#email').val(),
		purchaseDate: $('#purchaseDate').val(),
		repairDate: $('#repairDate').val(),
		warranty: $('#warranty').val(),
		imei: $('#imeiNumber').val(),
		phoneMake: $('#phoneMake').val(),
		model: $('#modelNumber').val(),
		faultCat: $('#faultCategory').val(),
		faultDesc: $('#faultDescription').val(),
		itemTable: $('#borrowItems').val(),
		bond: $('#bond').val(),
		serviceFee: $('#serviceFee').val(),
		subTotal: $('#subTotal').val(),
		gst: $('#gst').val(),
		total: $('#totalFee').val()
	};	
	//3: Convert "repair-booking-data" to JSON string
	localStorage.setItem("repair-booking-data", JSON.stringify(repairBookingData));
	console.log(JSON.stringify(repairBookingData));
	
	//4: Open repair-booking.html
	window.open("repair-booking.html");//Open on new window
});

//creating invoice number
var jobNum = 0000;
localStorage.setItem("jobNo", jobNum);

//------------------------------------------------------------------------------------------
//loadRepairBooking data 
function loadRepairBooking() {
	//Get data from index.html in local storage
	let passedData = localStorage.getItem("repair-booking-data");
	console.log(passedData);
	//
	let extractedData = JSON.parse(passedData);
	//
	const time = new Date();
	const currentTime = time.getHours() + ':' + time.getMinutes();

	const payDate = new Date(extractedData.repairDate);
	//Add one to month
	const payDueDate = payDate.getFullYear() + '-' + (payDate.getMonth() + 1) + '-' + (payDate.getDate() + 5);
	
	//Customer
	document.getElementById("title").innerHTML = extractedData.title;
	document.getElementById("firstname").innerHTML = extractedData.firstname;
	document.getElementById("lastname").innerHTML = extractedData.lastname;
	document.getElementById("address").innerHTML = extractedData.address;
	document.getElementById("addressSuburb").innerHTML = extractedData.addressSuburb;
	document.getElementById("addressCity").innerHTML = extractedData.addressCity;
	document.getElementById("addressPostcode").innerHTML = extractedData.postcode;
	document.getElementById("phoneNumber").innerHTML = extractedData.phoneNumber;
	document.getElementById("emailOutput").innerHTML = extractedData.email;
	//Job Info
	jobNum++;
	localStorage.setItem("jobNo", jobNum);
	//Repair job
	document.getElementById("jobNumber").innerHTML = localStorage.getItem("jobNo");
	document.getElementById("invoiceDate").innerHTML = extractedData.repairDate;
	document.getElementById("invoiceTime").innerHTML = currentTime;
	document.getElementById("paymentDue").innerHTML = payDueDate;
	//Repair details
	document.getElementById("purchaseDateOutput").innerHTML = extractedData.purchaseDate;
	document.getElementById("repairDateTimeOutput").innerHTML = extractedData.repairDate;
	document.getElementById("repairTime").innerHTML = currentTime;
	
	//document.getElementById("warrantyOutput").innerHTML = extractedData.warranty;
	//warranty output
	if(extractedData.warranty == false) {
		document.getElementById("warrantyOutput").innerHTML = "No";
	} else {
		document.getElementById("warrantyOutput").innerHTML = "Yes";
	};
	//

	document.getElementById("imeiNumberOutput").innerHTML = extractedData.imei;
	document.getElementById("deviceMakeOutput").innerHTML = extractedData.phoneMake;
	document.getElementById("modelNumberOutput").innerHTML = extractedData.model;
	document.getElementById("faultCategoryOutput").innerHTML = extractedData.faultCat;
	document.getElementById("faultDescriptionOutput").innerHTML = extractedData.faultDesc;
	//Item table
	document.getElementById("itemTable").innerHTML = extractedData.itemTable;
	//Fees
	document.getElementById("bondOutput").innerHTML = extractedData.bond;
	document.getElementById("serviceFeeOutput").innerHTML = extractedData.serviceFee;
	document.getElementById("subTotalOutput").innerHTML = extractedData.subTotal;
	document.getElementById("gstOutput").innerHTML = extractedData.gst;
	document.getElementById("totalOutput").innerHTML = extractedData.total;
	document.getElementById("amountDue").innerHTML = extractedData.total;
}


