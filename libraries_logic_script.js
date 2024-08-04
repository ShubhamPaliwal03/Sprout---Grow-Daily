const clock_canvas = document.getElementById('clock-canvas');
const ctx = clock_canvas.getContext('2d');

(function () {

	// set the start point of the hour, minute and second hand to top
	
	const threePIByTwo = (3 * Math.PI) / 2;
	
	console.log(threePIByTwo);
	
	let amOrPm = 'AM';
	
	const clock_canvasBg = '#f3f3f3'; // #1C1C28
	
	// define colors for hour, minute and second hand
	
	const hourActiveColor = '#39D98A',
	minuteActiveColor = '#3E7BFA',
	secondActiveColor = '#FDAC42';
	
	// define inactive colors for hour, minute and second hand
	
	const hourInactiveColor = '#3C4043',
	minuteInactiveColor = '#2E3134',
	secondInactiveColor = '#282A2D';
	
	const timerBg = '#282A2D';
		
		function init()
	{
		clock_canvas.width = document.documentElement.clientWidth - 35;
		clock_canvas.height = document.documentElement.clientHeight - 45;
		
		// call the draw function repeatedly at a rate of 60 times per second
		
		window.requestAnimationFrame(draw);	
	}

	function draw()
	{
		// finding center point of clock_canvas
		
		const centerX = clock_canvas.width / 2;
		const centerY = clock_canvas.height / 2;
		
		const date = new Date();
		
		let hr = date.getHours();
		let min = date.getMinutes();
		let sec = date.getSeconds();
		let ms = date.getMilliseconds();
		
		if(hr > 12)
			{
				amOrPm = 'PM';
				hr -= 12;
			}
			
			/* defines how much radians each hand should move */
			
			let radH = 0.000008333 * ( ( hr * 60 * 60 * 1000 ) + ( min * 60 * 1000 ) + ( sec * 1000 ) + ms );
			let radM = 0.0001 * ( ( min * 60 * 1000 ) + ( sec * 1000 ) + ms );
			let radS = 0.006 * ( ( sec * 1000 ) + ms );
			
			
			// draw clock canvas
			
			drawRect(0, 0, clock_canvas.width, clock_canvas.height, clock_canvasBg);
			
			// hour hand
			
		drawCircle(centerX, centerY, 110, 0, 360 , false, hourInactiveColor, 'stroke', 90);
		drawCircle(centerX, centerY, 110, threePIByTwo, rad(radH) + threePIByTwo, false, hourActiveColor, 'stroke', 90);
		
		// minute hand
		
		drawCircle(centerX, centerY, 180, 0, 360, false, minuteInactiveColor, 'stroke', 50);
		drawCircle(centerX, centerY, 180, threePIByTwo, rad(radM) + threePIByTwo, false, minuteActiveColor, 'stroke', 50);
		
		// second hand
		
		drawCircle(centerX, centerY, 220, 0, 360, false, secondInactiveColor, 'stroke', 30);
		drawCircle(centerX, centerY, 220, threePIByTwo, rad(radS) + threePIByTwo, false, secondActiveColor, 'stroke', 30);
		
		// digital timer
		
		drawCircle(centerX, centerY, 90, 0, 360, false, timerBg, 'fill', '50');
		drawText(`${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")} ${amOrPm}`, clock_canvas.width / 2 - 60, clock_canvas.height / 2 + 15, '#ffffff', '28px');
		
		window.requestAnimationFrame(draw);
	}

	init();

	// convert degree to radians

	function rad(deg){
		
		return  (Math.PI / 180) * deg;
	}

	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth();

	const day = document.querySelector(".calendar-dates");

	const currdate = document
	.querySelector(".calendar-current-date");

	const prenexIcons = document
	.querySelectorAll(".calendar-navigation span");

	// array of month names

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];

	// function to generate the calendar

	const manipulate = () => {
		
		// get the first day of the month
		
		let dayone = new Date(year, month, 1).getDay();
		
		// get the last date of the month
		
		let lastdate = new Date(year, month + 1, 0).getDate();
		
		// get the day of the last date of the month
		
		let dayend = new Date(year, month, lastdate).getDay();
		
		// get the last date of the previous month
		
		let monthlastdate = new Date(year, month, 0).getDate();
		
		// variable to store the generated calendar HTML
		
		let lit = "";
		
		// loop to add the last dates of the previous month
		
		for (let i = dayone; i > 0; i--) {
			lit +=
			`<li class="inactive">${monthlastdate - i + 1}</li>`;
		}
		
		// loop to add the dates of the current month
		
		for (let i = 1; i <= lastdate; i++) {
			
			// check if the current date is today
			
			let isToday = i === date.getDate()
			&& month === new Date().getMonth()
			&& year === new Date().getFullYear()
			? "active"
			: "";
			
			lit += `<li class="${isToday}">${i}</li>`;
		}
		
		// loop to add the first dates of the next month
		
		for (let i = dayend; i < 6; i++) {
			lit += `<li class="inactive">${i - dayend + 1}</li>`
		}
		
		// update the text of the current date element
		// with the formatted current month and year
		
		currdate.innerText = `${months[month]} ${year}`;
		
		// update the HTML of the dates element 
		// with the generated calendar
		
		day.innerHTML = lit;
	}

	manipulate();

	// attach a click event listener to each icon

	prenexIcons.forEach(icon => {
		
		// when an icon is clicked
		
		icon.addEventListener("click", () => {
			
			// check if the icon is "calendar-prev" or "calendar-next"
			
			month = icon.id === "calendar-prev" ? month - 1 : month + 1;

			// check if the month is out of range
			
			if (month < 0 || month > 11) {

				// set the date to the first day of the month with the new year
				
				date = new Date(year, month, new Date().getDate());
				
				// set the year to the new year
				
				year = date.getFullYear();
				
				// set the month to the new month
				
				month = date.getMonth();
			}
			
			else {
				
				// set the date to the current date
				
				date = new Date();
			}
			
			// call the manipulate function to update the calendar display
			
			manipulate();
		});
	});

	const ldBar = document.querySelector('.ldBar');

	ldBar.setAttribute("data-value", 59);
})();